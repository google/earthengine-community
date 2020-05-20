import '@polymer/paper-button';
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';

@customElement('ui-button')
export class Button extends LitElement {
  static styles = css`
    paper-button {
      margin: var(--tight);
      background-color: var(--accent-color);
      color: var(--primary-color);
    }
  `;

  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = {};

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
   * Callback triggered on button click.
   */
  @property({ type: Object }) onClickHandler: () => void = () => {};

  render() {
    return html`
      <paper-button
        style=${styleMap(this.styles)}
        draggable="true"
        @click=${this.onClickHandler}
        ?disabled=${this.disabled}
        ?raised=${this.raised}
      >
        ${this.label}
      </paper-button>
    `;
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
}
