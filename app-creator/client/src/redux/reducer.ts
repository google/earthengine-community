/**
 *  @fileoverview This file contains the main reducer function that our store
 *  uses to resolve dispatched actions.
 */
import {
  SET_DRAGGING_WIDGET,
  SET_EDITING_WIDGET,
  SET_ELEMENT_ADDED,
  INCREMENT_WIDGET_ID,
  RESET_DRAGGING_VALUES,
  SET_SELECTED_TAB,
  SET_REORDERING,
  SET_IMPORTING,
  AppCreatorAction,
  ADD_WIDGET_META_DATA,
  REMOVE_WIDGET,
  UPDATE_WIDGET_META_DATA,
  SET_SELECTED_TEMPLATE,
  UPDATE_WIDGET_CHILDREN,
  SET_SELECTED_TEMPLATE_ID,
} from './types/actions';
import { Reducer, AnyAction } from 'redux';
import { UniqueAttributes } from './types/attributes';
import { EventType, Tab } from './types/enums';
import { getWidgetType } from '../utils/helpers';

export interface WidgetMetaData {
  id: string;
  editable?: boolean;
  widgetRef?: HTMLElement;
  children: string[];
  uniqueAttributes: UniqueAttributes;
  style: { [key: string]: string };
}

export interface AppCreatorStore {
  editingElement: Element | null;
  draggingElement: Element | null;
  selectedTemplateID: string;
  selectedTab: Tab;
  eventType: EventType;
  widgetIDs: { [key: string]: number };
  template: { [key: string]: any };
}

/**
 * Initial state of our application.
 */
const INITIAL_STATE: AppCreatorStore = {
  editingElement: null,
  draggingElement: null,
  selectedTab: Tab.widgets,
  selectedTemplateID: '',
  eventType: EventType.none,
  widgetIDs: {
    label: 0,
    button: 0,
    select: 0,
    textbox: 0,
    panel: 0,
    slider: 0,
    checkbox: 0,
    chart: 0,
    map: 0,
  },
  template: {},
};

/**
 * Resolves dispatched actions by returning a new state object
 * with the necessary modifications.
 * @param state current state of our application.
 * @param action action to be resolved.
 */
