/**
 *  @fileoverview The dropzone-widget lets users add widgets to the current container.
 */
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import '@polymer/iron-icon/iron-icon.js';
import { store } from '../../store';
import { DraggableWidget } from '../draggable-widget/draggable-widget';

@customElement('dropzone-widget')
export class Dropzone extends LitElement {
  static styles = css`
    #container {
      padding: var(--tight);
      border: var(--light-dashed-border);
      width: calc(100% - 2 * var(--tight));
      height: calc(100% - 2 * var(--tight));
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1;
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

  /**
   * Callback triggered on input change.
   */
  @property({ type: Object })
  debouncedDragOver: (e: Event) => void = () => {};

  render() {
    const { styles, handleDragOver, handleDragenter, handleDrageleave } = this;

    const emptyPlaceholder = html`
      <div id="empty-placeholder">
        <iron-icon
          id="empty-placeholder-icon"
          icon="icons:system-update-alt"
        ></iron-icon>
        <p id="empty-placeholder-text">Drop widgets here</p>
      </div>
    `;

    return html`
      <div
        id="container"
        @dragenter=${handleDragenter}
        @dragleave=${handleDrageleave}
        @dragover=${handleDragOver}
        style="${styleMap(styles)}"
      >
        ${emptyPlaceholder}
      </div>
    `;
  }

  handleDragOver(e: DragEvent) {
    // get container element
    const container = this.shadowRoot?.getElementById('container');
    if (container == null) {
      return;
    }

    // get widget that's currently being dragged
    const widget = store.draggingElement as HTMLElement;
    const widgetWrapper = widget.parentElement;
    if (widget == null || widgetWrapper == null) {
      return;
    }

    // get next element
    const nextElement = this.getNextElement(widget, e.clientY);

    const reordering = (widgetWrapper as DraggableWidget).editable;
    if (reordering) {
      if (nextElement == null) {
        container.appendChild(widgetWrapper);
      } else {
        container.insertBefore(widgetWrapper, nextElement);
      }
      return;
    }

    // making clone with new id
    const clone = widget.cloneNode(true) as HTMLElement;
    clone.id += `-${store.widgetIDs[widget.id]}`;

    // check if the element already exists
    // this is necessary because the event is fired multiple times consecutively
    const element = this.shadowRoot?.getElementById(`${clone.id}-wrapper`);
    if (element != null) {
      container.removeChild(element);
    }

    const cloneDraggableWrapper = document.createElement('draggable-widget');
    cloneDraggableWrapper.editable = true;
    cloneDraggableWrapper.style.width = '100%';
    cloneDraggableWrapper.id = `${clone.id}-wrapper`;
    cloneDraggableWrapper.appendChild(clone);

    if (nextElement == null) {
      container.appendChild(cloneDraggableWrapper);
    } else {
      container.insertBefore(cloneDraggableWrapper, nextElement);
    }

    store.elementAdded = true;

    const placeholder = this.shadowRoot?.getElementById('empty-placeholder');
    if (placeholder == null) {
      return;
    }

    placeholder.style.display = 'none';
  }

  getNextElement(widget: HTMLElement, y: number): Element | null {
    const container = this.shadowRoot?.getElementById('container');
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

  handleDragenter() {
    const container = this.shadowRoot?.getElementById('container');
    if (container == null) {
      return;
    }
    container.style.borderColor = 'var(--accent-color)';
    container.style.alignItems = 'flex-start';
  }

  handleDrageleave() {
    const container = this.shadowRoot?.getElementById('container');
    if (container == null) {
      return;
    }
    container.style.borderColor = 'var(--border-gray)';
  }

  getStyle(): object {
    return this.styles;
  }
}
