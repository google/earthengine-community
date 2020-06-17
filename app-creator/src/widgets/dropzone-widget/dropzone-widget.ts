/**
 *  @fileoverview The dropzone-widget lets users add widgets to the current container.
 */
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import '@polymer/iron-icon/iron-icon.js';
import { DraggableWidget } from '../draggable-widget/draggable-widget';
import '../empty-notice/empty-notice';
import { EMPTY_NOTICE_ID } from '../empty-notice/empty-notice';
import { store } from '../../redux/store';
import {
  setElementAdded,
  setReordering,
  addWidgetMetaData,
  removeWidgetMetaData,
} from '../../redux/actions';
import { EventType } from '../../redux/types/enums';

export const CONTAINER_ID = 'container';

@customElement('dropzone-widget')
export class Dropzone extends LitElement {
  static styles = css`
    #container {
      padding: var(--extra-tight) var(--tight);
      margin: var(--extra-tight);
      border: var(--light-dashed-border);
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow-y: scroll;
      height: calc(100% - 2 * var(--tight));
    }

    p {
      margin: 0px;
      margin-top: var(--tight);
      font-size: 0.8rem;
    }

    #empty-notice-icon {
      color: var(--border-gray);
    }

    #empty-notice-text {
      color: var(--border-gray);
    }

    #empty-notice {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .full-width {
      width: 100%;
    }
  `;

  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = {};

  render() {
    const { styles, handleDragOver, handleDragenter, handleDrageleave } = this;

    return html`
      <div
        id="${CONTAINER_ID}"
        @dragenter=${handleDragenter}
        @dragleave=${handleDrageleave}
        @dragover=${handleDragOver}
        style="${styleMap(styles)}"
      >
        <empty-notice
          id="${EMPTY_NOTICE_ID}"
          icon="icons:system-update-alt"
          message="Drop widgets here"
        ></empty-notice>
      </div>
    `;
  }

  /**
   * Places the dragging widget in the correct order in the container.
   */
  handleReorderingWidget(
    container: Element,
    widget: Element,
    nextElement: Element | null
  ) {
    if (nextElement == null) {
      container.appendChild(widget);
    } else {
      container.insertBefore(widget, nextElement);
    }
    // set the global reordering state to true so we know that we don't increment the current widget id
    if (store.getState().eventType !== EventType.reordering) {
      store.dispatch(setReordering(true));
    }
    return;
  }

  /**
   * Places a clone of the dragging widget in the correct order in the container.
   */
  handleAddingWidget(
    container: Element,
    widget: Element,
    nextElement: Element | null
  ) {
    // Making clone with new id.
    const clone = widget.cloneNode(true) as HTMLElement;
    clone.id += `-${store.getState().widgetIDs[widget.id]}`;

    // Check if the element already exists.
    // This is necessary because the event is fired multiple times consecutively.
    const element = this.shadowRoot?.getElementById(`${clone.id}-wrapper`);
    if (element != null) {
      container.removeChild(element);
      store.dispatch(removeWidgetMetaData(clone.id));
    }

    // The cloned widget is not wrapped with a draggable widget so we have to create one below.
    const cloneDraggableWrapper = this.wrapDraggableWidget(clone);

    if (nextElement == null) {
      container.appendChild(cloneDraggableWrapper);
    } else {
      container.insertBefore(cloneDraggableWrapper, nextElement);
    }

    // We use this to correctly increment the widget id.
    if (store.getState().eventType !== EventType.adding) {
      store.dispatch(setElementAdded(true));
    }

    store.dispatch(addWidgetMetaData(clone.id, clone));
  }

  /**
   * Callback triggered whenever we drag a widget over a dropzone-widget.
   */
  handleDragOver(e: DragEvent) {
    // Get container element.
    let container = this.shadowRoot?.getElementById(CONTAINER_ID);
    if (container == null) {
      return;
    }

    // Get widget that's currently being dragged.
    const widget = store.getState().draggingElement;

    const widgetWrapper = widget?.parentElement;
    if (widget == null || widgetWrapper == null) {
      return;
    }

    // Get next element.
    const nextElement = this.getNextElement(widget, e.clientY);

    // In case we are reordering an element, we want to move the actual element rather than creating a clone.
    const isReordering = (widgetWrapper as DraggableWidget).editable;

    if (isReordering) {
      this.handleReorderingWidget(container, widgetWrapper, nextElement);
    } else {
      this.handleAddingWidget(container, widget, nextElement);
    }
  }

  /**
   * Hides empty notice content by changing display property from 'flex' to 'none'.
   */
  hideEmptyNotice() {
    const emptyNotice = this.shadowRoot?.getElementById(EMPTY_NOTICE_ID);
    if (emptyNotice == null) {
      return;
    }

    emptyNotice.style.display = 'none';
  }

  /**
   * Takes in a cloned element and returns that element with a draggable wrapper around it.
   * @param clone element to be wrapped.
   */
  wrapDraggableWidget(clone: HTMLElement): DraggableWidget {
    const cloneDraggableWrapper = document.createElement('draggable-widget');
    cloneDraggableWrapper.editable = true;
    cloneDraggableWrapper.style.width = '100%';
    cloneDraggableWrapper.id = `${clone.id}-wrapper`;
    cloneDraggableWrapper.appendChild(clone);
    return cloneDraggableWrapper;
  }

  /**
   * Returns the next closest widget to the one being dragged, or null if there are no widgets after.
   * @param widget widget currently being dragged.
   * @param y the y coordinate of the triggered event.
   */
  getNextElement(widget: Element, y: number): Element | null {
    const container = this.shadowRoot?.getElementById(CONTAINER_ID);
    if (container == null) {
      return null;
    }

    /**
     * Get all widgets in the container excluding the currently dragged widget.
     * The direct children of the container are the widget wrappers that allow them to be
     * draggable so we exclude the wrapper of the current widget.
     */
    const children = Array.from(container.children).filter(
      (child) =>
        child.id !==
        `${widget.id}-${store.getState().widgetIDs[widget.id]}-wrapper`
    );

    const closest = children.reduce(
      (closest: { diff: number; element: Element | null }, child) => {
        const rect = child.getBoundingClientRect();
        const diff = y - rect.top - rect.height / 2;
        if (diff < 0 && diff > closest.diff) {
          return { diff, element: child };
        } else {
          return closest;
        }
      },
      {
        diff: Number.NEGATIVE_INFINITY,
        element: null,
      }
    );

    return closest.element;
  }

  /**
   * Highlights dropzone border on drag enter and modifies flex alignment.
   */
  handleDragenter(e: Event) {
    // Return early if dragenter is called on child widget.
    if ((e.target as HTMLElement).id !== CONTAINER_ID) {
      return;
    }

    // Add highlight to container widget and change flex alignment.
    const container = this.shadowRoot?.getElementById(CONTAINER_ID);
    if (container == null) {
      return;
    }

    // We hide the empty notice if it exists.
    this.hideEmptyNotice();

    // Highlight border and change alignment.
    container.style.borderColor = 'var(--accent-color)';
    container.style.alignItems = 'flex-start';
    container.style.justifyContent = 'flex-start';
  }

  /**
   * Removes highlighted border on dragleave.
   */
  handleDrageleave(e: Event) {
    // return early if dragleave is called on child widget
    if ((e.target as HTMLElement).id !== CONTAINER_ID) {
      return;
    }

    // Remove highlight from container widget.
    const container = this.shadowRoot?.getElementById(CONTAINER_ID);
    if (container == null) {
      return;
    }

    container.style.borderColor = 'var(--border-gray)';
  }

  getStyle(): object {
    return this.styles;
  }
}
