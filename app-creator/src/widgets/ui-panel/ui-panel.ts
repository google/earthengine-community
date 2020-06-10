/**
 *  @fileoverview The ui-panel widget lets users add a panel to their templates. Panels
 *  are essentially containers that can align their children vertically, horizontally, and in a grid.
 */
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { classMap } from 'lit-html/directives/class-map';
import '../dropzone-widget/dropzone-widget';

@customElement('ui-panel')
export class Panel extends LitElement {
  static styles = css`
    #container {
      display: flex;
      flex-wrap: wrap;
      min-height: 100px;
      min-width: 50px;
      padding: var(--extra-tight);
      margin: var(--extra-tight);
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

    dropzone-widget {
      width: 100%;
    }
  `;

  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = {};

  /**
   * Sets the flex direction of child widgets.
   * Options available are 'column' and 'row'.
   * column direction will append widgets below the last child element.
   * row direction will append widgets to the right of the last child element.
   */
  @property({ type: String }) direction = 'column';

  /**
   * Adds a border and shadow to panel.
   */
  @property({ type: Boolean }) isRaised = false;

  render() {
    const { isRaised, styles } = this;
    return html`
      <div
        id="container"
        class="${classMap({ raised: isRaised })}"
        style="${styleMap(styles)}"
      >
        <dropzone-widget></dropzone-widget>
      </div>
    `;
  }

  getDirection() {
    return this.direction;
  }

  getStyle(): object {
    return this.styles;
  }

  setStyle(style: { [key: string]: string }) {
    this.styles = style;
  }
}
