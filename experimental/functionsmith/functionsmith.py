import copy
import inspect
import sys

import logging
from google import genai

import executor
import llm
import parser

logging.basicConfig(
    filename='/tmp/fs.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

system_instruction="""
To solve the task given below, write first low-level python functions with tests for each of them in a ```python block. The tests should be as simple as possible and not rely on anything external.

I will save the functions locally, and you can write higher-level code that will invoke them later. I will pass you the output from the code or any error messages.

Call the task_done() function when you consider the task done.
Call the ask_user() function when you need additional input from the user.

If I ask you to compute factorial of 10, your responses should be like this (return one response at a time):
    Example chat:

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

    The computed answer looks reasonable, so we declare the task solved.

"""
#If you cannot decide between different options, ask clarifying questions.

schema = """
Airport ID	Unique OpenFlights identifier for this airport.
Name	Name of airport. May or may not contain the City name.
City	Main city served by airport. May be spelled differently from Name.
Country	Country or territory where airport is located. See Countries to cross-reference to ISO 3166-1 codes.
IATA	3-letter IATA code. Null if not assigned/unknown.
ICAO	4-letter ICAO code.
Null if not assigned.
Latitude	Decimal degrees, usually to six significant digits. Negative is South, positive is North.
Longitude	Decimal degrees, usually to six significant digits. Negative is West, positive is East.
Altitude	In feet.
Timezone	Hours offset from UTC. Fractional hours are expressed as decimals, eg. India is 5.5.
DST	Daylight savings time. One of E (Europe), A (US/Canada), S (South America), O (Australia), Z (New Zealand), N (None) or U (Unknown). See also: Help: Time
Tz database timezone	Timezone in "tz" (Olson) format, eg. "America/Los_Angeles".
Type	Type of the airport. Value "airport" for air terminals, "station" for train stations, "port" for ferry terminals and "unknown" if not known. In airports.csv, only type=airport is included.
Source	Source of this data. "OurAirports" for data sourced from OurAirports, "Legacy" for old data not matched to OurAirports (mostly DAFIF), "User" for unverified user contributions. In airports.csv, only source=OurAirports is included.
"""

task = f"""Please explore a local file airports.csv. First, make some hypotheses about the data, and then write code to test them to learn something interesting about the data. By 'interesting', I mean something you wouldn't have guessed from first principles - eg, finding that the largest countries have the most airports is not interesting. Explain why what you discovered seems interesting. When done, ask the user if they want to find out something else about this file.

The file has the following schema {schema}"""

#task = 'compute the factorial of 20. When done, ask the user if they want to compute another factorial and compute it if they give you a new value'

#agent = llm.Gemini(system_instruction)
#agent = llm.Claude(system_instruction)
agent = llm.ChatGPT(system_instruction)

def ask_user(agent_question: str) -> str:
  """Asks a user a question to help with the ongoing task.

  Args:
    agent_question(str): a question the agents wants to ask the user

  Returns:
    str, a user response
  """
  print(agent_question)
  return input('> ')

def task_done(agent_message:str) -> None:
  """Returns control back to the user when the agent thinks the task is done.

  Args:
    agent_message(str): the message that agents wants to send the user
  """
  print(agent_message)
  import sys
  sys.exit(0)

syscalls = {}

for f in [ask_user, task_done]:
  _, starting_tools=parser.extract_functions_as_tools(inspect.getsource(f))
  syscalls.update(starting_tools)

tools = {}

question = task

while True:
  all_tools = copy.deepcopy(tools)
  all_tools.update(syscalls)
  question_with_tools = question + 'The following functions are available:\n' + '\n'.join([str(x.declaration) for x in all_tools.values()])
  response = agent.chat(question_with_tools)
  print(response)

  code, new_tools=parser.extract_functions_as_tools(response)
  if code or new_tools:
    tools.update(new_tools)

    # Only non-syscall source code is used
    code_with_tools = '\n'.join([x.code for x in tools.values()]) + '\n' + code

    input('HIT ENTER TO RUN CODE')
    question = executor.run_code(code_with_tools, {'ask_user': ask_user, 'task_done': task_done})
  else:
    question = input('>')

