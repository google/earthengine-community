"""Earth Engine Agent.

WARNING: THIS TOOL IS UNSAFE, AS IT AUTOMATICALLY RUNS LLM-GENERATED
PYTHON CODE! USE AT YOUR OWN RISK.

THERE IS NO GUARANTEE THAT THE GENERATED CODE GIVES CORRECT ANSWERS
EVEN IF THE AGENT DECLARES SUCCESS.

Earth Engine Agent allows you to interact with the Earth Engine (EE) API
The agent utilizes Large Language Models (LLMs) to:
 * generate EE code snippets based on a user query
 * describe image tiles obtained from EE
 * decide whether the tile matches the query.

Usage:
   ee_agent <topic>

Arguments:
   <topic>  The topic or question you want to visualize using Earth Engine.

Examples:
   ee_agent Australia DEM
   ee_agent New York City

Prerequisites:
   Before running the tool, make sure to:
   - Install the required dependencies:
    `pip install earthengine-api google-generativeai pillow numpy matplotlib requests`
   - Configure authentication for the Earth Engine API by running
     `earthengine authenticate`.
     See https://developers.google.com/earth-engine/guides/auth
   - Set the `GOOGLE_API_KEY` environment variable with your Google API
     key. See https://ai.google.dev/tutorials/setup

Description:
   Earth Engine Agent takes a topic or question as input and generates
   an Earth Engine code snippet that visualizes the requested information
   in one map tile. It uses LLMs to understand the user's query,
   generate appropriate EE code, and analyze the resulting map tile
   for relevance.

Implementation:
   The tool follows these steps:

   1. Takes the user's question as input.
   2. Uses an LLM (currently only Gemini is supported) to generate
      an EE code snippet based on the user's question.
   3. Executes the generated code snippet to retrieve a map tile URL
      from the EE API, trying to correct code execution errors.
   4. Uses Gemini image recognition to analyze the content and relevance
      of the retrieved map tile.
   5a. If the map tile is deemed relevant to the user's query, the agent
      displays the map tile using matplotlib and exits successfully.
   5b. If the map tile is not satisfactory, the agent tries again, using
      the LLM's feedback to refine the EE code.

   During the execution, the tool prints the generated EE code,
   the retrieved map tile URL, the LLM's analysis of the map tile,
   and any error messages encountered.

TODO(simonf): add a colab demo
"""
import contextlib
import dataclasses
import io
import json
import os
import re
import sys
import time
from typing import Any, Callable, Optional
import ee
import google.api_core
import google.generativeai as genai
import matplotlib.pyplot as plt
import numpy as np
import PIL
import requests

genai.configure(api_key=os.environ.get('GOOGLE_API_KEY'))


class AgentError(Exception):
  pass


def extract_code(text: str) -> str:
  parts = text.split('```')
  if len(parts) == 3:
    return parts[1].removeprefix('python').strip()
  else:
    return (
        text.replace('```\npython', '')
        .replace('```', '')
        .replace('python', '')
        .strip()
    )


def get_image(image_url: str) -> bytes:
  """Fetches from Earth Engine the content of the given URL as bytes."""
  response = requests.get(image_url)

  if response.status_code == 200:
    return response.content
  else:
    error_message = f'Error downloading image: {response}'
    try:
      error_details = (
          json.loads(response.content.decode()).get('error', {}).get('message')
      )
      if error_details:
        error_message += f' - {error_details}'
    except json.JSONDecodeError:
      pass
    raise AgentError(error_message)


def show_image(url: str):
  image = PIL.Image.open(io.BytesIO(get_image(url)))
  plt.imshow(image)
  plt.axis('off')
  plt.tight_layout(pad=0)
  plt.show()


brief = """Use brief, matter-of-fact style. Avoid repetitions, pontifications,
embellishments, and platitides. Do not use long or fancy words."""


