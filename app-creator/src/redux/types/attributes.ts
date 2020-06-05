/**
 *  @fileoverview This file contains interface types for the different style attributes.
 */
import { InputType } from './enums';

export type SharedAttributes =
  | 'height'
  | 'width'
  | 'padding'
  | 'margin'
  | 'color'
  | 'backgroundColor'
  | 'borderWidth'
  | 'borderType'
  | 'borderColor'
  | 'fontSize'
  | 'fontWeight'
  | 'fontFamily'
  | 'textAlign'
  | 'whiteSpace'
  | 'shown';

export interface AttributeMetaData {
  [key: string]: {
    value: string;
    type: InputType;
    items?: string[];
  };
}

export interface DefaultAttributesType {
  [key: string]: string;
}

export const sharedAttributes: AttributeMetaData = {
  height: {
    value: '',
    type: InputType.number,
  },
  width: {
    value: '',
    type: InputType.number,
  },
  padding: {
    value: '0',
    type: InputType.number,
  },
  margin: {
    value: '8',
    type: InputType.number,
  },
  color: {
    value: 'black',
    type: InputType.color,
  },
  backgroundColor: {
    value: 'none',
    type: InputType.color,
  },
  borderWidth: {
    value: '0',
    type: InputType.number,
  },
  borderType: {
    value: 'solid',
    type: InputType.select,
    items: ['solid', 'dashed'],
  },
  borderColor: {
    value: 'black',
    type: InputType.color,
  },
  fontSize: {
    value: '12',
    type: InputType.number,
  },
  fontWeight: {
    value: '300',
    type: InputType.select,
    items: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  },
  fontFamily: {
    value: 'Roboto',
    type: InputType.select,
    items: [
      'Arial',
      'Arial Black',
      'Bookman',
      'Candara',
      'Comic Sans MS',
      'Courier',
      'Courier New',
      'Garamond',
      'Georgia',
      'Impact',
      'Open Sans',
      'Palatino',
      'Roboto',
      'Times',
      'Times New Roman',
      'Verdana',
    ],
  },
  textAlign: {
    value: 'left',
    type: InputType.select,
    items: ['left', 'center', 'right', 'justify'],
  },
  whiteSpace: {
    value: 'normal',
    type: InputType.select,
    items: ['normal', 'pre'],
  },
  shown: {
    value: 'true',
    type: InputType.select,
    items: ['true', 'false'],
  },
};

export const DEFAULT_SHARED_ATTRIBUTES: DefaultAttributesType = Object.keys(
  sharedAttributes
).reduce((attributes, key) => {
  if (sharedAttributes[key].type === InputType.number) {
    return { ...attributes, [key]: sharedAttributes[key].value + 'px' };
  }
  return { ...attributes, [key]: sharedAttributes[key].value };
}, {});

export const textboxAttributes: AttributeMetaData = {
  value: {
    value: '',
    type: InputType.text,
  },
  placeholder: {
    value: 'Enter text',
    type: InputType.text,
  },
};

export const DEFAULT_TEXTBOX_ATTRIBUTES: DefaultAttributesType = Object.keys(
  textboxAttributes
).reduce(
  (attributes, key) => ({ ...attributes, [key]: textboxAttributes[key].value }),
  {}
);

export const labelAttributes: AttributeMetaData = {
  value: {
    value:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    type: InputType.textarea,
  },
  targetUrl: {
    value: '',
    type: InputType.text,
  },
};

export const DEFAULT_LABEL_ATTRIBUTES: DefaultAttributesType = Object.keys(
  labelAttributes
).reduce(
  (attributes, key) => ({ ...attributes, [key]: labelAttributes[key].value }),
  {}
);

export const buttonAttributes: AttributeMetaData = {
  label: {
    value: 'Button',
    type: InputType.text,
  },
  disabled: {
    value: 'false',
    type: InputType.select,
    items: ['true', 'false'],
  },
};

export const DEFAULT_BUTTON_ATTRIBUTES: DefaultAttributesType = Object.keys(
  buttonAttributes
).reduce(
  (attributes, key) => ({ ...attributes, [key]: buttonAttributes[key].value }),
  {}
);

export const checkboxAttributes: AttributeMetaData = {
  label: {
    value: 'Item',
    type: InputType.text,
  },
  value: {
    value: 'false',
    type: InputType.select,
    items: ['true', 'false'],
  },
  disabled: {
    value: 'false',
    type: InputType.select,
    items: ['true', 'false'],
  },
};

export const DEFAULT_CHECKBOX_ATTRIBUTES: DefaultAttributesType = Object.keys(
  checkboxAttributes
).reduce(
  (attributes, key) => ({
    ...attributes,
    [key]: checkboxAttributes[key].value,
  }),
  {}
);

export const selectAttributes: AttributeMetaData = {
  items: {
    value: 'Item 1, Item 2',
    type: InputType.text,
  },
  placeholder: {
    value: 'Select Item',
    type: InputType.text,
  },
  value: {
    value: 'Item 1',
    type: InputType.text,
  },
  disabled: {
    value: 'false',
    type: InputType.select,
    items: ['true', 'false'],
  },
};

export const DEFAULT_SELECT_ATTRIBUTES: DefaultAttributesType = Object.keys(
  selectAttributes
).reduce(
  (attributes, key) => ({ ...attributes, [key]: selectAttributes[key].value }),
  {}
);

export const sliderAttributes: AttributeMetaData = {
  min: {
    value: '0',
    type: InputType.number,
  },
  max: {
    value: '100',
    type: InputType.number,
  },
  value: {
    value: '50',
    type: InputType.number,
  },
  step: {
    value: '5',
    type: InputType.number,
  },
  direction: {
    value: 'horizontal',
    type: InputType.select,
    items: ['horizontal', 'vertical'],
  },
  disabled: {
    value: 'false',
    type: InputType.select,
    items: ['true', 'false'],
  },
};

export const DEFAULT_SLIDER_ATTRIBUTES: DefaultAttributesType = Object.keys(
  sliderAttributes
).reduce(
  (attributes, key) => ({ ...attributes, [key]: sliderAttributes[key].value }),
  {}
);

export type UniqueAttributes =
  | typeof DEFAULT_LABEL_ATTRIBUTES
  | typeof DEFAULT_BUTTON_ATTRIBUTES
  | typeof DEFAULT_CHECKBOX_ATTRIBUTES
  | typeof DEFAULT_LABEL_ATTRIBUTES
  | typeof DEFAULT_SELECT_ATTRIBUTES
  | typeof DEFAULT_SLIDER_ATTRIBUTES
  | typeof DEFAULT_TEXTBOX_ATTRIBUTES;
