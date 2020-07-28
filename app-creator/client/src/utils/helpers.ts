import { DeviceType } from '../redux/types/enums';

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
export function getWidgetType(id: string): string {
  return id.slice(0, id.indexOf('-'));
}

/**
 * Used when getting prefix of wrapper widget.
 */
export function getIdPrefixLastIndex(id: string) {
  return id.slice(0, id.lastIndexOf('-'));
}

/**
 * Empty function. Used as a placeholder.
 */
export const noop: VoidFunction = () => {};

/**
 * List of chip data used for sorting templates by device type.
 */
export const chips = [
  {
    label: 'All',
    device: DeviceType.all,
  },
  {
    label: 'Web',
    device: DeviceType.desktop,
  },
  {
    label: 'Mobile',
    device: DeviceType.mobile,
  },
];
