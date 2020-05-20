/**
 *  @fileoverview The ui-textbox widget lets users add user input to their templates
 */
import '@polymer/paper-input/paper-input.js';
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';

@customElement('ui-textbox')
export class Textbox extends LitElement {
  static styles = css`
    paper-input {
      margin: var(--tight);
    }
  `;

  /**
   * Additional custom styles.
   */
  @property({ type: Object }) styles = {};

  /**
   * Sets textbox label.
   */
  @property({ type: String }) label = '';

  render() {
    const { label, styles } = this;
    return html`
      <paper-input style=${styleMap(styles)} label="${label}"></paper-input>
    `;
  }

  getLabel() {
    return this.label;
  }

  getStyle(): object {
    return this.styles;
  }
}