class LLM:
  """Parent LLM class."""

  def chat(self, question: str, temperature: Optional[float] = None) -> str:
    raise NotImplementedError("Subclasses must implement the 'chat' method.")

  def analyze_image(self, url: str) -> str:
    raise NotImplementedError(
        "Subclasses must implement the 'analyze_image' method."
    )


class Gemini(LLM):
  """Gemini LLM."""

  def __init__(self):
    self._text_model = genai.GenerativeModel('gemini-1.5-pro-latest')
    self._image_model = genai.GenerativeModel('gemini-pro-vision')
    self._chat_proxy = self._text_model.start_chat(history=[])

  def chat(self, question: str, temperature: Optional[float] = None) -> str:
    """Adds a question to the ongoing chat session."""
    # Always delay a bit to reduce the chance for rate-limiting errors.
    time.sleep(1)
    sleep_duration = 10
    while True:
      response = ''
      try:
        response = self._chat_proxy.send_message(
            brief + question,
            generation_config={
                'temperature': temperature,
                # Use a generous but limited output size to encourage in-depth
                # replies.
                'max_output_tokens': 5000,
            }
        )
        if not response.parts:
          raise ValueError(
              'Cannot get analysis with reason'
              f' {response.candidates[0].finish_reason.name}, terminating'
          )
      except (
          google.api_core.exceptions.TooManyRequests,
          google.api_core.exceptions.DeadlineExceeded
      ):
        print(
            'Got a rate limit or timeout error, sleeping for'
            f' {sleep_duration} seconds'
        )
        time.sleep(sleep_duration)
        continue
      return response.text

  def analyze_image(self, url: str) -> str:
    image = PIL.Image.open(io.BytesIO(get_image(url)))
    width, height = image.size
    num_bands = len(image.getbands())
    image_array = np.array(image)
    image_min = np.min(image_array)
    image_max = np.max(image_array)

    print('Width = %d, height = %d, num_bands=%d' % (width, height, num_bands))
    print('Min = %d, max = %d' % (image_min, image_max))

    # Skip an LLM call when we can simply tell that something is wrong.
    # (Also, LLMs might hallucinate on uniform images.)
    if image_min == image_max:
      return (
          f'The image tile has a single uniform color with value '
          f'{image_min}.'
      )

    req = {
        'parts': [
            {
                'text': """
You are an objective, precise overhead imagery analyst. Describe what the
provided map tile depicts in terms of:

    1. The colors, textures, and patterns visible in the image.
    2. The spatial distribution, shape, and extent of distinct features or regions.
    3. Any notable contrasts, boundaries, or gradients between different areas.

Avoid making assumptions about the specific geographic location, time period,
or cause of the observed features. Focus solely on the literal contents of the
image itself.

If the image is ambiguous or unclear, state so directly. Do not speculate or
hypothesize beyond what is directly visible.

Use clear, concise language. Avoid subjective interpretations or analogies.
Organize your response into structured paragraphs.
"""
            },
            {'inline_data': image},
        ]
    }
    image_response = self._image_model.generate_content(req)
    try:
      return image_response.text
    except ValueError as e:
      print(f'UNEXPECTED IMAGE RESPONSE: {e}')
      print(image_response)
      breakpoint()


def exec_code(code: str) -> Any:
  with io.StringIO() as output, contextlib.redirect_stdout(output):
    exec(code)
    return output.getvalue()


@dataclasses.dataclass
class CodeContext:
  code: str = ''
  error: str = ''
  temperature: float = 0


def get_tile_url_and_code(
    llm: LLM, question: str, recommendation: str) -> tuple[str, str]:
  """Returns an EE tile URL and the LLM-generated EE code that produced it.

  Args:
    llm: an LLM instance
    question: a text prompt containing the user question
    recommendation: an optional text string containing recommendations
      from the previous iterations
  Returns:
    a tuple of two strings, the URL extracted from running LLM-generated
      Earth Engine code and the code that produced the URL.
  """
  def parse_url(code_output: str) -> str:
    url_match = re.search(
        r'(https://earthengine\.googleapis\.com/[^\s\'"]+)', code_output
    )
    if url_match:
      return url_match.group(1)
    else:
      raise ValueError(code_output)
  return run_llm_code(llm, question, recommendation, parse_url)


