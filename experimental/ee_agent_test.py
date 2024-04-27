#!/usr/bin/python3

from unittest import mock
from absl.testing import absltest
import ee_agent
import google.generativeai as genai


class TestLLMCode(absltest.TestCase):

  def __init__(self, *args):
    super().__init__(*args)
    self.enter_context(mock.patch.object(genai, 'GenerativeModel'))
    self.enter_context(mock.patch.object(ee_agent, 'show_image'))

  def test_extract_code(self):
    text_with_code = (
        'Some text\n```python\nprint("Hello, World!")\n```\nMore text'
    )
    code = ee_agent.extract_code(text_with_code)
    self.assertEqual(code, 'print("Hello, World!")')

    text_without_code = 'Some text without code'
    code = ee_agent.extract_code(text_without_code)
    self.assertEqual(code, 'Some text without code')

  @mock.patch('requests.get')
  def test_get_image(self, mock_get):
    mock_response = mock.MagicMock()
    mock_response.status_code = 200
    mock_response.content = b'image_content'
    mock_get.return_value = mock_response

    image = ee_agent.get_image('https://example.com/image.jpg')
    self.assertEqual(image, b'image_content')

  @mock.patch('ee_agent.exec_code')
  def test_get_tile_url_success(self, mock_exec):
    mock_exec.return_value = 'https://earthengine.googleapis.com/tile_url'
    mock_llm = mock.MagicMock()
    mock_llm.chat.return_value = (
        '```python\nprint("https://earthengine.googleapis.com/tile_url")\n```'
    )
    url, code = ee_agent.get_tile_url_and_code(
        mock_llm, 'question', 'recommendation')
    self.assertEqual(
        code.strip(), 'print("https://earthengine.googleapis.com/tile_url")'
    )
    self.assertEqual(url, 'https://earthengine.googleapis.com/tile_url')

  @mock.patch('ee_agent.exec_code')
  def test_get_tile_url_bad_url(self, mock_exec):
    mock_exec.side_effect = ee_agent.AgentError('BAD URL')
    mock_llm = mock.MagicMock()
    mock_llm.chat.return_value = '```python\nprint("invalid_url")\n```'

    with self.assertRaisesRegex(ee_agent.AgentError, 'BAD URL'):
      ee_agent.get_tile_url_and_code(mock_llm, 'question', 'recommendation')

  @mock.patch(
      'ee_agent.exec_code', side_effect=[ee_agent.AgentError('my_error'), None]
  )
  def test_get_tile_url_code_error(self, mock_exec):
    del mock_exec  # unused
    mock_llm = mock.MagicMock()
    mock_llm.chat.side_effect = [
        '```python\nprint("url1")\n```',
        '```python\nprint("url2")\n```',
        '```python\nprint("https://earthengine.googleapis.com/tile_url")\n```',
    ]

    with self.assertRaisesRegex(ee_agent.AgentError, 'my_error'):
      ee_agent.get_tile_url_and_code(mock_llm, 'question', 'recommendation')

  def test_get_tile_url_repeated_code_error(self):
    mock_llm = mock.MagicMock()
    question = 'What is the Earth Engine URL for a Landsat 8 image?'
    recommendation = None

    mock_llm.chat.side_effect = [
        'Here is the code to get the URL:\n```python\nraise ValueError("Test error")\n```',
        'Here is the code to get the URL:\n```python\nraise ValueError("Test error")\n```',
        'Here is the revised code:\n```python\nprint("https://earthengine.googleapis.com/api/thumb?thumbid=abc123")\n```'
    ]

    url, code = ee_agent.get_tile_url_and_code(
        mock_llm, question, recommendation)
    del code  # unused

    self.assertEqual(
        'https://earthengine.googleapis.com/api/thumb?thumbid=abc123', url)

    expected_prompts = [
        question,
        'Revise the code and output a new version. Think about the broader\n            context of the question and how well the code matches this\n            context.\'\nThis is error number 1. The higher the error count,\n          the more you should revise the code, possibly starting from\n          scratch.',
        'This is the same code you suggested before, which still\n          generates the same error. Please try something different.'
    ]
    expected_temps = [0, 0.5, 1]

    for call, expected_prompt, expected_temp in zip(
        mock_llm.chat.call_args_list, expected_prompts, expected_temps):
      self.assertEqual(expected_prompt, call[0][0])
      self.assertEqual(expected_temp, call[1]['temperature'])

  def test_get_tile_url_repeated_error(self):
    mock_llm = mock.MagicMock()
    question = 'What is the Earth Engine URL for a Landsat 8 image?'
    recommendation = None

    mock_llm.chat.side_effect = [
        'Here is the code to get the URL:\n```python\nraise ValueError("Test error 1")\n```',
        'Here is the revised code:\n```python\nraise ValueError("Test error 2")\n```',
        'Here is the revised code:\n```python\nprint("https://earthengine.googleapis.com/api/thumb?thumbid=abc123")\n```'
    ]

    url, code = ee_agent.get_tile_url_and_code(
        mock_llm, question, recommendation)
    del code  # unused

    self.assertEqual(
        'https://earthengine.googleapis.com/api/thumb?thumbid=abc123', url)

    expected_prompts = [
        question,
        'Revise the code and output a new version. Think about the broader\n            context of the question and how well the code matches this\n            context.\'\nThis is error number 1. The higher the error count,\n          the more you should revise the code, possibly starting from\n          scratch.',
        'Revise the code and output a new version. Think about the broader\n            context of the question and how well the code matches this\n            context.\'\nThis is error number 2. The higher the error count,\n          the more you should revise the code, possibly starting from\n          scratch.'
    ]
    expected_temps = [0, 0.5, 0.5]

    for call, expected_prompt, expected_temp in zip(
        mock_llm.chat.call_args_list, expected_prompts, expected_temps):
      self.assertEqual(expected_prompt, call[0][0])
      self.assertEqual(expected_temp, call[1]['temperature'])

  @mock.patch('requests.get')
  def test_analyze_image(self, mock_get):
    mock_response = mock.MagicMock()
    mock_response.status_code = 200
    # a valid 2x1 GIF image
    mock_response.content = b'GIF87a\x02\x00\x01\x00\x81\x00\x00\xff\x00\x00\x00\x00\xff\x00\x00\x00\x00\x00\x00,\x00\x00\x00\x00\x02\x00\x01\x00\x00\x08\x05\x00\x01\x04\x08\x08\x00;'
    mock_get.return_value = mock_response

    mock_image_model = mock.MagicMock()
    mock_image_model.generate_content.return_value.text = (
        'Image analysis result'
    )
    gemini = ee_agent.Gemini()
    gemini._image_model = mock_image_model

    analysis = gemini.analyze_image('https://example.com/image.jpg')
    self.assertEqual(analysis, 'Image analysis result')

  @mock.patch('requests.get')
  def test_analyze_image_uniform_color(self, mock_get):
    # Create a single-pixel black image
    mock_response = mock.MagicMock()
    mock_response.status_code = 200
    mock_response.content = b'GIF89a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;'
    mock_get.return_value = mock_response

    mock_image_model = mock.MagicMock()
    mock_image_model.generate_content.return_value.text = (
        'Image analysis result'
    )
    gemini = ee_agent.Gemini()
    gemini._image_model = mock_image_model

    analysis = gemini.analyze_image('https://example.com/image.jpg')
    self.assertEqual(
        analysis, 'The image tile has a single uniform color with value 0.')

  @mock.patch('google.generativeai.GenerativeModel')
  def test_chat(self, mock_generative_model):
    mock_chat_proxy = mock.MagicMock()
    mock_chat_proxy.send_message.return_value.text = 'Generated answer'

    mock_model = mock.MagicMock()
    mock_generative_model.return_value = mock_model
    mock_model.start_chat.return_value = mock_chat_proxy

    gemini = ee_agent.Gemini()
    answer = gemini.chat('question')
    self.assertEqual(answer, 'Generated answer')

  @mock.patch.object(ee_agent.Gemini, 'analyze_image')
  @mock.patch(
      'ee_agent.get_tile_url_and_code',
      return_value=('https://earthengine.googleapis.com/tile_url', 'code'),
  )
  @mock.patch('ee_agent.Gemini.chat')
  def test_run_agent_success(
      self, mock_chat, mock_get_tile_url, mock_analyze_image):
    mock_analyze_image.return_value = 'Image analysis result'
    mock_chat.return_value = '0.95 Evaluation result'

    ee_agent.run_agent(
        ee_agent.Gemini(), ee_agent.Gemini(), 'topic', 'question'
    )
    mock_get_tile_url.assert_called_once()
    mock_analyze_image.assert_called_once()

  @mock.patch('ee_agent.Gemini.analyze_image')
  @mock.patch(
      'ee_agent.get_tile_url_and_code',
      return_value=('code', 'https://earthengine.googleapis.com/tile_url'),
  )
  @mock.patch('ee_agent.Gemini.chat')
  def test_run_agent_multiple_attempts(
      self, mock_chat, mock_get_tile_url, mock_analyze_image):
    mock_analyze_image.return_value = 'Image analysis result'

    mock_chat.side_effect = [
        '0.5 Evaluation result',
        'recommendation',
        '0.95 Evaluation result'
    ]

    ee_agent.run_agent(
        ee_agent.Gemini(), ee_agent.Gemini(), 'topic', 'question'
    )
    self.assertEqual(mock_get_tile_url.call_count, 2)
    self.assertEqual(mock_analyze_image.call_count, 2)


if __name__ == '__main__':
  absltest.main()
