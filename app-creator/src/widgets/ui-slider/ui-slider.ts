/**
 *  @fileoverview The ui-slider widget lets users add a slider component to their template.
 */
import '@polymer/paper-slider/paper-slider.js';
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';

@customElement('ui-slider')
export class Slider extends LitElement {
  static styles = css``;

  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = {};

  /**
   * Sets slider value.
   */
  @property({ type: Number }) value = 50;

  /**
   * If true, the user cannot interact with this element.
   */
  @property({ type: Boolean }) disabled = false;

  /**
   * Sets maximum slider value.
   */
  @property({ type: Number }) max = 100;

  /**
   * Displays input field next to slider for editing.
   */
  @property({ type: Boolean }) editable = false;

  render() {
    const { value, max, editable, styles } = this;
    return html`
      <paper-slider
        style=${styleMap(styles)}
        value=${value}
        max=${max}
        ?editable=${editable}
      >
      </paper-slider>
    `;
  }

  getValue() {
    return this.value;
  }

  getMax() {
    return this.max;
  }

  getDisabled(): boolean {
    return this.disabled;
  }

  getStyle(): object {
    return this.styles;
  }
}
