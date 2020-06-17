/**
 *  @fileoverview The ui-panel widget lets users add a panel to their templates. Panels
 *  are essentially containers that can align their children vertically, horizontally, and in a grid.
 */
import { css, customElement, html, LitElement, property } from 'lit-element';
import '../dropzone-widget/dropzone-widget';
import { nothing } from 'lit-html';
import { store } from '../../redux/store';
import { setEditingWidget } from '../../redux/actions';

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
      min-height: 100px;
      min-width: 50px;
      height: 100%;
      width: 100%;
      position: relative;
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

    #editable-view {
      position: absolute;
      top: 0;
      right: 0;
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
   * Adds edit icon to panel.
   */
  @property({ type: Boolean }) editable = false;

  render() {
    const { isRaised, editable, layout, padded, handleEditWidget } = this;

    const editableMarkup = editable
      ? html`
          <div id="editable-view">
            <iron-icon
              class="edit-buttons"
              icon="create"
              @click=${handleEditWidget}
            ></iron-icon>
          </div>
        `
      : nothing;

    return html`
      <div
        id="container"
        class="${layout} ${isRaised ? 'raised' : ''} ${padded ? 'padded' : ''}"
      >
        <slot></slot>
        ${editableMarkup}
      </div>
    `;
  }

  /**
   * Triggered when the edit icon is clicked. Stores a reference of the selected element in the store and
   * displays a set of inputs for editing its attributes.
   */
  handleEditWidget() {
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
