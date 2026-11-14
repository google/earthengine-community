import ast
from typing import Any
import unittest

from functionsmith import code_parser


class TestParser(unittest.TestCase):

  def setUp(self):
    super().setUp()
    self._parser = code_parser.Parser()
    self.maxDiff = 5000

  def create_dummy_func_def(self, annotation_string: str) -> ast.FunctionDef:
    """Creates an AST FunctionDef node with a specific parameter annotation."""
    code = f'def dummy_func(param: {annotation_string}):\n pass'
    tree = ast.parse(code)
    return tree.body[0]

  def annotation_from_func_def(self, func_def: ast.FunctionDef) -> Any:
    param_node = func_def.args.args[0]
    return self._parser._extract_type_hint(param_node)

  def test_function_signature(self):
    function = code_parser.Function(
        code='my code',
        name='my name',
        docstring='my docstring',
        parameters=[{'a': 'b'}],
        return_type='str',
    )
    self.assertEqual(
        "Function(code='', name='my name', docstring='my docstring',"
        " parameters=[{'a': 'b'}], return_type='str')",
        function.signature(),
    )

  def test_extract_single_block(self):
    text = "```python\ndef foo():\n print('hello')\n```"
    expected = "def foo():\n print('hello')"
    result = self._parser.extract_python_code_blocks(text)
    self.assertEqual(expected, result.code)
    self.assertEqual(True, result.code_block_found)

  def test_extract_multiple_blocks(self):
    text = (
        "```python\ndef foo():\n print('hello')\n```\n```python\ndef bar():\n"
        " print('world')\n```"
    )
    expected = "def foo():\n print('hello')\ndef bar():\n print('world')"
    self.assertEqual(
        self._parser.extract_python_code_blocks(text).code, expected)

  def test_extract_code_no_blocks(self):
    text = 'print(2)'
    result = self._parser.extract_python_code_blocks(text)
    self.assertEqual(text, result.code)
    self.assertEqual(False, result.code_block_found)

  def test_extract_empty_block(self):
    text = '```python\n```'
    self.assertEqual(self._parser.extract_python_code_blocks(text).code, '')

  def test_extract_none(self):
    self.assertEqual(self._parser.extract_python_code_blocks(None).code, '')

  def test_extract_with_leading_and_trailing_whitespace(self):
    text = '```python \n def foo():\n  print("hello")\n ```'
    expected = '\ndef foo():\n print("hello")\n'
    self.assertEqual(
        self._parser.extract_python_code_blocks(text).code, expected
    )

  def test_no_annotation(self):
    code = 'def dummy_func(param):\n pass'
    tree = ast.parse(code)
    func_def = tree.body[0]
    annotation = self.annotation_from_func_def(func_def)
    self.assertEqual(annotation, '')

  def test_int_annotation(self):
    func_def = self.create_dummy_func_def('int')
    annotation = self.annotation_from_func_def(func_def)
    self.assertEqual(annotation, 'int')

  def test_str_annotation(self):
    func_def = self.create_dummy_func_def('str')
    annotation = self.annotation_from_func_def(func_def)
    self.assertEqual(annotation, 'str')

  def test_float_annotation(self):
    func_def = self.create_dummy_func_def('float')
    annotation = self.annotation_from_func_def(func_def)
    self.assertEqual(annotation, 'float')

  def test_bool_annotation(self):
    func_def = self.create_dummy_func_def('bool')
    annotation = self.annotation_from_func_def(func_def)
    self.assertEqual(annotation, 'bool')

  def test_list_int_annotation(self):
    func_def = self.create_dummy_func_def('list[int]')
    annotation = self.annotation_from_func_def(func_def)
    self.assertEqual(annotation, 'list[int]')

  def test_dict_str_float_annotation(self):
    func_def = self.create_dummy_func_def('dict[str, float]')
    annotation = self.annotation_from_func_def(func_def)
    self.assertEqual(annotation, 'dict[str, float]')

  def test_tuple_annotation(self):
    func_def = self.create_dummy_func_def('tuple[int, str, bool]')
    annotation = self.annotation_from_func_def(func_def)
    self.assertEqual(annotation, 'tuple[int, str, bool]')

  def test_set_annotation(self):
    func_def = self.create_dummy_func_def('set[str]')
    annotation = self.annotation_from_func_def(func_def)
    self.assertEqual(annotation, 'set[str]')

  def test_union_annotation(self):
    func_def = self.create_dummy_func_def('Union[int, str]')
    annotation = self.annotation_from_func_def(func_def)
    self.assertEqual(annotation, 'Union[int, str]')

  def test_optional_annotation(self):
    func_def = self.create_dummy_func_def('Optional[int]')
    annotation = self.annotation_from_func_def(func_def)
    self.assertEqual(annotation, 'Optional[int]')

  def test_any_annotation(self):
    func_def = self.create_dummy_func_def('Any')
    annotation = self.annotation_from_func_def(func_def)
    self.assertEqual(annotation, 'Any')

  def test_unhandled_annotation_type(self):
    # Create a custom AST node that is not handled by _parameter_annotation
    class CustomAnnotation(ast.AST):
      _fields = ()

    param_node = ast.arg(arg='param', annotation=CustomAnnotation())
    annotation = self._parser._extract_type_hint(param_node)
    self.assertEqual(annotation, ast.unparse(param_node.annotation))

  def test_default_arg(self):
    func_def = self.create_dummy_func_def('int = 10')
    annotation = self.annotation_from_func_def(func_def)
    default_value = func_def.args.defaults[0]
    self.assertEqual(annotation, 'int')
    self.assertEqual(ast.unparse(default_value), '10')

  def test_basic_function(self):
    code = '''
def my_function(a: str, b: int = 22):
 """This is a docstring.

 Args:
  a (str): first argument
  b (int, optional): second argument
 """
  '''
    tree = ast.parse(code)
    func_def = next(n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef))
    function = self._parser._extract_function_details(func_def)
    self.assertEqual(function.name, 'my_function')
    self.assertEqual(function.return_type, '')
    self.assertEqual(len(function.parameters), 2)
    self.assertEqual(function.parameters[0]['name'], 'a')
    self.assertEqual(function.parameters[0]['type'], 'str')
    self.assertEqual(function.parameters[0]['description'], 'first argument')

  def test_import_finder(self):
    code = """
import foo
from bar import baz
def my_function():
  pass
"""
    tree = ast.parse(code)
    import_finder = code_parser.ImportFinder(code.splitlines())
    import_finder.visit(tree)
    expected_imports = ['import foo', 'from bar import baz']
    self.assertEqual(import_finder.import_statements, expected_imports)

  def test_extract_functions_as_tools(self):
    code = '''import typing
from typing import List

def my_function(a: int, b: str = 'default') -> str:
 """This is a docstring."""
 return f'{a} {b}'

def test_my_function(a: int) -> str:
 return "test"'''

    code_block = f"""
```python
{code}
```
"""
    parsed_response = self._parser.extract_functions(code_block)
    self.assertEqual(code, parsed_response.code)

    self.assertEqual(len(parsed_response.functions), 1)

    saved_function = parsed_response.functions['my_function']
    self.assertEqual(saved_function.name, 'my_function')
    self.assertEqual(saved_function.docstring, 'This is a docstring.')
    self.assertEqual(saved_function.return_type, 'str')

  def test_function_with_typing_and_docstring_types(self):
    code = '''
def my_function(a: int, b: str = 'default', c: list[int] = None):
  """This is a docstring.

  Args:
  a (int): first argument
  b (str): second argument
  c (list[int]): third argument
  """
  pass
'''
    tree = ast.parse(code)
    func_def = next(n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef))
    func = self._parser._extract_function_details(func_def)
    self.assertEqual(func.parameters[0]['name'], 'a')
    self.assertEqual(func.parameters[0]['type'], 'int')
    self.assertEqual(func.parameters[0]['description'], 'first argument')

    self.assertEqual(func.parameters[1]['name'], 'b')
    self.assertEqual(func.parameters[1]['type'], 'str')
    self.assertEqual(func.parameters[1]['description'], 'second argument')

    self.assertEqual(func.parameters[2]['name'], 'c')
    self.assertEqual(func.parameters[2]['type'], 'list[int]')
    self.assertEqual(func.parameters[2]['description'], 'third argument')

  def test_function_with_only_typing_annotations(self):
    code = '''
def my_function(a: int, b: Optional[str] = None):
  """This is a docstring.

  Args:
      a: The first argument.
      b: The second argument.
  """
  pass
  '''
    tree = ast.parse(code)
    func_def = next(n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef))
    func = self._parser._extract_function_details(func_def)
    self.assertEqual(func.parameters[0]['name'], 'a')
    self.assertEqual(func.parameters[0]['type'], 'int')
    self.assertEqual(func.parameters[0]['description'], 'The first argument.')

    self.assertEqual(func.parameters[1]['name'], 'b')
    self.assertEqual(func.parameters[1]['type'], 'Optional[str]')
    self.assertEqual(func.parameters[1]['description'], 'The second argument.')

  def test_function_with_only_docstring_annotations(self):
    code = '''
def my_function(a, b='foo'):
    """This is a docstring.

    Args:
    a (int): The first argument.
    b (str, optional): The second argument.
    """
    pass
'''
    tree = ast.parse(code)
    func_def = next(n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef))
    func = self._parser._extract_function_details(func_def)
    self.assertEqual(func.parameters[0]['name'], 'a')
    self.assertEqual(func.parameters[0]['type'], '')
    self.assertEqual(func.parameters[0]['description'], 'The first argument.')
    self.assertEqual(func.parameters[1]['name'], 'b')
    self.assertEqual(func.parameters[1]['type'], '')
    self.assertEqual(func.parameters[1]['description'], 'The second argument.')

  def test_function_with_complex_typing_annotations(self):
    code = '''
def my_function(a: List[Dict[str, int]], b: Union[int, float] = 0):
  """This is a docstring.

  Args:
      a: A list of dictionaries.
      b: Either an integer or a float.
  """
  pass
  '''
    tree = ast.parse(code)
    func_def = next(n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef))
    func = self._parser._extract_function_details(func_def)
    self.assertEqual(func.parameters[0]['name'], 'a')
    self.assertEqual(func.parameters[0]['type'], 'List[Dict[str, int]]')
    self.assertEqual(
        func.parameters[0]['description'], 'A list of dictionaries.'
    )

    self.assertEqual(func.parameters[1]['name'], 'b')
    self.assertEqual(func.parameters[1]['type'], 'Union[int, float]')
    self.assertEqual(
        func.parameters[1]['description'], 'Either an integer or a float.'
    )
    self.assertEqual(func.parameters[1]['default'], '0')

  def test_import_finder_with_comments_and_multiline(self):
    code = """
import os  # This is a comment
from typing import (
  List,
  Dict,  # Another comment
)

def my_function():
  pass
"""
    tree = ast.parse(code)
    import_finder = code_parser.ImportFinder(code.splitlines())
    import_finder.visit(tree)
    expected_imports = [
        'import os  # This is a comment',
        'from typing import (\nList,\nDict,  # Another comment\n)',
    ]
    self.assertEqual(import_finder.import_statements, expected_imports)

  def test_extract_functions_as_tools_invalid_code(self):
    code = '```python\nthis is not valid python code\n```'
    result = self._parser.extract_functions(code)
    self.assertEqual('', result.code)
    self.assertEqual(
        'ERROR PARSING CODE: invalid syntax (<unknown>, line 1)', result.error
    )

  def test_reduce_indentation_empty_lines(self):
    code = 'def foo():\n\n  \n    print("hello")\n  \n    print("world")\n'
    expected = 'def foo():\n\n\n    print("hello")\n\n    print("world")\n'
    self.assertEqual(self._parser._reduce_indentation(code), expected)


if __name__ == '__main__':
  unittest.main()