export const reducer: Reducer<AppCreatorStore, AppCreatorAction | AnyAction> = (
  state = INITIAL_STATE,
  action
): AppCreatorStore => {
  switch (action.type) {
    case SET_DRAGGING_WIDGET:
      return {
        ...state,
        ...action.payload,
      };
    case SET_EDITING_WIDGET:
      return {
        ...state,
        editingElement: action.payload.editingElement,
        eventType: action.payload.eventType,
        selectedTab: action.payload.openAttributesTab
          ? Tab.attributes
          : state.selectedTab,
      };
    case SET_SELECTED_TAB:
      return {
        ...state,
        ...action.payload,
      };
    case SET_ELEMENT_ADDED:
      return {
        ...state,
        eventType: action.payload.value ? EventType.adding : EventType.none,
      };
    case SET_REORDERING:
      return {
        ...state,
        eventType: action.payload.value ? EventType.reordering : EventType.none,
      };
    case SET_SELECTED_TEMPLATE_ID:
      return {
        ...state,
        selectedTemplateID: action.payload.id,
      };
    case SET_IMPORTING:
      return {
        ...state,
        eventType: action.payload.value ? EventType.importing : EventType.none,
      };
    case ADD_WIDGET_META_DATA:
      return {
        ...state,
        template: {
          ...state.template,
          widgets: {
            ...state.template.widgets,
            ...action.payload,
          },
        },
      };
    case UPDATE_WIDGET_META_DATA:
      const { attributeName, value, id, attributeType } = action.payload;
      const updatedTemplate = { ...state.template };

      if (attributeName.endsWith('unit')) {
        const attributePrefix = getWidgetType(attributeName);
        const attributeValue =
          updatedTemplate.widgets[id][attributeType][attributePrefix];
        if (attributeValue.endsWith('px')) {
          updatedTemplate.widgets[id][attributeType][
            attributePrefix
          ] = attributeValue.replace('px', value);
        } else {
          updatedTemplate.widgets[id][attributeType][
            attributePrefix
          ] = attributeValue.replace('%', value);
        }
      } else {
        const attributeValue =
          updatedTemplate.widgets[id][attributeType][attributeName];

        updatedTemplate.widgets[id][attributeType][attributeName] = value;

        if (attributeValue.endsWith('px') || attributeValue.endsWith('%')) {
          if (!value.endsWith('px') && !value.endsWith('%')) {
            updatedTemplate.widgets[id][attributeType][
              attributeName
            ] += attributeValue.endsWith('px') ? 'px' : '%';
          }
        }
      }

      const { widgetRef } = updatedTemplate.widgets[id];

      updatedTemplate.widgets[id].style.backgroundColor = getBackgroundColor(
        updatedTemplate.widgets[id].style
      );

      widgetRef.setStyle(updatedTemplate.widgets[id].style);
      updateUI(widgetRef, updatedTemplate);

      return {
        ...state,
        template: updatedTemplate,
      };
    case REMOVE_WIDGET:
      const newTemplate = { ...state.template };
      if (!action.payload.reordering) {
        delete newTemplate.widgets[action.payload.id];
      }
      for (const key in newTemplate.widgets) {
        const widget = newTemplate.widgets[key];
        if (
          typeof widget === 'object' &&
          !Array.isArray(widget) &&
          'children' in widget
        ) {
          widget.children = widget.children.filter(
            (id: string) => id !== action.payload.id
          );
        }
      }
      return {
        ...state,
        template: newTemplate,
      };
    case INCREMENT_WIDGET_ID:
      return {
        ...state,
        widgetIDs: {
          ...state.widgetIDs,
          [action.payload.id]: state.widgetIDs[action.payload.id] + 1,
        },
      };
    case SET_SELECTED_TEMPLATE:
      addDefaultStyles(action.payload.template);
      return {
        ...INITIAL_STATE,
        selectedTemplateID: state.selectedTemplateID,
        selectedTab: state.selectedTab,
        template: action.payload.template,
      };
    case RESET_DRAGGING_VALUES:
      return {
        ...state,
        ...action.payload,
      };
    case UPDATE_WIDGET_CHILDREN:
      return {
        ...state,
        template: {
          ...state.template,
          widgets: {
            ...state.template.widgets,
            [action.payload.id]: {
              ...state.template.widgets[action.payload.id],
              children: action.payload.childrenIDs,
            },
          },
        },
      };
    default:
      return state;
  }
};

/**
 * Adds default styles to all widgets.
 */
function addDefaultStyles(template: { [key: string]: any }) {
  for (const id in template.widgets) {
    const styleCopy: { [key: string]: string } = Object.assign(
      {},
      DEFAULT_STYLES
    );
    for (const attribute in template.widgets[id].style) {
      styleCopy[attribute] = template.widgets[id].style[attribute];
    }
    template.widgets[id].style = styleCopy;
  }
}

/**
 * Updates DOM element with attributes.
 */
function updateUI(widget: HTMLElement, template: { [key: string]: any }) {
  for (const attr of Object.keys(
    template.widgets[widget.id].uniqueAttributes
  )) {
    widget.setAttribute(
      attr,
      template.widgets[widget.id].uniqueAttributes[attr]
    );
  }
}

function getBackgroundColor(style: { [key: string]: any }): string {
  // Stringified number from 0 - 100 (only integers) or an empty string.
  let backgroundOpacityStr = style.backgroundOpacity;

  // Empty string case.
  if (backgroundOpacityStr === '') {
    backgroundOpacityStr = '100';
  }

  const backgroundOpacity = parseInt(backgroundOpacityStr);

  const fraction = backgroundOpacity / 100;

  const hexFraction = Math.floor(255 * fraction);

  // Ensure that the hex number is at least two digits.
  let hexNumberString = ('0' + hexFraction.toString(16)).slice(-2);

  const newBackgroundColor =
    style.backgroundColor.slice(0, 7) + hexNumberString.toUpperCase();

  // Example: #FFFFFF00, where the last two hex numbers represent the opacity.
  return newBackgroundColor;
}

/**
 * List of default styles shared across all widgets.
 */
const DEFAULT_STYLES = {
  height: 'px',
  width: 'px',
  padding: '0px',
  margin: '8px',
  borderWidth: '0px',
  borderStyle: 'solid',
  borderColor: 'black',
  fontSize: '12px',
  color: 'black',
  backgroundOpacity: '0',
  fontWeight: '300',
  fontFamily: 'Roboto',
  textAlign: 'left',
  whiteSpace: 'normal',
  shown: 'true',
};
