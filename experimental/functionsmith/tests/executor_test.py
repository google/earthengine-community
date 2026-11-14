import io
import sys
import unittest
from unittest import mock

from functionsmith import executor


class TestOutputManager(unittest.TestCase):

  def test_capture_output(self):
    with executor.OutputManager() as manager:
      print("Hello, world!")
      print("This is a test.")
    self.assertEqual(manager.get_value(), "Hello, world!\nThis is a test.\n")

  def test_empty_output(self):
    with executor.OutputManager() as manager:
      pass  # No output
    self.assertEqual(manager.get_value(), "")

  def test_bypass_and_restore(self):
    with executor.OutputManager() as manager:
      print("Captured 1")
      manager.bypass()
      print("Not captured", end="")
      manager.restore_capture()
      print("Captured 2")

    # Capture stdout to compare with the not captured output
    captured_output = io.StringIO()
    sys.stdout = captured_output
    print("Not captured", end="")
    sys.stdout = sys.__stdout__

    self.assertEqual(manager.get_value(), "Captured 1\nCaptured 2\n")
    self.assertEqual(captured_output.getvalue(), "Not captured")


class TestExecutor(unittest.TestCase):

  def setUp(self):
    super().setUp()
    self.logger = mock.MagicMock()
    self.executor = executor.Executor(self.logger)

  def test_simple_code_execution(self):
    code = "print('Hello from code')"
    result = self.executor.run_code(code, {})
    self.assertEqual(result, "Hello from code\n")
    self.logger.warning.assert_called_with("OUTPUT: Hello from code\n")

  def test_code_with_no_output(self):
    code = "x = 5"
    result = self.executor.run_code(code, {})
    self.assertEqual(
        result,
        "CODE DID NOT PRINT ANYTHING TO STDOUT. IF YOU ARE EXPECTING "
        "A VALUE, USE print(), NOT return",
    )
    self.logger.warning.assert_not_called()

  def test_code_with_exception(self):
    code = "1 / 0"
    result = self.executor.run_code(code, {})
    self.assertIn("Exception occurred: division by zero", result)
    self.logger.error.assert_called_with("ERROR: division by zero")

  def test_syscall_wrapping(self):
    def mock_syscall(a, b):
      return a + b

    code = "print(add(2, 3))"
    result = self.executor.run_code(code, {"add": mock_syscall})
    self.assertEqual(result, "5\n5\n")
    self.logger.warning.assert_called_with("OUTPUT: 5\n5\n")

  def test_syscall_that_prints_and_returns(self):
    def mock_syscall():
      print("Hello from syscall")  # Not captured in output buffer
      return 42

    code = "my_syscall()"
    result = self.executor.run_code(code, {"my_syscall": mock_syscall})
    self.assertEqual(result, "42\n")
    self.logger.warning.assert_called_with("OUTPUT: 42\n")

  def test_syscall_with_bypass_and_restore(self):
    def mock_syscall():
      print("Hello from syscall")  # Not captured in output buffer
      return 42

    code = """
print('Before syscall')
print(my_syscall())
print('After syscall')"""
    result = self.executor.run_code(code, {"my_syscall": mock_syscall})
    self.assertEqual(result, "Before syscall\n42\n42\nAfter syscall\n")

    captured_output = io.StringIO()
    sys.stdout = captured_output
    print("Hello from syscall", end="")
    sys.stdout = sys.__stdout__
    self.assertEqual(captured_output.getvalue(), "Hello from syscall")
    self.logger.warning.assert_called_with(
        "OUTPUT: Before syscall\n42\n42\nAfter syscall\n"
    )

  def test_code_globals(self):
    def mock_syscall(x):
      return x * 2

    code_globals = {"global_var": 10, "another_global": "hello"}
    code = """
print(global_var)
print(another_global)
double(global_var)
    """
    result = self.executor.run_code(
        code, {"double": mock_syscall}, code_globals=code_globals
    )
    self.assertEqual(result, "10\nhello\n20\n")
    self.logger.warning.assert_called_with("OUTPUT: 10\nhello\n20\n")

  def test_code_globals_and_syscall_name_conflict(self):
    def mock_syscall(x):
      return x * 2

    # 'double' is defined in BOTH syscalls and code_globals.
    code_globals = {"global_var": 10, "double": "Conflicting value"}
    code = "print(double(global_var))"

    with self.assertRaisesRegex(ValueError, "conflicting keys"):
      self.executor.run_code(code, {"double": mock_syscall}, code_globals)


if __name__ == "__main__":
  unittest.main()
