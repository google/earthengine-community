"""Parser for (probably LLM-generated) Python code."""
import ast
import copy
import dataclasses
import logging
import re
import textwrap
from typing import Optional
import docstring_parser

# pylint:disable=logging-fstring-interpolation


@dataclasses.dataclass
class Function:
  code: str
  name: str
  docstring: str
  parameters: list[dict[str, str]]
  return_type: str

  def signature(self):
    sans_code = copy.deepcopy(self)
    sans_code.code = ''
    return str(sans_code)


@dataclasses.dataclass
class MaybeCode:
  code: str
  code_block_found: bool


@dataclasses.dataclass
class ParsedResponse:
  code: str = ''
  functions: dict[str, Function] = dataclasses.field(default_factory=dict)
  error: str = ''


class ImportFinder(ast.NodeVisitor):
  """AST Visitor that finds and preserves the source text of all imports."""

  def __init__(self, source_lines: list[str]):
    self.source_lines = source_lines
    self.import_statements = []

  def _node_source(self, node: ast.AST) -> str:
    """Extracts the source code for a node using line numbers."""
    if hasattr(node, 'lineno') and hasattr(node, 'end_lineno'):
      start = node.lineno - 1
      end = node.end_lineno
      if start == end - 1:
        return self.source_lines[start].strip()
      else:
        return '\n'.join(line.strip() for line in self.source_lines[start:end])
    else:
      # Fallback for nodes without position info
      return ast.unparse(node)

  def visit_Import(self, node: ast.Import) -> None:  # pylint:disable=invalid-name
    """Handles regular import statements."""
    self.import_statements.append(self._node_source(node))
    self.generic_visit(node)

  def visit_ImportFrom(self, node: ast.ImportFrom) -> None:  # pylint:disable=invalid-name
    """Handles 'from ... import ...' statements."""
    self.import_statements.append(self._node_source(node))
    self.generic_visit(node)


class Parser:
  """Parser of (probably LLM-generated) Python code."""

  _logger: logging.Logger

  def __init__(self, logger: Optional[logging.Logger] = None):
    self._logger = logger or logging.getLogger()

  def _extract_function_details(self, func_def: ast.FunctionDef) -> Function:
    """Extracts details of a function."""
    name = func_def.name
    docstring = ast.get_docstring(func_def) or ''
    parameters = self._extract_parameters(func_def)
    return_type = self._extract_return_type(func_def)

    return Function(
        code=ast.unparse(func_def),
        name=name,
        docstring=docstring,
        parameters=parameters,
        return_type=return_type,
    )

  def _extract_parameters(
      self, func_def: ast.FunctionDef
  ) -> list[dict[str, str]]:
    """Extracts function parameter details."""
    parameters = []
    parsed_docstring = self._parse_docstring(ast.get_docstring(func_def))

    # Handle positional arguments, default values, and keyword-only arguments
    args = func_def.args
    defaults = dict(
        zip(
            [arg.arg for arg in args.args[::-1]],
            [ast.unparse(d) for d in args.defaults[::-1]],
        )
    )

    # Include keyword-only arguments
    kwonly_args = {
        arg.arg: ast.unparse(d)
        for arg, d in zip(args.kwonlyargs, args.kw_defaults)
        if d is not None
    }
    defaults.update(kwonly_args)
    all_args = args.args + args.kwonlyargs

    for arg in all_args:
      param_name = arg.arg
      param_type = self._extract_type_hint(arg)
      param_description = self._find_param_description(
          parsed_docstring, param_name
      )
      param_default = defaults.get(param_name, '')

      parameters.append({
          'name': param_name,
          'type': param_type,
          'description': param_description,
          'default': param_default,
      })

    return parameters

  def _extract_type_hint(self, node: ast.arg) -> str:
    """Extracts the type hint of a parameter as a string."""
    if node.annotation:
      return ast.unparse(node.annotation)
    else:
      return ''

  def _find_param_description(self, parsed_docstring, param_name: str) -> str:
    """Finds the description of a parameter in the parsed docstring.

    Handles cases where the docstring parser might not find descriptions
    reliably, especially with complex type hints.

    Args:
      parsed_docstring: the output of docstring_parser
      param_name: the name of the parameter to look for

    Returns:
      the description of the parameter, if found, or an empty string
    """
    for param in parsed_docstring.params:
      if param.arg_name == param_name:
        return param.description

    # More precise workaround for missing descriptions:
    if parsed_docstring.long_description:
      # This regex uses a negative lookahead assertion to ensure that
      # we only match the description of the current parameter
      # and not the descriptions of subsequent parameters.
      match = re.search(
          rf'(?m)^\s*{param_name}\s*\(?.*?\)?:\s*(.*?)(?=\n\s*[\w-]+\s*\(?.*?\)?:\s*|$)',
          parsed_docstring.long_description,
          re.DOTALL,
      )
      if match:
        return match.group(1).strip()

    return ''

  def _extract_return_type(self, func_def: ast.FunctionDef) -> str:
    """Extracts the return type of a function as a string."""
    if func_def.returns:
      return ast.unparse(func_def.returns)
    else:
      return ''

  def _parse_docstring(self, docstring: str):
    return docstring_parser.parse(docstring)

  def extract_python_code_blocks(self, text: str) -> MaybeCode:
    if not text:
      return MaybeCode('', code_block_found=False)
    pattern = re.compile(
        r'```(?:python|tool_code)\n*(.*?)\n*```', re.DOTALL | re.IGNORECASE
    )
    code_blocks = pattern.findall(text)
    if code_blocks:
      result = MaybeCode('\n'.join(code_blocks), code_block_found=True)
    else:
      result = MaybeCode(text, code_block_found=False)
    result.code = textwrap.dedent(result.code)
    return result

  def extract_functions(self, response: str) -> ParsedResponse:
    """Extracts functions from the code, including their details."""
    extracted = self.extract_python_code_blocks(response)
    if not extracted.code:
      return ParsedResponse()

    try:
      tree = ast.parse(extracted.code)
    except SyntaxError as e:
      if not extracted.code_block_found:
        return ParsedResponse()
      error = f'ERROR PARSING CODE: {e}'
      self._logger.warning(error)
      return ParsedResponse('', {}, error)

    functions = {}
    import_finder = ImportFinder(extracted.code.splitlines())
    import_finder.visit(tree)
    for node in ast.walk(tree):
      if isinstance(node, ast.FunctionDef):
        func_name = node.name
        if func_name.startswith('test_'):
          continue

        try:
          function_details = self._extract_function_details(node)
          functions[func_name] = function_details
          self._logger.info(f'FUNCTION FOUND: {func_name}')
        except Exception as e:  # pylint:disable=broad-exception-caught
          self._logger.error(f'ERROR DEFINING FUNCTION: {func_name} - {e}')
          return ParsedResponse(
              extracted.code, {}, 'Error extracting function details'
          )

    return ParsedResponse(extracted.code, functions)
