/**
 *  @fileoverview The ui-panel widget lets users add a panel to their templates. Panels
 *  are essentially containers that can align their children vertically, horizontally, and in a grid.
 */
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import '../dropzone-widget/dropzone-widget';
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
      min-height: 100px;
      min-width: 50px;
      height: 100%;
      width: 100%;
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

  addWidget(widget: HTMLElement) {
    const container = this.shadowRoot?.getElementById(CONTAINER_ID);
    if (container != null) {
      container.appendChild(widget);
    }
  }

  render() {
    const { isRaised, layout, padded, styles } = this;

    // const content = hasDropzone
    //   ? html`<dropzone-widget class="full-size"><slot></slot></dropzone-widget>`
    //   : html`<slot></slot>`;

    return html`
      <div
        id="container"
        class="${layout} ${isRaised ? 'raised' : ''} ${padded ? 'padded' : ''}"
        style="${styleMap(styles)}"
      >
        <slot></slot>
      </div>
    `;
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
    this.styles = style;
    this.requestUpdate();
  }
}