def run_llm_code(
    llm: LLM, question: str, recommendation: str,
    code_callback: Callable[[str], Any]) -> tuple[Any, str]:
  """Returns an EE tile URL and the LLM-generated EE code that produced it.

  Args:
    llm: an LLM instance
    question: a text prompt containing the user question
    recommendation: an optional text string containing recommendations
      from the previous iterations
    code_callback:
      a function accepting a string (code output) and returning the value
      extracted from it (or raising an exception)

  Returns:
    a tuple of two strings, the result of running code_callback on the output
    of LLM-generated Earth Engine code and the code that produced the output.
  """
  prompt = question
  if recommendation:
    prompt += (
        f"""\nTake into account the following recommendations obtained from
        previous attempts:\n{recommendation}"""
    )

  old_context = CodeContext()
  error_count = 0

  while True:
    answer = llm.chat(prompt, temperature=old_context.temperature)
    print(f'\nANSWER:\n{answer}\n')

    new_context = CodeContext()
    new_context.code = extract_code(answer)
    if new_context.code == old_context.code:
      prompt = (
          """This is the same code you suggested before, which still
          generates the same error. Please try something different."""
      )
      new_context.temperature = 1
      old_context = new_context
      error_count += 1
      continue

    old_context.code = new_context.code

    try:
      code_output = exec_code(new_context.code)
      result = code_callback(code_output)
      return result, new_context.code
    except Exception as e:
      if isinstance(e, AgentError):
        # This is a kind of error we want to bring up to the user instead of
        # trying to make the LLM fix it.
        raise
      error_count += 1
      new_context.error = str(e)
      print(f'ERROR:\n{new_context.error}')
      prompt = (
          f"""This code produced an error, please fix it. ***{new_context.error}***"""
      )

      if old_context.error == new_context.error:
        prompt += (
            """This error happened again, so please take a deep breath, think
            about the root cause, and revise the code more substantially to
            address the problem."""
        )
        new_context.temperature = 1
      else:
        prompt = (
            """Revise the code and output a new version. Think about the broader
            context of the question and how well the code matches this
            context."""
        )
        new_context.temperature = 0.5

      prompt += (
          f"""'\nThis is error number {error_count}. The higher the error count,
          the more you should revise the code, possibly starting from
          scratch."""
      )
      old_context = new_context


