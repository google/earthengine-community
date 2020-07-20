/**
 * @fileoverview this file contains the logic for rendering a template given its corresponding JSON string. It is used
 * whenever we want to display a new template on the story-board.
 */
import { AppCreatorStore, WidgetMetaData } from '../redux/reducer';
import { ROOT_ID } from './constants';
import { store } from '../redux/store';
import { setSelectedTemplate } from '../redux/actions';
import { Dropzone } from '../widgets/dropzone-widget/dropzone-widget';
import { DraggableWidget } from '../widgets/draggable-widget/draggable-widget';
import { getIdPrefix } from './helpers';
import { EEWidget } from '../redux/types/types';
import { WidgetType } from '../redux/types/enums';
import { Panel } from '../widgets/ui-panel/ui-panel';
import { Map } from '../widgets/ui-map/ui-map';

export function generateUI(
  template: AppCreatorStore['template'],
  node: HTMLElement
) {
  const templateCopy = Object.assign({}, template);

  function helper(widgetData: WidgetMetaData): HTMLElement {
    const { id, children } = widgetData;
    const { element, dropzone, map, draggable } = getWidgetElement(widgetData);

    for (const childID of children) {
      if (dropzone != null) {
        dropzone.appendChild(helper(templateCopy[childID]));
      } else {
        element.appendChild(helper(templateCopy[childID]));
      }
    }

    if (map != null) {
      templateCopy[id].widgetRef = map;
    } else {
      templateCopy[id].widgetRef = element;
    }

    return draggable == null ? element : draggable;
  }

  // The root of the template will always have an id of panel-template-0
  const root = templateCopy[ROOT_ID];
  node.appendChild(helper(root));

  // Replace the store's template with the one that include the widgetRefs.
  store.dispatch(setSelectedTemplate(templateCopy));
}

export function getWidgetElement({
  id,
  editable,
  uniqueAttributes,
  style,
}: WidgetMetaData): {
  element: HTMLElement;
  dropzone: Dropzone | null;
  map: Map | null;
  draggable: DraggableWidget | null;
} {
  // Get widget type (ie. panel-0 -> panel).
  const type = getIdPrefix(id);

  // Create DOM element.
  let element = document.createElement(`ui-${type}`);
  element.id = id;

  // Set Unique attributes.
  for (const attribute in uniqueAttributes) {
    element.setAttribute(attribute, uniqueAttributes[attribute]);
  }

  // Set styles.
  (element as EEWidget).setStyle(style);

  let dropzone = null;
  let map = null;
  let draggable = null;

  switch (type) {
    case WidgetType.map:
      (element as Map).setAttribute('apiKey', window.process.env.MAPS_API_KEY);

      // We wrap the map with a div and give it a height and width of a 100%.
      const wrapper = document.createElement('div');
      wrapper.style.width = element.style.width;
      wrapper.style.height = element.style.height;

      (element as Map).setStyle({
        height: '100%',
        width: '100%',
      });

      wrapper.appendChild(element);

      map = element as Map;
      element = wrapper;
      break;
    case WidgetType.panel:
      (element as Panel).editable = editable ?? false;
      if (editable) {
        const dropzoneWidget = new Dropzone();
        dropzoneWidget.classList.add('full-height');
        element.appendChild(dropzoneWidget);
        dropzone = dropzoneWidget;
      }
      break;

    default:
      const draggableWrapper = document.createElement('draggable-widget');
      draggableWrapper.appendChild(element);
      draggableWrapper.editable = true;
      draggable = draggableWrapper;
      break;
  }

  return { element, dropzone, map, draggable };
}
