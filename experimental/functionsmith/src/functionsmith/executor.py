"""Python code executor for functionsmith agents.

USING THIS CLASS IS UNSAFE. It directly runs LLM-produced code, and thus
should only be used for demonstration purposes. Real code executions
should happen in a sandbox or in a docker image.
"""

import io
import logging
import sys
from typing import Any, Callable


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
  def run_code(
      self,
      python_code: str,
      syscalls: dict[str, Callable],
      code_globals: dict[str, Any] | None = None,
  ) -> str:
    """Runs the given code and captures is output except for syscalls."""
    code_globals = code_globals or {}
    conflicting_keys = set(syscalls.keys()) & set(code_globals.keys())
    if conflicting_keys:
      raise ValueError(
          'There are conflicting keys in the syscalls and code_globals'
          f' arguments: {conflicting_keys}'
      )

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

      combined_globals = {**wrapped_syscalls, **code_globals}
      output_manager = OutputManager()
      with output_manager:
        exec(python_code, combined_globals)  # pylint:disable=exec-used
        output = output_manager.get_value()

      if output and output.strip() != 'None':
        self._logger.warning(f'OUTPUT: {output.strip()}\n')
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
