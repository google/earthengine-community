/**
 *  @fileoverview This file contains interface types for the different style attributes.
 */
import { InputType } from './enums';
import { Label } from '../../widgets/ui-label/ui-label';
import { Button } from '../../widgets/ui-button/ui-button';
import { Checkbox } from '../../widgets/ui-checkbox/ui-checkbox';
import { Select } from '../../widgets/ui-select/ui-select';
import { Slider } from '../../widgets/ui-slider/ui-slider';
import { Textbox } from '../../widgets/ui-textbox/ui-textbox';
import { Chart } from '../../widgets/ui-chart/ui-chart';
import { Map } from '../../widgets/ui-map/ui-map';

export type SharedAttributes =
  | 'height'
  | 'width'
  | 'padding'
  | 'margin'
  | 'color'
  | 'backgroundColor'
  | 'borderWidth'
  | 'borderStyle'
  | 'borderColor'
  | 'fontSize'
  | 'fontWeight'
  | 'fontFamily'
  | 'textAlign'
  | 'whiteSpace'
  | 'shown';

export interface Tooltip {
  text?: string;
  url?: string;
}

export interface AttributeMetaData {
  [key: string]: {
    value: string;
    placeholder?: string;
    tooltip?: Tooltip;
    unit?: string;
    step?: number;
    min?: number;
    max?: number;
    type: InputType;
    items?: string[];
    validator?: (value: string) => boolean;
  };
}

export interface DefaultAttributesType {
  [key: string]: string;
}

export const sharedAttributes: AttributeMetaData = {
  height: {
    value: '',
    placeholder: '35',
    unit: 'px',
    type: InputType.number,
  },
  width: {
    value: '',
    placeholder: '35',
    unit: 'px',
    type: InputType.number,
  },
  padding: {
    value: '0px',
    placeholder: "ie. '8px', '8px 8px', '8px 8px 8px 8px'",
    type: InputType.text,
  },
  margin: {
    value: '8px',
    placeholder: "ie. '8px', '8px 8px', '8px 8px 8px 8px'",
    type: InputType.text,
  },
  color: {
    value: 'black',
    type: InputType.color,
  },
  backgroundColor: {
    value: '#FFFFFF00',
    type: InputType.color,
  },
  borderWidth: {
    value: '0',
    placeholder: '0',
    type: InputType.number,
  },
  borderStyle: {
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
    placeholder: '12',
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
).reduce((attributes: DefaultAttributesType, key) => {
  if (sharedAttributes[key].type === InputType.number) {
    attributes[key] = sharedAttributes[key].value + 'px';
    return attributes;
  }
  attributes[key] = sharedAttributes[key].value;
  return attributes;
}, {});

export function getDefaultAttributes(
  attributes: AttributeMetaData
): DefaultAttributesType {
  return Object.keys(attributes).reduce(
    (defaultAttributes: DefaultAttributesType, key) => {
      defaultAttributes[key] = attributes[key].value;
      return defaultAttributes;
    },
    {}
  );
}

export type UniqueAttributes =
  | typeof Label.DEFAULT_LABEL_ATTRIBUTES
  | typeof Button.DEFAULT_BUTTON_ATTRIBUTES
  | typeof Checkbox.DEFAULT_CHECKBOX_ATTRIBUTES
  | typeof Select.DEFAULT_SELECT_ATTRIBUTES
  | typeof Slider.DEFAULT_SLIDER_ATTRIBUTES
  | typeof Textbox.DEFAULT_TEXTBOX_ATTRIBUTES
  | typeof Chart.DEFAULT_CHART_ATTRIBUTES
  | typeof Map.DEFAULT_MAP_ATTRIBUTES;
