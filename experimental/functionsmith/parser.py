import dataclasses
import inspect
import os
import re
import typing
from typing import Any, Dict, Mapping, Optional, Sequence
from google import genai
from google.genai import types

import ast
import docstring_parser
import dataclasses
import inspect


def _get_parameter_annotation(node: ast.arg) -> Any:
  """Helper function to extract the type annotation from an ast.arg node.

  Args:
      node (ast.arg): The argument node to extract the annotation from.

  Returns:
      Any: The type annotation of the argument, or inspect.Parameter.empty if no
      annotation is present.
  """
  if node.annotation:
    if isinstance(node.annotation, ast.Constant):
      return type(node.annotation.value)
    elif isinstance(node.annotation, ast.Name):
      type_name = node.annotation.id
      if type_name == 'int':
        return int
      elif type_name == 'float':
        return float
      elif type_name == 'str':
        return str
      elif type_name == 'bool':
        return bool
      elif type_name == 'Any':
        return typing.Any
      elif hasattr(typing, type_name):
        return getattr(typing, type_name)
      else:
        # In some cases could be a forward reference. Return as string for now
        return type_name
    elif isinstance(node.annotation, ast.Subscript):
      # Handle generics like typing.List[int], typing.Union[str, int]
      value = ast.unparse(node.annotation)
      try:
        return eval(value, typing.__dict__)
      except (NameError, TypeError):
        return value
    else:
      return Any
      # return ast.unparse(node.annotation)  # Return the raw string if no specific match found

  return inspect.Parameter.empty


def generate_schema_from_ast(
    func_def: ast.FunctionDef,
    *,
    descriptions: Mapping[str, str] | None = None,
    required: Sequence[str] | None = None,
) -> Dict[str, Any]:
  """Generates the OpenAPI Schema for a Python function from its AST node.

  Args:
      func_def: The `ast.FunctionDef` node of the function.
      descriptions: Optional. A `{name: description}` mapping for annotating
        input arguments of the function with user-provided descriptions. It
        defaults to an empty dictionary (i.e. there will not be any description
        for any of the inputs).
      required: Optional. A list of required arguments. If unspecified, it will
        be automatically inferred from the function signature.

  Returns:
      Dict[str, Any]: The OpenAPI Schema for the function in JSON format.
  """
  if descriptions is None:
    descriptions = {}
  if required is None:
    required = []

  args = func_def.args
  fields_dict = {}

  for arg in args.args:
    annotation = _get_parameter_annotation(arg)
    field = {'description': descriptions.get(arg.arg, None)}
    fields_dict[arg.arg] = (annotation, field)

  parameters = _create_schema(func_def.name, fields_dict)

  for name, function_arg in parameters.get('properties', {}).items():
    function_arg.pop('title', None)
    annotation = fields_dict[name][0]
    # if typing.get_origin(annotation) is typing.Union and type(None) in typing.get_args(
    #    annotation
    # ):
    #    function_arg["nullable"] = True

    num_defaults = len(args.defaults)
    args_with_defaults = args.args[-num_defaults:] if num_defaults > 0 else []
    defaults = [arg.arg for arg in args_with_defaults]
    parameters['required'] = [
        arg.arg for arg in args.args if arg.arg not in defaults
    ]
  # TODO: reconcile actual param names/types with the docstring

  parsed_docstring = docstring_parser.parse(ast.get_docstring(func_def))

  schema = dict(
      name=func_def.name,
      description=parsed_docstring.short_description,
      parameters={'type': 'object', 'properties': {}},
  )
  for param in parsed_docstring.params:
    # TODO: add default val
    schema['parameters']['properties'][param.arg_name] = {'type': param.type_name, 'description': param.description}
  schema['parameters']['required'] = [x.arg_name for x in parsed_docstring.params if not x.is_optional]
  return schema


def _create_schema(name: str, fields_dict: Dict[str, Any]) -> Dict[str, Any]:
  """Simulates pydantic.create_model(...).schema() to generate an OpenAPI schema.

  Args:
    name: The name of the model (function name).
    fields_dict: A dictionary mapping argument names to (annotation, field_info)
      tuples.

  Returns:
    A dictionary representing the OpenAPI schema.
  """
  properties = {}
  for arg_name, (annotation, field_info) in fields_dict.items():
    arg_schema = {'type': _get_openapi_type(annotation)}
    arg_schema.update(field_info)
    properties[arg_name] = arg_schema

  schema = {
      'type': 'object',
      'properties': properties,
  }
  return schema


