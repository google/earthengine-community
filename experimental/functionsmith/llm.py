import os
import time

import anthropic
import openai
from google import genai
from google.genai import types

class LLM:
  pass

class Gemini(LLM):
  def __init__(self, system_instruction):
    client = genai.Client(api_key=os.environ['GOOGLE_API_KEY'])
    self._chat = client.chats.create(
      #model='gemini-1.5-flash',
      model='gemini-1.5-pro',
      #model='gemini-exp-1206',
      config=types.GenerateContentConfig(
          system_instruction=system_instruction,
          temperature=0.1,
      )
    )

  def chat(self, question):
    return self._chat.send_message(question).text

class Claude(LLM):
  #MODEL_NAME = 'claude-3-haiku-20240307'
  #MODEL_NAME = 'claude-3-sonnet-20240229'
  #MODEL_NAME = 'claude-3-5-sonnet-20240620'
  MODEL_NAME = 'claude-3-5-sonnet-20241022'
  #MODEL_NAME = 'claude-3-opus-20240229'

  def __init__(self, system_prompt):
    self._client = anthropic.Anthropic(api_key=os.environ['ANTHROPIC_API_KEY'])
    self._system_prompt = system_prompt
    self._messages = []

  def _send_message(self, temperature):
    sleep_duration = 10
    while True:
      try:
        return self._client.messages.create(
            model=self.MODEL_NAME,
            system=self._system_prompt,
            max_tokens=4096,
            messages=self._messages,
            temperature=temperature
        )
      except anthropic.RateLimitError as e:
        time.sleep(10)
        continue
      except Exception as e:
        print(f'UNEXPECTED RESPONSE: {e}')
        if '500' in str(e):
          continue

  def chat(self, question, temperature=0.1):
    self._messages.append({"role": "user", "content": question})

    response = self._send_message(temperature)
    model_answer = response.content
    self._messages.append({"role": "assistant", "content": model_answer})
    return ' '.join([x.text for x in response.content])


class ChatGPT(LLM):
  #MODEL_NAME = "gpt-4-turbo"
  #MODEL_NAME = "gpt-4o"
  #MODEL_NAME = "gpt-4"
  #MODEL_NAME = "o1-preview"
  MODEL_NAME = "o1-mini"

  def __init__(self, system_prompt):
    self.system_prompt = system_prompt
    self.client = openai.OpenAI(api_key=os.environ['OPENAI_API_KEY'])
    self._messages = [
        {"role": "user", "content": system_prompt}
    ]

  def _one_message(self, **kwargs):
    while True:
      try:
        return self.client.chat.completions.create(**kwargs)
      except Exception as e:
        if '429' in str(e):
          time.sleep(10)
          continue
        print('UNEXPECTED RESPONSE')
        print(e)

  def chat(self, question, temperature=1):
    self._messages.append(
        {"role": "user", "content": question}
    )

    #time.sleep(1)
    kwargs = {
        'model': self.MODEL_NAME,
        'messages': self._messages,
        'temperature': temperature,
    }
    response = self._one_message(**kwargs)
    content = response.choices[0].message.content
    self._messages.append({"role": "assistant", "content": content})
    return content
