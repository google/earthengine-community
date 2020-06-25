/**
 *  @fileoverview The ui-textbox widget lets users add user input to their templates.
 */
import '@polymer/paper-input/paper-input.js';
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import {
  DEFAULT_SHARED_ATTRIBUTES,
  AttributeMetaData,
  DefaultAttributesType,
  getDefaultAttributes,
} from '../../redux/types/attributes';
import { InputType } from '../../redux/types/enums';

@customElement('ui-textbox')
export class Textbox extends LitElement {
  static styles = css`
    paper-input {
      margin: 0px var(--tight);
      width: 90%;
    }
  `;

  static attributes: AttributeMetaData = {
    value: {
      value: '',
      placeholder: 'Enter value',
      type: InputType.text,
    },
    placeholder: {
      value: 'Enter text',
      placeholder: 'Enter placeholder',
      type: InputType.text,
    },
  };

  static DEFAULT_TEXTBOX_ATTRIBUTES: DefaultAttributesType = getDefaultAttributes(
    Textbox.attributes
  );

  /**
   * Additional custom styles.
   */
  @property({ type: Object }) styles = DEFAULT_SHARED_ATTRIBUTES;

  /**
   * Value of input.
   */
  @property({ type: String }) value = '';

  /**
   * Sets textbox label.
   */
  @property({ type: String }) label = '';

  /**
   * Sets textbox placeholder.
   */
  @property({ type: String }) placeholder = '';

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
      placeholder,
      onKeyupChangeHandler,
      onChangeHandler,
      styles,
    } = this;
    return html`
      <paper-input
        style=${styleMap(styles)}
        label="${label}"
        placeholder="${placeholder}"
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

  setAttribute(key: string, value: string) {
    switch (key) {
      case 'value':
        this.value = value;
        break;
      case 'label':
        this.label = value;
        break;
      case 'placeholder':
        this.placeholder = value;
        break;
      case 'type':
        this.type = value;
        break;
    }

    this.requestUpdate();
  }

  setStyle(style: { [key: string]: string }) {
    this.styles = style;
    this.requestUpdate();
  }
}
