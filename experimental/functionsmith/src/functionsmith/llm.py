"""Chat clients for various LLMs."""

import os
import time

import anthropic
from google import genai
from google.genai import types
import openai


class LLM:
  """Parent class for LLM clients."""
  _model_name: str

  @property
  def model_name(self):
    return self._model_name


class Gemini(LLM):
  """Gemini client.

  Some model names:

  * gemini-1.5-flash
  * gemini-1.5-pro
  * gemini-exp-1206
  * gemini-2.0-flash-exp
  """

  def __init__(
      self, system_instruction, model_name='gemini-2.0-flash-exp', api_key=None
  ):
    if not api_key and os.getenv('GOOGLE_API_KEY'):
      api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
      raise ValueError(
          'Please set the environment variable GOOGLE_API_KEY '
          'or pass the api_key parameter'
      )
    self._model_name = model_name
    self._client = genai.Client(api_key=api_key)
    self._chat = self._client.chats.create(
        model=model_name,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.1,
        ),
    )

  def chat(self, question):
    """Sends a single message to the LLM and returns its response."""
    while True:
      try:
        return self._chat.send_message(question).text
      except Exception as e:  # pylint:disable=broad-exception-caught:
        if '429' in str(e):
          time.sleep(10)
          continue
        print('UNEXPECTED RESPONSE')
        raise Exception(e) from e  # pylint:disable=broad-exception-raised


class Claude(LLM):
  """Claude client.

  Some model names:

  * claude-3-5-sonnet-20241022
  * claude-3-opus-20240229
  """

  def __init__(
      self, system_prompt, model_name='claude-3-5-sonnet-20241022', api_key=None
  ):

    if not api_key and os.getenv('ANTHROPIC_API_KEY'):
      api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
      raise ValueError(
          'Please set the environment variable ANTHROPIC_API_KEY '
          'or pass the api_key parameter'
      )
    self._client = anthropic.Anthropic(api_key=api_key)
    self._system_prompt = system_prompt
    self._model_name = model_name
    self._messages = []

  def _send_message(self, temperature) -> anthropic.types.Message:
    """Sends a single message to the LLM as a part of a larger chat."""
    while True:
      try:
        return self._client.messages.create(
            model=self._model_name,
            system=self._system_prompt,
            max_tokens=4096,
            messages=self._messages,
            temperature=temperature,
        )
      except anthropic.RateLimitError:
        time.sleep(10)
        continue
      except Exception as e:  # pylint:disable=broad-exception-caught:
        print(f'UNEXPECTED RESPONSE: {e}')
        raise Exception(e) from e  # pylint:disable=broad-exception-raised

  def chat(self, question, temperature=0.1):
    """Sends a single message to the LLM and returns its response."""
    self._messages.append({'role': 'user', 'content': question})

    response = self._send_message(temperature)
    model_answer = response.content
    self._messages.append({'role': 'assistant', 'content': model_answer})
    return ' '.join([x.text for x in response.content])


class ChatGPT(LLM):
  """ChatGPT client.

  Some model names:

  * gpt-4-turbo
  * gpt-4o
  * o1-preview
  * o1-mini
  * o3-mini
  """

  def __init__(
      self, system_prompt, model_name='o3-mini', api_key=None, base_url=None
  ):
    if not api_key and os.getenv('OPENAI_API_KEY'):
      api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
      raise ValueError(
          'Please set the environment variable OPENAI_API_KEY '
          'or pass the api_key parameter'
      )
    self._model_name = model_name
    self._system_prompt = system_prompt
    self._client = openai.OpenAI(api_key=api_key, base_url=base_url)
    # Some models cannot handle a separate message with the system prompt,
    # so we will prepend the prompt to the first user message later.
    self._messages = []

  def _one_message(self, **kwargs):
    """Sends a single message to the LLM with error handling."""
    while True:
      try:
        return self._client.chat.completions.create(**kwargs)
      except Exception as e:  # pylint:disable=broad-exception-caught:
        if '429' in str(e):
          time.sleep(10)
          continue
        print(f'UNEXPECTED RESPONSE: {e}')
        raise Exception(e) from e  # pylint:disable=broad-exception-raised

  def chat(self, question, temperature=1):
    """Sends a single message to the LLM and returns its response."""
    if not self._messages:
      question = self._system_prompt + question
    self._messages.append({'role': 'user', 'content': question})

    kwargs = {
        'model': self._model_name,
        'messages': self._messages,
        'temperature': temperature,
    }
    response = self._one_message(**kwargs)
    content = response.choices[0].message.content
    self._messages.append({'role': 'assistant', 'content': content})
    return content


class DeepSeek(ChatGPT):
  """DeepSeek client.

  It uses the openai client, but the base_url is different.

  Some model names:

  * deepseek-chat
  * deepseek-reasoner
  """

  def __init__(self, system_prompt, model_name='deepseek-chat', api_key=None):
    if not api_key and os.getenv('DEEPSEEK_API_KEY'):
      api_key = os.getenv('DEEPSEEK_API_KEY')
    super().__init__(
        system_prompt,
        model_name=model_name,
        api_key=api_key,
        base_url='https://api.deepseek.com',
    )
