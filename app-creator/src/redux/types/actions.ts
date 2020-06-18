/**
 *  @fileoverview This file contains the type interfaces for each action in our store.
 */
import { EventType, AttributeType, Tab } from './enums';
import { AppCreatorStore } from '../reducer';

export const SET_DRAGGING_WIDGET = 'SET_DRAGGING_WIDGET';
export const SET_EDITING_WIDGET = 'SET_EDITING_WIDGET';
export const SET_ELEMENT_ADDED = 'SET_ELEMENT_ADDED';
export const SET_SELECTED_TAB = 'SET_SELECTED_TAB';
export const SET_REORDERING = 'SET_REORDERING';
export const INCREMENT_WIDGET_ID = 'INCREMENT_WIDGET_ID';
export const RESET_DRAGGING_VALUES = 'RESET_DRAGGING_VALUES';
export const ADD_WIDGET_META_DATA = 'ADD_WIDGET_META_DATA';
export const REMOVE_WIDGET = 'REMOVE_WIDGET';
export const UPDATE_WIDGET_META_DATA = 'UPDATE_WIDGET_META_DATA';
export const SET_SELECTED_TEMPLATE = 'SET_SELECTED_TEMPLATE';
export const UPDATE_WIDGET_CHILDREN = 'UPDATE_WIDGET_CHILDREN';

export interface UpdateWidgetChildren {
  type: typeof UPDATE_WIDGET_CHILDREN;
  payload: {
    id: string;
    childrenIDs: string[];
  };
}

export interface RemoveWidget {
  type: typeof REMOVE_WIDGET;
  payload: {
    id: string;
  };
}

export interface SetSelectedTemplate {
  type: typeof SET_SELECTED_TEMPLATE;
  payload: {
    template: AppCreatorStore['template'];
  };
}

export interface AddWidgetMetaData {
  type: typeof ADD_WIDGET_META_DATA;
  payload: {
    [id: string]: {
      id: string;
      widgetRef: HTMLElement;
      children: string[];
      uniqueAttributes: {};
      style: {};
    };
  };
}

export interface UpdateWidgetMetaData {
  type: typeof UPDATE_WIDGET_META_DATA;
  payload: {
    attributeName: string;
    value: string;
    id: string;
    attributeType: AttributeType;
  };
}

export interface SetDraggingWidgetAction {
  type: typeof SET_DRAGGING_WIDGET;
  payload: {
    draggingElement: Element | null;
  };
}

export interface SetEditingWidgetAction {
  type: typeof SET_EDITING_WIDGET;
  payload: {
    editingElement: Element | null;
    eventType: EventType;
    openAttributesTab: boolean;
  };
}

export interface SetSelectedTabAction {
  type: typeof SET_SELECTED_TAB;
  payload: {
    selectedTab: Tab;
  };
}

export interface ResetDraggingValuesAction {
  type: typeof RESET_DRAGGING_VALUES;
  payload: {
    draggingElement: null;
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
  | ResetDraggingValuesAction
  | AddWidgetMetaData
  | RemoveWidget
  | UpdateWidgetMetaData
  | UpdateWidgetChildren;
