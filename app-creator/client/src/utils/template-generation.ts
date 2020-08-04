/**
 * @fileoverview This file contains the logic for rendering a template given its corresponding JSON string. It is used
 * whenever we want to display a new template on the story-board.
 */
import { AppCreatorStore, WidgetMetaData } from '../redux/reducer';
import { ROOT_ID } from './constants';
import { store } from '../redux/store';
import { setSelectedTemplate } from '../redux/actions';
import { Dropzone } from '../widgets/dropzone-widget/dropzone-widget';
import { DraggableWidget } from '../widgets/draggable-widget/draggable-widget';
import { getWidgetType } from './helpers';
import { EEWidget } from '../redux/types/types';
import { WidgetType } from '../redux/types/enums';
import { Panel } from '../widgets/ui-panel/ui-panel';
import { Map } from '../widgets/ui-map/ui-map';
import { SideMenu } from '../widgets/ui-sidemenu/ui-sidemenu';
import '../widgets/ui-sidemenu/ui-sidemenu';

/**
 * Builds a DOM tree given a template JSON and renders it in the provided HTML node.
 */
export function generateUI(
  template: AppCreatorStore['template'],
  node: HTMLElement
) {
  const templateCopy = Object.assign({}, template);

  // Recursively creates ui widgets and returns the root of the tree.
  function getWidgetTree(widgetData: WidgetMetaData): HTMLElement {
    const { id, children } = widgetData;
    const { element, dropzone, map, draggable } = getWidgetElement(widgetData);

    for (const childID of children) {
      if (dropzone != null) {
        dropzone.appendChild(getWidgetTree(templateCopy.widgets[childID]));
      } else {
        element.appendChild(getWidgetTree(templateCopy.widgets[childID]));
      }
    }

    templateCopy.widgets[id].widgetRef = map ?? element;

    return draggable ?? element;
  }

  // The root of the template will always have an id of panel-template-0
  const root = templateCopy.widgets[ROOT_ID];

  node.appendChild(getWidgetTree(root));

  // Replace the store's template with the one that include the widgetRefs.
  store.dispatch(setSelectedTemplate(templateCopy));
}

/**
 * Returns the corresponding ui widget for each widget type.
 */
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
  const type = getWidgetType(id);

  // Create DOM element.
  let element = document.createElement(`ui-${type}`);
  element.id = id;

  // Set Unique attributes.
  for (const attribute in uniqueAttributes) {
    element.setAttribute(attribute, uniqueAttributes[attribute]);
  }

  // Set styles.
  if ('setStyle' in (element as EEWidget)) {
    (element as EEWidget).setStyle(style);
  }

  let dropzone = null;
  let map = null;
  let draggable = null;

  switch (type) {
    case WidgetType.map:
      // We wrap the map with a div and give it a height and width of a 100%.
      const wrapper = document.createElement('div');
      wrapper.style.width = element.style.width;
      wrapper.style.height = element.style.height;

      if ((element as Map).setStyle && (element as Map).setAttribute) {
        const mapElement = element as Map;
        mapElement.setAttribute('apiKey', window.process.env.MAPS_API_KEY);
        mapElement.setStyle({
          height: '100%',
          width: '100%',
        });
        wrapper.appendChild(mapElement);
        map = mapElement;
      }

      element = wrapper;
      break;
    case WidgetType.panel:
    case WidgetType.sidemenu:
      if ((element as Panel).editable) {
        (element as Panel).editable = !!editable;
      }

      if ((element as SideMenu).editable) {
        (element as SideMenu).editable = !!editable;
      }

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
