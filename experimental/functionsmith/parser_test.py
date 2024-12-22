import ast
import inspect
import re
import typing
from typing import Any, Dict, Mapping, Optional, Sequence
from unittest import mock
import unittest

from google.genai import types

from parser import extract_functions_as_tools, create_function_declaration_from_ast, extract_python_code_blocks, SavedFunction, ImportFinder, generate_schema_from_ast, _get_parameter_annotation, _create_schema, _get_openapi_type


class TestExtractPythonCodeBlocks(unittest.TestCase):

  def test_extract_single_block(self):
    text = "```python\ndef foo():\n print('hello')\n```"
    expected = "def foo():\n print('hello')"
    self.assertEqual(extract_python_code_blocks(text), expected)

  def test_extract_multiple_blocks(self):
    text = "```python\ndef foo():\n print('hello')\n```\n```python\ndef bar():\n print('world')\n```"
    expected = "def foo():\n print('hello')\ndef bar():\n print('world')"
    self.assertEqual(extract_python_code_blocks(text), expected)

  def test_extract_no_blocks(self):
    text = "No code blocks here."
    self.assertEqual(extract_python_code_blocks(text), "")

  def test_extract_empty_block(self):
    text = "```python\n```"
    self.assertEqual(extract_python_code_blocks(text), "")

  def test_extract_with_leading_and_trailing_whitespace(self):
    text = "```python \n def foo():\n print('hello')\n ```"
    expected = "def foo():\n print('hello')"
    self.assertEqual(extract_python_code_blocks(text), expected)



class TestGetParameterAnnotation(unittest.TestCase):

  def test_no_annotation(self):
    node = ast.arg(arg='x')
    self.assertEqual(_get_parameter_annotation(node), inspect.Parameter.empty)

  def test_simple_annotation(self):
    node = ast.arg(arg='x', annotation=ast.Name(id='int', ctx=ast.Load()))
    self.assertEqual(_get_parameter_annotation(node), int)

  def test_constant_annotation(self):
    node = ast.arg(arg='x', annotation=ast.Constant(value=1)) # type: ignore
    self.assertEqual(_get_parameter_annotation(node), type(1))

  def test_complex_annotation(self):
   node = ast.arg(arg='x', annotation=ast.Subscript(
     value=ast.Name(id='List', ctx=ast.Load()),
     slice=ast.Index(value=ast.Name(id='int', ctx=ast.Load())),
     ctx=ast.Load()
   ))

   self.assertEqual(_get_parameter_annotation(node), typing.List[int])

  def test_unknown_annotation(self):
    node = ast.arg(arg='x', annotation=ast.Name(id='UnknownType', ctx=ast.Load()))
    self.assertEqual(_get_parameter_annotation(node), 'UnknownType')


class TestGenerateSchemaFromAst(unittest.TestCase):
 def test_basic_function(self):
  code = '''
def my_function(a: int, b: str = 'default'):
 """This is a docstring.

 Args:
  a (int): first argument
  b (str, optional): second argument
 """
'''
  tree = ast.parse(code)
  func_def = next(n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef))
  schema = generate_schema_from_ast(func_def)

  expected_schema = {
    'name': 'my_function',
    'description': 'This is a docstring.',
    'parameters': {
      'type': 'object',
      'properties': {
        'a': {'type': 'int', 'description': 'first argument'},
        'b': {'type': 'str', 'description': 'second argument'},
      },
      'required': ['a'],
    },
  }
  self.assertEqual(schema, expected_schema)


class TestCreateSchema(unittest.TestCase):

 def test_create_schema(self):
  fields_dict = {
   'a': (int, {'description': 'An integer'}),
   'b': (str, {'description': 'A string'}),
  }
  schema = _create_schema('test_model', fields_dict)
  expected_schema = {
    'type': 'object',
    'properties': {
     'a': {'type': 'integer', 'description': 'An integer'},
     'b': {'type': 'string', 'description': 'A string'},
    }
  }
  self.assertEqual(schema, expected_schema)


class TestGetOpenApiType(unittest.TestCase):
  def est_get_openapi_type(self):
   self.assertEqual(_get_openapi_type(int), 'integer')
   self.assertEqual(_get_openapi_type(str), 'string')
   self.assertEqual(_get_openapi_type(float), 'number')
   self.assertEqual(_get_openapi_type(bool), 'boolean')
   self.assertEqual(_get_openapi_type(inspect.Parameter.empty), 'string')
   #self.assertEqual(_get_openapi_type(list), 'array')
   #self.assertEqual(_get_openapi_type(typing.List[int]), 'array')
   self.assertEqual(_get_openapi_type(Any), 'string') # Default to string

class TestCreateFunctionDeclarationFromAst(unittest.TestCase):

 def __test_create_function_declaration_from_ast(self):
  code = """
def my_function(a: int, b: str = 'default'):
 \"\"\"This is a docstring.\"\"\"
 pass
"""
  tree = ast.parse(code)
  func_def = next(n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef))
  declaration = create_function_declaration_from_ast(func_def)

  self.assertEqual(declaration.name, 'my_function')
  self.assertEqual(declaration.description, 'This is a docstring.')


class TestImportFinder(unittest.TestCase):
  def test_import_finder(self):
    code = """
import foo
from bar import baz
def my_function():
  pass
"""
    tree = ast.parse(code)
    import_finder = ImportFinder(code.splitlines())
    import_finder.visit(tree)
    expected_imports = ["import foo", "from bar import baz"]
    self.assertEqual(import_finder.import_statements, expected_imports)

@mock.patch("builtins.open", new_callable=mock.mock_open)
class TestExtractFunctionsAsTools(unittest.TestCase):
  def test_extract_functions_as_tools(self, mock_open):

    code = '''
```python
import typing
from typing import List

def my_function(a: int, b: str = 'default') -> str:
 """This is a docstring."""
 return f'{a} {b}'

def test_my_function(a: int) -> str:
 return 'test'
```
'''

    tools = extract_functions_as_tools(code)

    self.assertEqual(len(tools), 1)
    self.assertIn('my_function', tools)

    saved_function = tools['my_function']
    self.assertEqual(saved_function.declaration['name'], 'my_function')
    self.assertEqual(saved_function.declaration['description'], 'This is a docstring.')
    #mock_open.assert_called_once_with('dev/my_function.py', 'w')


if __name__ == '__main__':
 unittest.main()
