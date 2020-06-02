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
  Tab,
} from './types/actions';
import { Reducer, AnyAction } from 'redux';

export interface AppCreatorStore {
  element: Element | null;
  selectedTab: Tab;
  eventType: EventType;
  widgetIDs: { [key: string]: number };
}

export const enum EventType {
  editing = 'editing',
  reordering = 'reordering',
  adding = 'adding',
  none = 'none',
}

/**
 * Initial state of our application.
 */
const INITIAL_STATE: AppCreatorStore = {
  element: null,
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
  },
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
        element: action.payload.widget,
        eventType: EventType.none,
      };
    case SET_EDITING_WIDGET:
      return {
        ...state,
        element: action.payload.widget,
        eventType: EventType.editing,
        selectedTab:
          action.payload.widget == null
            ? state.selectedTab
            : action.payload.index,
      };
    case SET_SELECTED_TAB:
      return {
        ...state,
        selectedTab: action.payload.index,
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