def _get_openapi_type(annotation: Any) -> str:
  """Maps a Python type annotation to an OpenAPI type string.

  Args:
      annotation: The type annotation to map.

  Returns:
      str: The corresponding OpenAPI type string.
  """
  if annotation is inspect.Parameter.empty:
    return 'string'  # Default to string if no annotation
  if annotation is str:
    return 'string'
  if annotation is int:
    return 'integer'
  if annotation is float:
    return 'number'
  if annotation is bool:
    return 'boolean'
  #if typing.get_origin(annotation) is list:
  #  item_type = typing.get_args(annotation)[0]
  #  return 'array'
  return 'string'  # Default to string for unknown types


def create_function_declaration_from_ast(
    func_def: ast.FunctionDef, descriptions: Optional[Dict[str, str]] = None
) -> types.FunctionDeclaration:
  """Builds a `types.FunctionDeclaration` from an AST node.

  Args:
      func_def (ast.FunctionDef): The `ast.FunctionDef` node of the function.
      descriptions (Optional[Dict[str, str]]): Optional descriptions for
        function parameters.

  Returns:
      types.FunctionDeclaration: The `types.FunctionDeclaration`
      object.
  """
  schema = generate_schema_from_ast(func_def, descriptions=descriptions)
  return types.FunctionDeclaration(**schema)


class ImportFinder(ast.NodeVisitor):
  """AST Visitor that finds and preserves the source text of all imports."""

  def __init__(self, source_lines: list[str]):
    self.source_lines = source_lines
    self.import_statements = []

  def _get_node_source(self, node: ast.AST) -> str:
    """Extract the source code for a node using line numbers."""
    if hasattr(node, 'lineno') and hasattr(node, 'end_lineno'):
      # For Python 3.8+ with end_lineno attribute
      start = node.lineno - 1  # Convert to 0-based index
      end = node.end_lineno
      if start == end - 1:
        return self.source_lines[start].strip()
      else:
        return '\n'.join(line.strip() for line in self.source_lines[start:end])
    else:
      # Fallback for nodes without position info
      return ast.unparse(node)

  def visit_Import(self, node: ast.Import) -> None:
    """Handle regular import statements."""
    self.import_statements.append(self._get_node_source(node))
    self.generic_visit(node)

  def visit_ImportFrom(self, node: ast.ImportFrom) -> None:
    """Handle 'from ... import ...' statements."""
    self.import_statements.append(self._get_node_source(node))
    self.generic_visit(node)


@dataclasses.dataclass
class SavedFunction:
  declaration: types.FunctionDeclaration
  code: str

  def string_decl(self):
    return str(self.declaration.to_proto())


def extract_python_code_blocks(text):
  pattern = re.compile(r'```(?:python|tool_code)\n*(.*?)\n*```', re.DOTALL)
  code_blocks = pattern.findall(text)
  if code_blocks:
    return '\n'.join(code_blocks)
  else:
    return text

def fix_indentation(code: str) -> str:
  if not code:
    return code

  lines = code.split('\n')
  # Filter out empty lines for finding common indentation
  non_empty_lines = [line for line in lines if line.strip()]
  if not non_empty_lines:
    return code

  # Find the minimum indentation level
  min_indent = min(len(line) - len(line.lstrip()) for line in non_empty_lines)

  # Only remove indentation if ALL non-empty lines have at least this indentation
  if all(line.startswith(' ' * min_indent) for line in non_empty_lines):
    return '\n'.join(line[min_indent:] if line.strip() else line for line in lines)

  return code


def extract_functions_as_tools(response: str) -> dict[str, SavedFunction]:
  """Extracts functions from the code and returns them as tools."""
  code = fix_indentation(extract_python_code_blocks(response))
  try:
    tree = ast.parse(code)
  except SyntaxError as e:
    error = f'ERROR PARSING CODE: {f}'
    print(error)
    return error
  functions = {}
  import_finder = ImportFinder(code.splitlines())
  import_finder.visit(tree)
  for node in ast.walk(tree):
    if isinstance(node, ast.FunctionDef):
      func_name = node.name
      # Skip test functions.
      if func_name.startswith('test_'):
        continue

      try:
        new_code = ast.unparse(node)
        new_code = '\n'.join(import_finder.import_statements) + '\n' + new_code
        decl = generate_schema_from_ast(node)
        functions[func_name] = SavedFunction(declaration=decl, code=new_code)

        #f = 'dev/' + func_name + '.py'
        #with open(f, 'w') as fh:
        #  print(new_code, file=fh)
        print(f'FUNCTION FOUND: {func_name}')
      except Exception as e:
        print(f'ERROR DEFINING FUNCTION: {e}')
        breakpoint()
  return code, functions
