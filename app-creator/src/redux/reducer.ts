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
  AppCreatorAction,
  ADD_WIDGET_META_DATA,
  REMOVE_WIDGET,
  UPDATE_WIDGET_META_DATA,
} from './types/actions';
import { Reducer, AnyAction } from 'redux';
import { UniqueAttributes } from './types/attributes';
import { EventType, Tab } from './types/enums';
import { getIdPrefix } from '../utils/helpers';

export interface WidgetMetaData {
  id: string;
  widgetRef: HTMLElement;
  children: string[];
  uniqueAttributes: UniqueAttributes;
  style: { [key: string]: string };
}

export interface AppCreatorStore {
  editingElement: Element | null;
  draggingElement: Element | null;
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
    case ADD_WIDGET_META_DATA:
      return {
        ...state,
        template: {
          ...state.template,
          ...action.payload,
        },
      };
    case UPDATE_WIDGET_META_DATA:
      const { attributeName, value, id, attributeType } = action.payload;
      const updatedTemplate = { ...state.template };

      if (attributeName.endsWith('unit')) {
        const attributePrefix = getIdPrefix(attributeName);
        const attributeValue =
          updatedTemplate[id][attributeType][attributePrefix];
        if (attributeValue.endsWith('px')) {
          updatedTemplate[id][attributeType][
            attributePrefix
          ] = attributeValue.replace('px', value);
        } else {
          updatedTemplate[id][attributeType][
            attributePrefix
          ] = attributeValue.replace('%', value);
        }
      } else {
        const attributeValue =
          updatedTemplate[id][attributeType][attributeName];

        updatedTemplate[id][attributeType][attributeName] =
          value + (attributeValue.endsWith('px') ? 'px' : '%');
      }

      const { widgetRef } = updatedTemplate[id];

      widgetRef.setStyle(updatedTemplate[id].style);
      updateUI(widgetRef, updatedTemplate);

      return {
        ...state,
        template: updatedTemplate,
      };
    case REMOVE_WIDGET:
      const newTemplate = { ...state.template };
      delete newTemplate[action.payload.id];
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
    case RESET_DRAGGING_VALUES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

/**
 * Updates DOM element with attributes.
 */
function updateUI(widget: HTMLElement, template: { [key: string]: any }) {
  for (const attr of Object.keys(template[widget.id].uniqueAttributes)) {
    widget.setAttribute(attr, template[widget.id].uniqueAttributes[attr]);
  }
}
