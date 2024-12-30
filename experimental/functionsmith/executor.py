import contextlib
import io
import sys

import logging


class OutputManager:
  def __init__(self):
    self.buffer = io.StringIO()
    self.original_stdout = None

  def __enter__(self):
    self.original_stdout = sys.stdout
    logging.info('ENTER')
    sys.stdout = self.buffer
    return self

  def __exit__(self, exc_type, exc_val, exc_tb):
    logging.info('EXIT')
    sys.stdout = self.original_stdout

  def get_value(self):
    return self.buffer.getvalue()

  def bypass(self):
    """Temporarily restore original stdout"""
    logging.info('BYPASS')
    sys.stdout = self.original_stdout

  def restore_capture(self):
    """Resume capturing to buffer"""
    logging.info('RESTORE')
    sys.stdout = self.buffer

def run_code(python_code: str, syscalls) -> str:
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
      exec(python_code, {**wrapped_syscalls})
      output = output_manager.get_value()

    if output:
      print(f"OUTPUT: {output}\n")
    else:
      print('NO OUTPUT\n')
    if output is not None:
      return output
    else:
      return "CODE DID NOT PRINT ANYTHING TO STDOUT. IF YOU ARE EXPECTING A VALUE, USE print(), NOT return"
  except Exception as e:
    print(f"ERROR TYPE: {type(e)}"  )
    print(f"ERROR: {e}"  )
    error =  f'Exception occurred: {e}.'
    return error
