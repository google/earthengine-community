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
  SetElementAddedAction,
  SET_ELEMENT_ADDED,
  SetReorderingAction,
  SET_REORDERING,
  IncrementWidgetAction,
  INCREMENT_WIDGET_ID,
} from './types/actions';

/**
 * Sets the currently dragged widget to the element being dragged, or null
 * if there isn't any.
 * @param widget element currently being dragged.
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
 * @param widget element currently being edited.
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
 * @param index index of tab to be selected.
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
      draggingElement: null,
      elementAdded: false,
      reordering: false,
    },
  };
};

/**
 * Sets state to true if an element has been added to a dropzone. This is used to increment
 * a specified widget's id.
 * @param value true if an element has been added and false otherwise.
 */
export const setElementAdded = (value: boolean): SetElementAddedAction => {
  return {
    type: SET_ELEMENT_ADDED,
    payload: {
      value,
    },
  };
};

/**
 * Sets state to true if we are reordering widgets and false otherwise. Reordering state is used to determine
 * if a widget should be cloned and if we should increment the widget's id.
 * @param value true if we are reordering elements and false otherwise.
 */
export const setReordering = (value: boolean): SetReorderingAction => {
  return {
    type: SET_REORDERING,
    payload: {
      value,
    },
  };
};

/**
 * Increments the widget's id so that each widget can have a unique identifier.
 * @param id id of widget to be incremented.
 */
export const incrementWidgetID = (id: string): IncrementWidgetAction => {
  return {
    type: INCREMENT_WIDGET_ID,
    payload: {
      id,
    },
  };
};
