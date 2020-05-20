/**
 *  @fileoverview The ui-panel widget lets users add a panel to their templates. Panels
 *  are essentially containers that can align its children vertically, horizontally, and in a grid.
 */
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';

@customElement('ui-panel')
export class Panel extends LitElement {
  static styles = css`
    #container {
      display: flex;
      flex-wrap: wrap;
      min-height: 50px;
      min-width: 50px;
      padding: var(--tight);
      margin: var(--tight);
    }

    .column {
      flex-direction: column;
    }

    .row {
      flex-direction: row;
    }

    .raised {
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    }
  `;

  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = {};

  /**
   * Sets alignment of children.
   */
  @property({ type: String }) direction = 'column'; // ['column', 'row']

  /**
   * Adds a border and shadow to panel.
   */
  @property({ type: Boolean }) isRaised = false;

  render() {
    const { direction, isRaised, styles } = this;
    const raised = isRaised ? 'raised' : '';
    return html`
      <div
        id="container"
        class="${direction} ${raised}"
        style="${styleMap(styles)}"
      ></div>
    `;
  }

  getDirection() {
    return this.direction;
  }

  getStyle(): object {
    return this.styles;
  }
}
