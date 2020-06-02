import { EventType } from '../reducer';

/**
 *  @fileoverview This file contains the type interfaces for each action in our store.
 */
export const SET_DRAGGING_WIDGET = 'SET_DRAGGING_WIDGET';
export const SET_EDITING_WIDGET = 'SET_EDITING_WIDGET';
export const SET_ELEMENT_ADDED = 'SET_ELEMENT_ADDED';
export const SET_SELECTED_TAB = 'SET_SELECTED_TAB';
export const INCREMENT_WIDGET_ID = 'INCREMENT_WIDGET_ID';
export const RESET_DRAGGING_VALUES = 'RESET_DRAGGING_VALUES';
export const SET_REORDERING = 'SET_REORDERING';

export enum Tab {
  templates = 0,
  widgets = 1,
  attributes = 2,
}

export interface SetDraggingWidgetAction {
  type: typeof SET_DRAGGING_WIDGET;
  payload: {
    widget: Element | null;
  };
}

export interface SetEditingWidgetAction {
  type: typeof SET_EDITING_WIDGET;
  payload: {
    widget: Element | null;
    index: Tab;
  };
}

export interface SetSelectedTabAction {
  type: typeof SET_SELECTED_TAB;
  payload: {
    index: Tab;
  };
}

export interface ResetDraggingValuesAction {
  type: typeof RESET_DRAGGING_VALUES;
  payload: {
    element: null;
    eventType: EventType;
  };
}

export interface SetIsElementAddedAction {
  type: typeof SET_ELEMENT_ADDED;
  payload: {
    value: boolean;
  };
}

export interface IncrementWidgetAction {
  type: typeof INCREMENT_WIDGET_ID;
  payload: {
    id: string;
  };
}

export interface SetIsReorderingAction {
  type: typeof SET_REORDERING;
  payload: {
    value: boolean;
  };
}

export type AppCreatorAction =
  | SetDraggingWidgetAction
  | SetEditingWidgetAction
  | SetIsElementAddedAction
  | SetSelectedTabAction
  | SetIsReorderingAction
  | IncrementWidgetAction
  | ResetDraggingValuesAction;
