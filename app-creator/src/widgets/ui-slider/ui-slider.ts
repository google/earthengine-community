/**
 *  @fileoverview The ui-slider widget lets users add a slider component to their template.
 */
import '@polymer/paper-slider/paper-slider.js';
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import {
  DEFAULT_SHARED_ATTRIBUTES,
  AttributeMetaData,
  DefaultAttributesType,
  getDefaultAttributes,
} from '../../redux/types/attributes';
import { InputType } from '../../redux/types/enums';

@customElement('ui-slider')
export class Slider extends LitElement {
  static styles = css`
    paper-slider {
      width: 150px;
    }
  `;

  static attributes: AttributeMetaData = {
    min: {
      value: '0',
      placeholder: '0',
      type: InputType.number,
    },
    max: {
      value: '100',
      placeholder: '100',
      type: InputType.number,
    },
    value: {
      value: '50',
      placeholder: '50',
      type: InputType.number,
    },
    step: {
      value: '5',
      placeholder: '5',
      type: InputType.number,
    },
    direction: {
      value: 'horizontal',
      type: InputType.select,
      items: ['horizontal', 'vertical'],
    },
    disabled: {
      value: 'false',
      type: InputType.select,
      items: ['true', 'false'],
    },
  };

  static DEFAULT_SLIDER_ATTRIBUTES: DefaultAttributesType = getDefaultAttributes(
    Slider.attributes
  );

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
    let safeValue = value.trim().replace('px', '');
    if (safeValue === '') {
      safeValue = '0';
    }
    switch (key) {
      case 'value':
        this.value = parseInt(safeValue);
        break;
      case 'max':
        this.max = parseInt(safeValue);
        break;
      case 'min':
        this.min = parseInt(safeValue);
        break;
      case 'editable':
        this.editable = safeValue === 'true';
        break;
      case 'disabled':
        this.disabled = safeValue === 'true';
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
