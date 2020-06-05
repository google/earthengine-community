/**
 *  @fileoverview The ui-slider widget lets users add a slider component to their template.
 */
import '@polymer/paper-slider/paper-slider.js';
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { DEFAULT_SHARED_ATTRIBUTES } from '../../redux/types/attributes';

@customElement('ui-slider')
export class Slider extends LitElement {
  static styles = css``;

  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = DEFAULT_SHARED_ATTRIBUTES;

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
   * Sets minimum slider value.
   */
  @property({ type: Number }) min = 0;

  /**
   * Displays input field next to slider for editing.
   */
  @property({ type: Boolean }) editable = true;

  render() {
    const { value, max, min, editable, disabled, styles } = this;
    return html`
      <paper-slider
        style=${styleMap(styles)}
        value=${value}
        max=${max}
        min=${min}
        ?disabled=${disabled}
        ?editable=${editable}
      >
      </paper-slider>
    `;
  }

  setAttribute(key: string, value: string) {
    switch (key) {
      case 'value':
        this.value = parseInt(value);
        break;
      case 'max':
        this.max = parseInt(value);
        break;
      case 'min':
        this.min = parseInt(value);
        break;
      case 'editable':
        this.editable = value === 'true';
        break;
      case 'disabled':
        this.disabled = value === 'true';
        break;
    }

    this.requestUpdate();
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

  setStyle(style: { [key: string]: string }) {
    this.styles = style;
    this.requestUpdate();
  }
}
