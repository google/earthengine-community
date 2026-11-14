"""Functionsmith is a general-purpose problem-solving agent.

It writes functions for its own future use, tests the functions, and then uses
them to solve a user-specified problem.

USING THIS AGENT IS UNSAFE. It directly runs LLM-produced code, and thus
should only be used for demonstration purposes.

To get started, set one of these environment variables to your API key:
GOOGLE_API_KEY, ANTHROPIC_API_KEY, or OPENAI_API_KEY.

To execute the sample task analyzing airports, get the airports.csv file:
```
wget https://raw.githubusercontent.com/davidmegginson/ourairports-data/refs/heads/main/airports.csv
```
then run
```
python3 agent.py
```

See README.md for more information.

The agent will ask the LLM to find "something interesting" about the data
given its schema. Then the LLM will probably create one or two sets of
low-level function with tests, then actually analyze the files, then stop
and ask the user if they want to do anything else.

Before each code execution phase, the agent will print the code and ask
the user to hit "enter" to confirm the code looks safe to run.
"""

import copy
import inspect
import logging
import os
import sys

from functionsmith import code_parser
from functionsmith import executor
from functionsmith import llm


STARS = '*' * 20 + '\n'


class CustomLoggingHandler(logging.Handler):

  def emit(self, record):
    msg = self.format(record)
    print(msg)


system_prompt = """
To solve the task given below, write first low-level python functions with
tests for each of them in a ```python block. Include all the necessary imports.
The tests should be as simple as possible and not rely on anything external.
All asserts in tests should have an error message to make sure their failure is
easy to detect.

In later responses, never omit parts of the code referring to earlier output -
if you need to do this, define a function and then call it later.

I will save the functions locally, and you can write higher-level code that
will invoke them later. I will pass you the output from the code or any error
messages.

Call the task_done() function when you consider the task done.
Ask the user questions if you need additional input.

If I ask you to compute factorial of 10 and then prompt the user if they want
more factorials computed, your responses should be like this (return one
response at a time): Example chat session (each response should be returned in
a separate answer):

    Question 1:
    Please compute the factorial of 10

    Response 1:
    Let's define the requested function and test it.
    ```python
    import math
    def factorial(x):
      return math.factorial(x)
    def test_factorial():
      assert factorial(3) == 6
      assert factorial(4) == 24
      print('success')

    test_factorial()
    ```

    Question 2:
    The code output was "success"

    Response 2:

    Now let's call the previously defined function to solve the user task.
    ```python
      print(factorial(10))
    ```

    Question 3:
    The code output was "3628800"

    Response 3:

    The computed answer looks reasonable. Please enter a number if you want another factorial to be computed, or instruct me to exit.

    Question 4:
    You can exit here

    Response 4:

    ```python
      task_done('We can exit')
    ```


"""
if not os.path.exists('airports.csv'):
  print(
      """Download
https://raw.githubusercontent.com/davidmegginson/ourairports-data/refs/heads/main/airports.csv
if you'd like to run this task.
""",
      file=sys.stderr,
  )
  sys.exit(1)

schema = """
"id","ident","type","name","latitude_deg","longitude_deg","elevation_ft","continent","iso_country","iso_region","municipality","scheduled_service","gps_code","iata_code","local_code","home_link","wikipedia_link","keywords"
"""

task = f"""
Please explore a file airports.csv that is present in the current directory.
First, make some hypotheses about the
data, and then write code to test them to learn something interesting about the
data. By 'interesting', I mean something you wouldn't have guessed from first
principles - eg, finding that the largest countries have the most airports is
not interesting. Explain why what you discovered seems interesting. When done,
ask the user if they want to find out something else about this file. Output
findings in text form, not as images or plots.

Do not overwrite the original file in your code or tests.
The file has the following schema {schema}"""

# If you need to debug the agent, use this simple task.
# task = """
# Compute the factorial of 20. When done, ask the user in a chat response
# if they want to compute another factorial and compute it if they give you
# a new value"""

# This code works with several different LLMs. Uncomment the one you
# have access to. Make sure to set the API key in the appropriate
# environment variable
# (GOOGLE_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY, or DEEPSEEK_API_KEY).
agent = llm.Gemini(system_prompt, model_name='gemini-2.0-flash-exp')
# agent = llm.Claude(system_prompt, model_name='claude-3-5-sonnet-20241022')
# agent = llm.ChatGPT(system_prompt, model_name='o1-mini')
# agent = llm.DeepSeek(system_prompt, model_name='deepseek-chat')


def task_done(agent_message: str) -> None:
  """Returns control back to the user when the agent thinks the task is done.

  This function must always be invoked in a separate response, not at the end
  of a code snippet doing something else.

  Args:
    agent_message(str): the message that the agent wants to print before exit.
  """
  print(agent_message)
  import sys  # pylint:disable=g-import-not-at-top,redefined-outer-name,reimported

  sys.exit(0)


syscalls = {}

# Set up a custom logger to be passed to helper objects.
# This is an overkill for the command-line agent, but makes more sense
# for the notebook version of this agent.
logger = logging.getLogger('functionsmith')
logger.handlers = []
logger.addHandler(CustomLoggingHandler())
logger.propagate = False

# Create the object that parses Python code out of LLM responses.
parser = code_parser.Parser(logger)
# Create the object that runs the LLM-generated Python code.
code_executor = executor.Executor(logger)

# 'Syscalls' are functions for which stdout/stderr won't be intercepted.
# For now we only have one syscall, 'task_done'.
for f in [task_done]:
  starting_tools = parser.extract_functions(inspect.getsource(f))
  syscalls.update(starting_tools.functions)

tools = {}


def main():
  question = task

  while True:
    print(STARS)
    all_tools = copy.deepcopy(tools)
    all_tools.update(syscalls)
    question_with_tools = (
        question
        + 'The following functions are available:\n'
        + '\n'.join([x.signature() for x in all_tools.values()])
    )
    response = agent.chat(question_with_tools)
    print(response)

    parsed_response = parser.extract_functions(response)
    if not parsed_response.code and not parsed_response.functions:
      if parsed_response.error:
        question = parsed_response.error
        continue
      question = input('> ')
      continue

    tools.update(parsed_response.functions)

    if parsed_response.code:
      # Concatenate all known source code together.
      # Functions that were defined in the most recent response will be repeated,
      # which is okay
      code_with_tools = (
          '\n'.join([x.code for x in tools.values()])
          + '\n'
          + parsed_response.code
      )

      print(STARS)
      input('HIT ENTER TO RUN THIS CODE')
      print(STARS)
      question = code_executor.run_code(code_with_tools, {'task_done': task_done})
    else:
      # The response had functions but no code. The agent wanted to define them.
      # We tell it to go on (that is, to keep writing code).
      question = 'go on'


if __name__ == '__main__':
  main()
