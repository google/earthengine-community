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
      margin: 0px var(--tight);
      width: 90%;
    }
  `;

  /**
   * Additional custom styles.
   */
  @property({ type: Object }) styles = {};

  /**
   * Value of input.
   */
  @property({ type: String }) value = '';

  /**
   * Sets textbox label.
   */
  @property({ type: String }) label = '';

  /**
   * Type of input.
   */
  @property({ type: String }) type = 'text';

  /**
   * Handler for keyup events.
   */
  @property({ type: Object })
  onKeyupChangeHandler: (e: Event) => void = () => {};

  /**
   * Handler for change events.
   */
  @property({ type: Object })
  onChangeHandler: (e: Event) => void = () => {};

  render() {
    const {
      label,
      type,
      value,
      onKeyupChangeHandler,
      onChangeHandler,
      styles,
    } = this;
    return html`
      <paper-input
        style=${styleMap(styles)}
        label="${label}"
        value=${value}
        type=${type}
        @keyup=${onKeyupChangeHandler}
        @change=${onChangeHandler}
        no-float-label
      ></paper-input>
    `;
  }

  getLabel() {
    return this.label;
  }

  getStyle(): object {
    return this.styles;
  }
}
