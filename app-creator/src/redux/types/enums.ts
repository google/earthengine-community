export enum InputType {
  text = 'text',
  textarea = 'textarea',
  number = 'number',
  color = 'color',
  select = 'select',
}

export enum WidgetType {
  label = 'label',
  button = 'button',
  checkbox = 'checkbox',
  select = 'select',
  slider = 'slider',
  textbox = 'textbox',
}

export enum Tab {
  templates = 0,
  widgets = 1,
  attributes = 2,
}

export enum AttributeType {
  unique = 'uniqueAttributes',
  style = 'style',
}

export const enum EventType {
  editing = 'editing',
  reordering = 'reordering',
  adding = 'adding',
  none = 'none',
}
