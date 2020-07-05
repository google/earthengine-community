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
  updateWidgetChildren,
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
      height: 100%;
      width: 100%;
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
    const { styles, handleDragOver } = this;
    return html`
      <slot
        id="${CONTAINER_ID}"
        @dragover=${handleDragOver}
        style="${styleMap(styles)}"
      >
        <empty-notice
          id="${EMPTY_NOTICE_ID}"
          icon="icons:system-update-alt"
          message="Drop widgets here"
        ></empty-notice>
      </slot>
    `;
  }

  /**
   * Takes in an html element (usually a dropzone) and returns the children ids without the empty-notice.
   */
  getChildrenIds(): string[] {
    // We slice the first child because it is always the empty notice.
    return Array.from(this.children).map((el) => {
      return el.firstElementChild!.id;
    });
  }

  /**
   * Places the dragging widget in the correct order in the container.
   */
  handleReorderingWidget(
    parent: Element | null,
    widget: Element,
    nextElement: Element | null
  ) {
    if (nextElement == null) {
      this.appendChild(widget);
    } else {
      this.insertBefore(widget, nextElement);
    }

    // Update children ordering in store.
    const ids = this.getChildrenIds();
    if (parent != null) {
      store.dispatch(updateWidgetChildren(parent.id, ids));
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
    parent: Element | null,
    widget: Element,
    nextElement: Element | null
  ) {
    // Making clone with new id.
    const clone = widget.cloneNode(true) as HTMLElement;
    clone.id += `-${store.getState().widgetIDs[widget.id]}`;

    // Return early if the widget has been added to another panel earlier.
    const template = store.getState().template;
    for (const id in template) {
      if (
        typeof template[id] === 'object' &&
        !Array.isArray(template[id]) &&
        id !== parent!.id &&
        template[id].children.includes(clone.id)
      ) {
        return;
      }
    }

    // Check if the element already exists.
    // This is necessary because the event is fired multiple times consecutively.
    const element = this.querySelector(`#${clone.id}-wrapper`);
    if (element != null) {
      this.removeChild(element);
      store.dispatch(removeWidgetMetaData(clone.id));
    }

    // The cloned widget is not wrapped with a draggable widget so we have to create one below.
    const cloneDraggableWrapper = this.wrapDraggableWidget(clone);

    if (nextElement == null) {
      this.appendChild(cloneDraggableWrapper);
    } else {
      this.insertBefore(cloneDraggableWrapper, nextElement);
    }

    // Update widget ordering in store.
    const ids = this.getChildrenIds();
    if (parent != null) {
      store.dispatch(updateWidgetChildren(parent.id, ids));
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
    // Get widget that's currently being dragged.
    const widget = store.getState().draggingElement;

    const widgetWrapper = widget?.parentElement;
    if (widget == null || widgetWrapper == null) {
      return;
    }

    // Remove widget id if it already exists. This case will occur when we are dragging a widget
    // from one panel to another.
    store.dispatch(removeWidgetMetaData(widget.id, true));

    // Get next element.
    const nextElement = this.getNextElement(widget, e.clientY);

    // In case we are reordering an element, we want to move the actual element rather than creating a clone.
    const isReordering = (widgetWrapper as DraggableWidget).editable;

    if (isReordering) {
      this.handleReorderingWidget(
        this.parentElement,
        widgetWrapper,
        nextElement
      );
    } else {
      this.handleAddingWidget(this.parentElement, widget, nextElement);
    }
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
    /**
     * Get all widgets in the container excluding the currently dragged widget.
     * The direct children of the container are the widget wrappers that allow them to be
     * draggable so we exclude the wrapper of the current widget.
     */
    const children = Array.from(this.children).filter(
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
   * Set individual style properties on the dropzone.
   */
  setStyleProperty(property: string, value: string): void {
    const container = this.shadowRoot?.getElementById(CONTAINER_ID);
    if (container != null) {
      container.style[property as any] = value;
    }
  }

  getStyle(): object {
    return this.styles;
  }
}
