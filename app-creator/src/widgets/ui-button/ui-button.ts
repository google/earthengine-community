import '@polymer/paper-button';
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import {
  DEFAULT_SHARED_ATTRIBUTES,
  AttributeMetaData,
  DefaultAttributesType,
  getDefaultAttributes,
} from '../../redux/types/attributes';
import { InputType } from '../../redux/types/enums';

@customElement('ui-button')
export class Button extends LitElement {
  static styles = css`
    paper-button {
      margin: var(--tight);
      background-color: var(--primary-color);
      color: var(--primary-color);
      height: 30px;
      font-size: 0.8rem;
    }

    .primary {
      background-color: var(--primary-color);
      color: var(--accent-color);
    }

    .secondary {
      background-color: var(--accent-color);
      color: var(--primary-color);
    }
  `;

  static attributes: AttributeMetaData = {
    label: {
      value: 'Button',
      placeholder: 'Enter label',
      type: InputType.text,
    },
    disabled: {
      value: 'false',
      type: InputType.select,
      items: ['true', 'false'],
    },
  };

  static DEFAULT_BUTTON_ATTRIBUTES: DefaultAttributesType = getDefaultAttributes(
    Button.attributes
  );

  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = DEFAULT_SHARED_ATTRIBUTES;

  /**
   * If true, the user cannot interact with this element.
   */
  @property({ type: Boolean }) disabled = false;

  /**
   * Adds a button border and shadow when true.
   */
  @property({ type: Boolean }) raised = true;

  /**
   * Sets the button label.
   */
  @property({ type: String }) label = '';

  /**
   * Sets the theme of the button including background and text color.
   * Options available "primary" | "secondary".
   */
  @property({ type: String }) color = 'primary';

  /**
   * Callback triggered on button click.
   */
  @property({ type: Object }) onClickHandler: () => void = () => {};

  render() {
    const { label, color, disabled, onClickHandler, raised, styles } = this;

    return html`
      <paper-button
        style=${styleMap(styles)}
        draggable="true"
        @click=${onClickHandler}
        ?disabled=${disabled}
        ?raised=${raised}
        class="${color}"
      >
        ${label}
      </paper-button>
    `;
  }

  setAttribute(key: string, value: string) {
    switch (key) {
      case 'label':
        this.label = value;
        break;
      case 'raised':
        this.raised = value === 'true';
        break;
      case 'disabled':
        this.disabled = value === 'true';
        break;
      case 'color':
        this.color = value;
        break;
    }

    this.requestUpdate();
  }

  getDisabled(): boolean {
    return this.disabled;
  }

  getLabel(): string {
    return this.label;
  }

  onClick(callback: () => void): void {
    this.onClickHandler = callback;
  }

  setLabel(label: string): Button {
    this.label = label;
    return this;
  }

  getStyle(): object {
    return this.styles;
  }

  setStyle(style: { [key: string]: string }) {
    this.styles = style;
    this.requestUpdate();
  }
}
