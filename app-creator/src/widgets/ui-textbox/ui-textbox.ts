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

  @property({ type: Object }) styles = {};

  @property({ type: String }) label = '';

  @property({ type: Boolean }) alwaysFloatLabel = true;

  render() {
    const { label, styles, alwaysFloatLabel } = this;
    return html`
      <paper-input
        style=${styleMap(styles)}
        ?always-float-label=${alwaysFloatLabel}
        label="${label}"
      ></paper-input>
    `;
  }

  getAlwaysFloatLabel() {
    return this.alwaysFloatLabel;
  }

  getLabel() {
    return this.label;
  }

  getStyle(): object {
    return this.styles;
  }
}
