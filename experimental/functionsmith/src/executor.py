"""Python code executor for functionsmith agents.

USING THIS CLASS IS UNSAFE. It directly runs LLM-produced code, and thus
should only be used for demonstration purposes. Real code executions
should happen in a sandbox or in a docker image.
"""

import io
import logging
import sys
from typing import Callable


# Intercepting stderr leads to the error "lost sys.stderr",
# but in practice I don't find intercepting stderr necessary.
class OutputManager:
  """Context manager for intercepting stdout."""

  def __init__(self):
    self.buffer = io.StringIO()
    self.original_stdout = None

  def __enter__(self):
    self.original_stdout = sys.stdout
    sys.stdout = self.buffer
    return self

  def __exit__(self, exc_type, exc_val, exc_tb):
    sys.stdout = self.original_stdout

  def get_value(self):
    return self.buffer.getvalue()

  def bypass(self):
    """Temporarily restores original stdout."""
    sys.stdout = self.original_stdout

  def restore_capture(self):
    """Resumes capturing to buffer."""
    sys.stdout = self.buffer


class Executor:
  """Class for executing a Python snippet."""

  def __init__(self, logger=None):
    self._logger = logger or logging.getLogger()

  # pylint:disable=g-bare-generic
  def run_code(self, python_code: str, syscalls: dict[str, Callable]) -> str:
    """Runs the given code and captures is output except for syscalls."""
    try:
      wrapped_syscalls = {}
      for name, func in syscalls.items():

        def wrap_syscall(f):
          def wrapped(*args, **kwargs):
            output_manager.bypass()
            try:
              result = f(*args, **kwargs)
              output_manager.buffer.write(str(result) + '\n')
              return result
            finally:
              output_manager.restore_capture()

          return wrapped

        wrapped_syscalls[name] = wrap_syscall(func)

      output_manager = OutputManager()
      with output_manager:
        exec(python_code, {**wrapped_syscalls})  # pylint:disable=exec-used
        output = output_manager.get_value()

      if output:
        self._logger.warning(f'OUTPUT: {output}\n')
      else:
        self._logger.warning('NO OUTPUT\n')
      if output:
        return output
      else:
        return (
            'CODE DID NOT PRINT ANYTHING TO STDOUT. IF YOU ARE EXPECTING A'
            ' VALUE, USE print(), NOT return'
        )
    except Exception as e:  # pylint:disable=broad-exception-caught
      self._logger.error(f'ERROR: {e}')  # pylint:disable=logging-fstring-interpolation
      error = f'Exception occurred: {e}.'
      return error
