/**
 * Converts camel case to title case.
 * ie. helloWorld => Hello World
 */
export function camelCaseToTitleCase(text: string) {
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Returns widget type.
 * id. 'label-0' => 'label'
 */
export function getIdPrefix(id: string): string {
  return id.slice(0, id.indexOf('-'));
}

/**
 * Empty function. Used as a placeholder.
 */
export const noop = () => {};
