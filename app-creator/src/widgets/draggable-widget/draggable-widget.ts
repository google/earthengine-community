/**
 *  @fileoverview The draggable-widget wraps other widgets to make them draggable.
 */
import { LitElement, html, customElement, css, property } from 'lit-element';
import { nothing } from 'lit-html';
import '../tab-container/tab-container';
import '@polymer/iron-icons/editor-icons.js';
import { store } from '../../store';

@customElement('draggable-widget')
export class DraggableWidget extends LitElement {
  /**
   * Additional custom styles.
   */
  static styles = css`
    #container {
      border: var(--light-dashed-border);
      border-radius: var(--tight);
      width: 100%;
      margin: var(--tight) 0px;
      position: relative;
      cursor: move;
    }

    .overlay {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    #editable-view {
      position: absolute;
      top: var(--extra-tight);
      right: var(--extra-tight);
      display: flex;
      justify-content: flex-end;
      width: 100%;
    }

    .edit-buttons {
      background-color: white;
      border: var(--light-border);
      border-radius: var(--extra-tight);
      margin-left: var(--extra-tight);
      cursor: pointer;
    }

    .edit-buttons:hover {
      background-color: lightgray;
    }
  `;

  /**
   * Determines if widget should have a draggable overlay.
   */
  @property({ type: Boolean })
  hasOverlay = true;

  /**
   * Adds edit and trash actions to draggable widget.
   */
  @property({ type: Boolean })
  editable = false;

  render() {
    const {
      editable,
      hasOverlay,
      handleDragstart,
      handleDragend,
      handleRemoveWidget,
    } = this;

    const overlay = hasOverlay ? html`<div class="overlay"></div>` : nothing;

    const editableMarkup = editable
      ? html`
          <div id="editable-view">
            <iron-icon class="edit-buttons" icon="create"></iron-icon>
            <iron-icon
              class="edit-buttons"
              icon="icons:delete"
              @click=${handleRemoveWidget}
            ></iron-icon>
          </div>
        `
      : nothing;

    return html`
      <div
        id="container"
        draggable="true"
        @dragstart=${handleDragstart}
        @dragend=${handleDragend}
      >
        <slot></slot>
        ${overlay} ${editableMarkup}
      </div>
    `;
  }

  handleRemoveWidget() {
    const parent = this.parentElement;
    if (parent == null) {
      return;
    }

    parent.removeChild(this);

    const childrenCount = parent.childElementCount;

    if (childrenCount === 1) {
      const placeholder = parent.querySelector(
        '#empty-placeholder'
      ) as HTMLElement;
      if (placeholder == null) {
        return;
      }
      placeholder.style.display = 'flex';
      parent.style.alignItems = 'center';
    }
  }

  handleDragstart(e: Event) {
    const target = e.target as HTMLDivElement;
    if (target == null) {
      return;
    }

    const widget = target?.querySelector('slot')?.assignedElements()[0];
    if (widget == null) {
      return;
    }

    store.draggingElement = widget;
  }

  handleDragend(e: Event) {
    const target = e.target as HTMLDivElement;
    if (target == null) {
      return;
    }

    const draggingElement = store.draggingElement;
    if (draggingElement == null) {
      return;
    }

    if (store.elementAdded && !store.reordering) {
      store.widgetIDs[draggingElement.id]++;
    }

    store.draggingElement = null;
    store.reordering = false;
    store.elementAdded = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'draggable-widget': DraggableWidget;
  }
}
