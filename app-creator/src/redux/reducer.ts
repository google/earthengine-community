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
  draggingWidget: Element | null;
  editingWidget: Element | null;
  selectedTab: Tab;
  elementAdded: boolean;
  reordering: boolean;
  widgetIDs: { [key: string]: number };
}

/**
 * Initial state of our application.
 */
const INITIAL_STATE: AppCreatorStore = {
  draggingWidget: null,
  editingWidget: null,
  selectedTab: Tab.widgets,
  elementAdded: false,
  reordering: false,
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
        draggingWidget: action.payload.widget,
      };
    case SET_EDITING_WIDGET:
      return {
        ...state,
        editingWidget: action.payload.widget,
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
        elementAdded: action.payload.value,
      };
    case SET_REORDERING:
      return {
        ...state,
        reordering: action.payload.value,
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
