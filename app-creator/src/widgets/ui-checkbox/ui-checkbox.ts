/**
 *  @fileoverview The ui-checkbox widget lets users add a checkbox component to their templates.
 */
import '@polymer/paper-checkbox/paper-checkbox.js';
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';

@customElement('ui-checkbox')
export class Checkbox extends LitElement {
  static styles = css`
    paper-checkbox {
      margin: var(--tight);
    }
  `;

  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = {};

  /**
   * Sets checkbox label.
   */
  @property({ type: String }) label = '';

  /**
   * If true, the user cannot interact with this element.
   */
  @property({ type: Boolean }) disabled = false;

  /**
   * If true, checkbox displays a checkmark.
   */
  @property({ type: Boolean })
  checked = false;

  render() {
    const { label, styles, checked, disabled } = this;
    return html`
      <paper-checkbox
        style=${styleMap(styles)}
        ?checked=${checked}
        ?disabled=${disabled}
        noink
      >
        ${label}
      </paper-checkbox>
    `;
  }

  getChecked() {
    return this.checked;
  }

  getDisabled(): boolean {
    return this.disabled;
  }

  getStyle(): object {
    return this.styles;
  }
}
