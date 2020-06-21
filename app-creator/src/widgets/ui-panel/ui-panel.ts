/**
 *  @fileoverview The ui-panel widget lets users add a panel to their templates. Panels
 *  are essentially containers that can align their children vertically, horizontally, and in a grid.
 */
import { css, customElement, html, LitElement, property } from 'lit-element';
import '../dropzone-widget/dropzone-widget';
import { store } from '../../redux/store';
import { setEditingWidget } from '../../redux/actions';
import { DraggableWidget } from '../draggable-widget/draggable-widget';
import { CONTAINER_ID } from '../dropzone-widget/dropzone-widget';

@customElement('ui-panel')
export class Panel extends LitElement {
  constructor(hasDropzone: boolean) {
    super();
    this.hasDropzone = hasDropzone;
  }

  static styles = css`
    #container {
      display: flex;
      flex-wrap: wrap;
      height: 100%;
      width: 100%;
      position: relative;
      cursor: pointer;
    }

    .full-size {
      height: calc(100% - 2 * var(--extra-tight));
      width: calc(100% - 2 * var(--extra-tight));
    }

    .column {
      flex-direction: column;
    }

    .row {
      flex-direction: row;
    }

    .raised {
      box-shadow: var(--raised-shadow);
    }

    .padded {
      padding: var(--extra-tight);
    }

    .edit-buttons {
      background-color: white;
      border: var(--light-border);
      border-radius: var(--extra-tight);
      margin-left: var(--extra-tight);
      cursor: pointer;
    }

    slot {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }
  `;

  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = {};

  /**
   * Sets the flex layout of child widgets.
   * Options available are 'column' and 'row'.
   * column layout will append widgets below the last child element.
   * row layout will append widgets to the right of the last child element.
   */
  @property({ type: String }) layout = 'column';

  /**
   * Adds a border and shadow to panel.
   */
  @property({ type: Boolean }) isRaised = false;

  /**
   * Contains an inner dropzone-widget.
   */
  @property({ type: Boolean }) hasDropzone = false;

  /**
   * Adds padding to panel.
   */
  @property({ type: Boolean }) padded = false;

  /**
   * Sets editable property.
   */
  @property({ type: Boolean }) editable = false;

  connectedCallback() {
    super.connectedCallback();
    this.onclick = this.handleEditWidget;
  }

  render() {
    const { isRaised, layout, padded } = this;

    return html`
      <div
        id="container"
        class="${layout} ${isRaised ? 'raised' : ''} ${padded ? 'padded' : ''}"
      >
        <slot class="${layout}"></slot>
      </div>
    `;
  }

  /**
   * Triggered when the panel is selected. Stores a reference of the selected element in the store and
   * displays a set of inputs for editing its attributes.
   */
  handleEditWidget(e: Event) {
    // Prevent event from reaching the background panel.
    e.stopPropagation();

    // Remove highlight from currently selected widget (if any).
    DraggableWidget.removeEditingWidgetHighlight();

    const dropzone = this.querySelector(
      'dropzone-widget'
    )?.shadowRoot?.querySelector(`#${CONTAINER_ID}`);

    if (dropzone != null) {
      (dropzone as HTMLElement).style.borderColor = 'var(--accent-color)';
    }

    // Check if a widgetRef has been set.
    store.dispatch(setEditingWidget(this));
  }

  setAttribute(key: string, value: string) {
    switch (key) {
      case 'layout':
        this.layout = value;
        return;
      case 'isRaised':
        this.isRaised = value === 'true';
        return;
      case 'hasDropzone':
        this.hasDropzone = value === 'true';
        return;
      case 'padded':
        this.padded = value === 'true';
        return;
    }

    this.requestUpdate();
  }

  getlayout() {
    return this.layout;
  }

  getStyle(): object {
    return this.styles;
  }

  setStyle(style: { [key: string]: string }) {
    for (const attribute in style) {
      this.style[attribute as any] = style[attribute];
    }
    this.requestUpdate();
  }
}
