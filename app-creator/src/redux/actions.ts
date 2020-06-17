/**
 *  @fileoverview This file contains a set of action creators that modify the state of our application.
 */
import {
  ADD_WIDGET_META_DATA,
  REMOVE_WIDGET,
  SetDraggingWidgetAction,
  SET_DRAGGING_WIDGET,
  SetEditingWidgetAction,
  SET_EDITING_WIDGET,
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
  AddWidgetMetaData,
  RemoveWidget,
  UPDATE_WIDGET_META_DATA,
  UpdateWidgetMetaData,
  SetSelectedTemplate,
  SET_SELECTED_TEMPLATE,
  UpdateChildrenOrdering,
  UPDATE_CHILDREN_ORDERING,
} from './types/actions';
import {
  DEFAULT_SHARED_ATTRIBUTES,
  UniqueAttributes,
} from './types/attributes';
import { WidgetType, AttributeType, Tab, EventType } from './types/enums';
import { getIdPrefix } from '../utils/helpers';
import { Label } from '../widgets/ui-label/ui-label';
import { Button } from '../widgets/ui-button/ui-button';
import { Checkbox } from '../widgets/ui-checkbox/ui-checkbox';
import { Select } from '../widgets/ui-select/ui-select';
import { Slider } from '../widgets/ui-slider/ui-slider';
import { Textbox } from '../widgets/ui-textbox/ui-textbox';
import { Chart } from '../widgets/ui-chart/ui-chart';
import { Map } from '../widgets/ui-map/ui-map';
import { AppCreatorStore } from './reducer';

/**
 * Updates widget attributes.
 */
export const updateWidgetMetaData = (
  attributeName: string,
  value: string,
  id: string,
  attributeType: AttributeType
): UpdateWidgetMetaData => {
  return {
    type: UPDATE_WIDGET_META_DATA,
    payload: {
      attributeName,
      value,
      id,
      attributeType,
    },
  };
};

/**
 * Removes the widget metadata for the given widget id.
 */
export const removeWidgetMetaData = (id: string): RemoveWidget => {
  return {
    type: REMOVE_WIDGET,
    payload: {
      id,
    },
  };
};

/**
 * Adds widget meta data to the store's template representation.
 */
export const addWidgetMetaData = (
  id: string,
  widget: Element
): AddWidgetMetaData => {
  return {
    type: ADD_WIDGET_META_DATA,
    payload: {
      [id]: {
        id,
        widgetRef: widget as HTMLElement,
        children: [],
        uniqueAttributes: {
          ...getUniqueAttributes(getIdPrefix(id)),
        },
        style: { ...DEFAULT_SHARED_ATTRIBUTES },
      },
    },
  };
};

/**
 * Updates children ordering.
 */
export const updateChildrenOrdering = (): UpdateChildrenOrdering => {
  return {
    type: UPDATE_CHILDREN_ORDERING,
    payload: {},
  };
};

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
      draggingElement: widget,
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
      editingElement: widget,
      /**
       * If widget is null, then we want to clear the editing state.
       * This occurs when are dragging a new widget or we are removing the current widget being edited.
       */
      eventType: widget == null ? EventType.none : EventType.editing,
      // Open attributes tab if we are editing an element (ie. Not clearing state).
      openAttributesTab: widget != null,
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
      selectedTab: index,
    },
  };
};

/**
 * Sets the actions-panel's selected tab to the index passed in.
 */
export const setSelectedTemplate = (
  template: AppCreatorStore['template'],
  markup: string
): SetSelectedTemplate => {
  return {
    type: SET_SELECTED_TEMPLATE,
    payload: {
      template,
      markup,
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

/**
 * Returns default values for a specified widget type (ie. label, button, etc).
 */
function getUniqueAttributes(type: string): UniqueAttributes {
  switch (type) {
    case WidgetType.label:
      return Label.DEFAULT_LABEL_ATTRIBUTES;
    case WidgetType.button:
      return Button.DEFAULT_BUTTON_ATTRIBUTES;
    case WidgetType.checkbox:
      return Checkbox.DEFAULT_CHECKBOX_ATTRIBUTES;
    case WidgetType.select:
      return Select.DEFAULT_SELECT_ATTRIBUTES;
    case WidgetType.slider:
      return Slider.DEFAULT_SLIDER_ATTRIBUTES;
    case WidgetType.textbox:
      return Textbox.DEFAULT_TEXTBOX_ATTRIBUTES;
    case WidgetType.chart:
      return Chart.DEFAULT_CHART_ATTRIBUTES;
    case WidgetType.map:
      return Map.DEFAULT_MAP_ATTRIBUTES;
    default:
      return {};
  }
}
