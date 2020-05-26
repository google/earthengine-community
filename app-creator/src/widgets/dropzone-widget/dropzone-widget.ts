/**
 *  @fileoverview The dropzone-widget lets users add widgets to the current container.
 */
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import '@polymer/iron-icon/iron-icon.js';
import { store } from '../../store';
import {
  DraggableWidget,
  PLACEHOLDER_ID,
} from '../draggable-widget/draggable-widget';

const CONTAINER_ID = 'container';

@customElement('dropzone-widget')
export class Dropzone extends LitElement {
  static styles = css`
    #container {
      padding: var(--extra-tight) var(--tight);
      border: var(--light-dashed-border);
      width: calc(100% - 2 * var(--tight));
      height: calc(100% - 2 * var(--extra-tight));
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow-y: scroll;
    }

    p {
      margin: 0px;
      margin-top: var(--tight);
      font-size: 0.8rem;
    }

    #empty-placeholder-icon {
      color: var(--border-gray);
    }

    #empty-placeholder-text {
      color: var(--border-gray);
    }

    #empty-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
  `;

  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = {};

  render() {
    const { styles, handleDragOver, handleDragenter, handleDrageleave } = this;

    const emptyPlaceholder = html`
      <div id="${PLACEHOLDER_ID}">
        <iron-icon
          id="${PLACEHOLDER_ID}-icon"
          icon="icons:system-update-alt"
        ></iron-icon>
        <p id="${PLACEHOLDER_ID}-text">Drop widgets here</p>
      </div>
    `;

    return html`
      <div
        id="${CONTAINER_ID}"
        @dragenter=${handleDragenter}
        @dragleave=${handleDrageleave}
        @dragover=${handleDragOver}
        style="${styleMap(styles)}"
      >
        ${emptyPlaceholder}
      </div>
    `;
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
    const widget = store.draggingElement as HTMLElement;
    const widgetWrapper = widget.parentElement;
    if (widget == null || widgetWrapper == null) {
      return;
    }

    // Get next element.
    const nextElement = this.getNextElement(widget, e.clientY);

    // In case we are reordering an element, we want to move the actual element rather than creating a clone.
    const reordering = (widgetWrapper as DraggableWidget).editable;
    if (reordering) {
      if (nextElement == null) {
        container.appendChild(widgetWrapper);
      } else {
        container.insertBefore(widgetWrapper, nextElement);
      }
      return;
    }

    // Making clone with new id.
    const clone = widget.cloneNode(true) as HTMLElement;
    clone.id += `-${store.widgetIDs[widget.id]}`;

    // Check if the element already exists.
    // This is necessary because the event is fired multiple times consecutively.
    const element = this.shadowRoot?.getElementById(`${clone.id}-wrapper`);
    if (element != null) {
      container.removeChild(element);
    }

    // The cloned widget is not wrapped with a draggable widget so we have to create one below.
    const cloneDraggableWrapper = this.wrapDraggableWidget(clone);

    if (nextElement == null) {
      container.appendChild(cloneDraggableWrapper);
    } else {
      container.insertBefore(cloneDraggableWrapper, nextElement);
    }

    // We use this to correctly increment the widget id.
    store.elementAdded = true;

    // We hide the placeholder if it exists.
    this.hidePlaceholder();
  }

  /**
   * Hides placeholder content by changing display property from 'flex' to 'none'.
   */
  hidePlaceholder() {
    const placeholder = this.shadowRoot?.getElementById(PLACEHOLDER_ID);
    if (placeholder == null) {
      return;
    }

    placeholder.style.display = 'none';
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
  getNextElement(widget: HTMLElement, y: number): Element | null {
    const container = this.shadowRoot?.getElementById(CONTAINER_ID);
    if (container == null) {
      return null;
    }

    const children = Array.from(container.children).filter(
      (child) =>
        child.id !== `${widget.id}-${store.widgetIDs[widget.id]}-wrapper`
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