def run_agent(
    text_llm: LLM, image_llm: LLM, question: str, recommendation: str = ''
) -> None:
  """Outer loop running the agent until a high score is reached."""
  codes: list[str] = []
  evals: list[str] = []
  round_num = 0

  while True:
    old_code = codes[-1] if codes else None
    old_eval = evals[-1] if evals else None
    url, code = get_tile_url_and_code(text_llm, question, recommendation)
    print(url)
    analysis = image_llm.analyze_image(url)
    print(f'\nIMAGE ANALYSIS:\n{analysis}')

    eval_question = (
        f"""An Earth Engine map
        tile was produced containing the following: ***{analysis}***.  Start
        your answer with a number between 0 and 1 indicating how relevant
        the image is as an answer to the user question. Discuss whether it
        is a good answer, taking into account both the location and the
        content of the image. Do not be confused if an RGB image is
        described as false-color or grayscale - some RGB images might be
        muted or not appear in a standard way. The image tile is an overhead
        image - if the image description talks about something else, unless
        it's clearly metaphorical, like describing nightlights as stars,
        reject the image description as irrelevant and give a low score. The
        map tile is expected to only have visual data, but no legend or or
        other enhancement, so don\t penalize their absence. Make sure you
        have enough justification to definitively declare the answer good -
        it's better to give a false negative than a false positive. However,
        if you see some unambiguous evidence that the image fits (eg, the
        outlines of Manhattan island for a request to show NYC), give a high
        score - don't just hedge looking for more evidence. Do not assume"
        too much (eg, that the presence of expected colors means the
        presence of expected features); attempt to find multiple independent
        lines of evidence before declaring victory. If there is ambiguity or
        uncertainty, express it in your analysis. Do not output information
        not relevant to the image. Make the answer concise with a bulleted
        list of pros and cons. Example answer format: 0.55 Pros: * The image
        shows Bay Area Cons: * The color palette does not indicate NDVI even
        though an NDVI image of the Bay Area was requested. """
    )
    evaluation = text_llm.chat(eval_question)
    print(f'\nEVALUATION:\n{evaluation}')

    score_match = re.search(
        r'(\d*\.?\d+|\d+)', evaluation.strip().split('\n')[0]
    )
    if score_match:
      score = float(score_match.group(1))
    else:
      print('Could not extract the score, assuming 0')
      score = 0

    if score < 0.9:
      round_num += 1
      codes.append(code)
      evals.append(evaluation)
      recommendation_question = (
          f"""Given the history of previous attempts, what would you recommend to
          do differently in the future code to answer the given request? Do
          not comment on cosmetic things like code style; concentrate on
          substantive suggestions. Output your recommendation in a form that
          another LLM can take as side input to a code generation request.
          Try to give advice specific to the current problem and the current
          output. Do not suggest overly complex changes - try to find fixes
          that can be expressed in a few lines of code. Rank your advice by
          importance. Limit output to five suggestions.\n\nThis is tile
          fretrieval round {round_num}. The higher the round, the more you
          should consider trying a different approach or a different
          geometry than earlier."""
      )
      for i, (old_code, old_eval) in enumerate(zip(codes, evals)):
        recommendation_question += (
            f'CODE {i+1}\n{old_code}\n\nEVAL {i+1}\n{old_eval}\n\n'
        )
      recommendation = text_llm.chat(recommendation_question)
      print(f'\nRECOMMENDATIONS:\n{recommendation}')
    else:
      print(url)
      print('SUCCESS!!!')
      show_image(url)
      break


def main(argv: list[str]) -> None:
  ee.Initialize()
  text_llm = Gemini()
  image_llm = Gemini()
  topic = ' '.join(argv[1:])

  question = (
      f"""You are an expert coder. Write Python Earth Engine code to show
      {topic} in one tile and retrieve the tile as an image via getThumbUrl using
      the 'dimensions' parameter (not via geemap and not via getMapId). Do
      not use Javascript. Use ```python to denote the code portion of your
      answer. Choose a specific large geometry, not just a single point,
      with a high chance of containing a clear image answering the
      question. Just output the code that can be run directly with no
      explanations aimed at humans. Do not use tasks or exporting, just get
      the tile URL. Do not fetch the image itself. Prefer mosaicing image
      collections, don't get individual images from collections via
      'first()'. Choose a tile size and zoom level that will ensure the
      tile has enough pixels in it to avoid graininess, but not so many
      that processing becomes very expensive. Do not use wide date ranges
      with collections that have many images, but remember that Landsat and
      Sentinel-2 have revisit period of several days. Do not use sample
      locations - try to come up with actual locations that are relevant to
      the request. By the time you call getThumbUrl, the image must have
      only 1 or 3 bands. Only single-band images can have a palette.
      Remember to specify visualization parameters to display
      floating-point data as an image tile. Visualization parameters must
      be set individually at the top level of the getThumbUrl arguments,""" +
      """ eg, getThumUrl({'min': 0, 'max': 100, 'palette': ['white', 'green'],"
      'region': geometry, 'dimensions': 512})."""
  )

  run_agent(text_llm, image_llm, question)


if __name__ == '__main__':
  main(sys.argv)
