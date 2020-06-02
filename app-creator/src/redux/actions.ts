/**
 *  @fileoverview This file contains a set of action creators that modify the state of our application.
 */
import {
  SetDraggingWidgetAction,
  SET_DRAGGING_WIDGET,
  SetEditingWidgetAction,
  SET_EDITING_WIDGET,
  Tab,
  SetSelectedTabAction,
  SET_SELECTED_TAB,
  ResetDraggingValuesAction,
  RESET_DRAGGING_VALUES,
  SetIsElementAddedAction,
  SET_ELEMENT_ADDED,
  SetIsReorderingAction,
  SET_REORDERING,
  IncrementWidgetAction,
  INCREMENT_WIDGET_ID,
} from './types/actions';
import { EventType } from './reducer';

/**
 * Sets the currently dragged widget to the element being dragged, or null
 * if there isn't any.
 */
export const setDraggingWidget = (
  widget: Element | null
): SetDraggingWidgetAction => {
  return {
    type: SET_DRAGGING_WIDGET,
    payload: {
      widget,
    },
  };
};

/**
 * Sets the widget that is currently being edited, or null if there isn't any.
 */
export const setEditingWidget = (
  widget: Element | null
): SetEditingWidgetAction => {
  return {
    type: SET_EDITING_WIDGET,
    payload: {
      widget,
      index: Tab.attributes,
    },
  };
};

/**
 * Sets the actions-panel's selected tab to the index passed in.
 */
export const setSelectedTab = (index: Tab): SetSelectedTabAction => {
  return {
    type: SET_SELECTED_TAB,
    payload: {
      index,
    },
  };
};

/**
 * Resets dragging values on dragend.
 */
export const resetDraggingValues = (): ResetDraggingValuesAction => {
  return {
    type: RESET_DRAGGING_VALUES,
    payload: {
      element: null,
      eventType: EventType.none,
    },
  };
};

/**
 * Sets state to true if an element has been added to a dropzone. This is used to increment
 * a specified widget's ID.
 * @param value true if an element has been added and false otherwise.
 */
export const setElementAdded = (value: boolean): SetIsElementAddedAction => {
  return {
    type: SET_ELEMENT_ADDED,
    payload: {
      value,
    },
  };
};

/**
 * Sets state to true if we are reordering widgets and false otherwise. Reordering state is used to determine
 * if a widget should be cloned and if we should increment the widget's ID.
 * @param value true if we are reordering elements and false otherwise.
 */
export const setReordering = (value: boolean): SetIsReorderingAction => {
  return {
    type: SET_REORDERING,
    payload: {
      value,
    },
  };
};

/**
 * Increments the widget's ID so that each widget can have a unique identifier.
 */
export const incrementWidgetID = (id: string): IncrementWidgetAction => {
  return {
    type: INCREMENT_WIDGET_ID,
    payload: {
      id,
    },
  };
};
