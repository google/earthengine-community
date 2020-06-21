/**
 *  @fileoverview The draggable-widget wraps other widgets to make them draggable.
 */
import { LitElement, html, customElement, css, property } from 'lit-element';
import { nothing } from 'lit-html';
import { styleMap } from 'lit-html/directives/style-map';
import { EMPTY_NOTICE_ID } from '../empty-notice/empty-notice';
import { CONTAINER_ID, Dropzone } from '../dropzone-widget/dropzone-widget';
import { store } from '../../redux/store';
import '../tab-container/tab-container';
import {
  setEditingWidget,
  setDraggingWidget,
  resetDraggingValues,
  incrementWidgetID,
  removeWidgetMetaData,
} from '../../redux/actions';
import { EventType, WidgetType } from '../../redux/types/enums';
import { getIdPrefix } from '../../utils/helpers';

@customElement('draggable-widget')
export class DraggableWidget extends LitElement {
  static styles = css`
    #container {
      border: var(--light-dashed-border);
      border-radius: var(--tight);
      width: 100%;
      min-height: 30px;
      margin: var(--extra-tight) 0px;
      position: relative;
      cursor: move;
      overflow: hidden;
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
   * Additional custom styles.
   */
  @property({ type: Object })
  styles = {};

  /**
   * Determines if widget should have a draggable overlay.
   */
  @property({ type: Boolean })
  hasOverlay = true;

  /**
   * Adds edit and trash actions to the draggable widget.
   */
  @property({ type: Boolean })
  editable = false;

  /**
   * Sets the editing widget's parent container border color to the default gray color.
   */
  static removeEditingWidgetHighlight() {
    const editingWidget = store.getState().editingElement;

    if (editingWidget == null) {
      return;
    }

    const type = getIdPrefix(editingWidget.id) as WidgetType;

    if (type === WidgetType.panel) {
      const dropzone = editingWidget.querySelector('dropzone-widget');

      if (dropzone != null) {
        (dropzone as Dropzone).setStyleProperty(
          'borderColor',
          'var(--border-gray)'
        );
      }
    } else {
      const editingWidgetParent = editingWidget?.parentElement;
      const editingWidgetParentContainer = editingWidgetParent?.shadowRoot?.getElementById(
        CONTAINER_ID
      );
      if (editingWidgetParentContainer != null) {
        editingWidgetParentContainer.style.borderColor = 'var(--border-gray)';
      }
    }
  }

  render() {
    const {
      editable,
      hasOverlay,
      styles,
      handleDragstart,
      handleDragend,
      handleRemoveWidget,
      handleEditWidget,
    } = this;

    const overlay = hasOverlay ? html`<div class="overlay"></div>` : nothing;

    const editableMarkup = editable
      ? html`
          <div id="editable-view">
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
        style=${styleMap(styles)}
        @click=${handleEditWidget}
        @dragstart=${handleDragstart}
        @dragend=${handleDragend}
      >
        <slot></slot>
        ${overlay} ${editableMarkup}
      </div>
    `;
  }

  /**
   * Triggered when the edit icon is clicked. Stores a reference of the selected element in the store and
   * displays a set of inputs for editing its attributes.
   */
  handleEditWidget(e: Event) {
    e.stopPropagation();
    if (!this.editable) {
      /**
       * Draggable widgets on the left side panel are not editable
       * and thus we need to return early.
       */
      return;
    }

    const container = this.shadowRoot?.getElementById(
      CONTAINER_ID
    ) as HTMLElement;

    const widget = this.extractChildWidget(container);
    if (widget == null) {
      return;
    }

    DraggableWidget.removeEditingWidgetHighlight();

    store.dispatch(setEditingWidget(widget));

    container.style.borderColor = 'var(--accent-color)';
  }

  /**
   * Returns the widget inside the draggable wrapper.
   * @param target draggable wrapper element.
   */
  extractChildWidget(target: HTMLElement): Element | undefined {
    // We want to unwrap the draggable wrapper and only reference the the inner element.
    return target.querySelector('slot')?.assignedElements()[0];
  }

  /**
   * Triggered when the trash icon is clicked. If the widget is the last in the dropzone,
   * we display the empty notice and center the container's flex alignments.
   */
  handleRemoveWidget(e: Event) {
    e.stopPropagation();
    const container = this.shadowRoot?.getElementById(
      CONTAINER_ID
    ) as HTMLElement;

    const widget = this.extractChildWidget(container);
    if (widget == null) {
      return;
    }

    if (widget === store.getState().editingElement) {
      // clearing editing widget state
      store.dispatch(setEditingWidget(null));
    }

    const parent = this.parentElement;
    if (parent == null) {
      return;
    }

    parent.removeChild(this);
    store.dispatch(removeWidgetMetaData(widget.id));

    const childrenCount = parent.childElementCount;

    // We never really remove the empty notice div (we just hide it with display='none').
    // When the children count is 1 after removing a widget, we want to unhide the empty notice.
    if (childrenCount === 1) {
      this.showEmptyNotice(parent);
    }
  }

  /**
   * Callback triggered on the beginning of a drag action. We use it to reference the currently
   * dragged element in a global state.
   * @param e dragstart event
   */
  handleDragstart(e: Event) {
    const target = e.target as DraggableWidget;
    if (target == null) {
      return;
    }

    // We want to unwrap the draggable wrapper and only reference the the inner element.
    const widget = this.extractChildWidget(target);
    if (widget == null) {
      return;
    }

    // Referencing the currently dragged element in global state.
    store.dispatch(setDraggingWidget(widget));
  }

  /**
   * Callback triggered on the end of a drag action. We use it to clear the reference
   * of a currently dragged element and increment a widget id if necessary.
   * This is called when adding a new widget from the side panel and when reordering widgets
   * in a dropzone.
   * @param e dragend event
   */
  handleDragend() {
    const addedElement =
      store.getState().eventType === EventType.adding
        ? store.getState().draggingElement
        : null;

    // We only need to increment the widget id when adding a new widget.
    if (
      store.getState().eventType === EventType.adding &&
      addedElement != null
    ) {
      store.dispatch(incrementWidgetID(addedElement.id));
    }

    store.dispatch(resetDraggingValues());
  }

  /**
   * Displays empty notice by changing display property from 'none' to 'flex'.
   * @param parent: element containing empty notice content
   */
  showEmptyNotice(parent: HTMLElement) {
    const emptyNotice = parent.querySelector(
      `#${EMPTY_NOTICE_ID}`
    ) as HTMLElement;
    if (emptyNotice == null) {
      return;
    }
    emptyNotice.style.display = 'flex';
    parent.style.alignItems = 'center';
    parent.style.justifyContent = 'center';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'draggable-widget': DraggableWidget;
  }
}
