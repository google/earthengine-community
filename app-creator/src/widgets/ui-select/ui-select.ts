/**
 * @fileoverview The ui-select widget allows users to add a dropdown menu to their templates.
 */
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-listbox/paper-listbox';
import { css, customElement, html, LitElement, property } from 'lit-element';

@customElement('ui-select')
export class Select extends LitElement {
  static styles = css`
    paper-dropdown-menu {
      margin: var(--tight);
    }
  `;

  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = {};

  /**
   * Sets the items in the drop down menu.
   */
  @property({ type: Array }) items: string[] = [];

  /**
   * Sets the widget placeholder.
   */
  @property({ type: String }) placeholder = '';

  /**
   * Sets the value of the drop down menu (ie. currently selected item).
   */
  @property({ type: String }) value = '';

  /**
   * If true, the user will not be able to interact with the element.
   */
  @property({ type: Boolean }) disabled = false;

  /**
   * Callback triggered whenever an item is selected from the menu.
   */
  @property({ type: Object })
  onChangeHandler: (selection: string) => void = () => {};

  render() {
    return html`
      <paper-dropdown-menu
        label="${this.placeholder}"
        ?disabled=${this.disabled}
        @value-changed=${this.handleSelectionChange}
      >
        <paper-listbox
          slot="dropdown-content"
          selected="${this.items.indexOf(this.value)}"
        >
          ${this.items.map((i) => html`<paper-item>${i}</paper-item>`)}
        </paper-listbox>
      </paper-dropdown-menu>
    `;
  }

  handleSelectionChange(selection: CustomEvent): void {
    this.value = selection.detail.value;
    this.onChangeHandler(this.value);
  }

  getDisabled(): boolean {
    return this.disabled;
  }

  getPlaceholder(): string {
    return this.placeholder;
  }

  getValue(): string {
    return this.value;
  }

  getItems(): string[] {
    return this.items;
  }

  onChange(callback: (selection: string) => void): void {
    this.onChangeHandler = callback;
  }

  setDisabled(disabled: boolean): Select {
    this.disabled = disabled;
    return this;
  }

  setPlaceholder(placeholder: string): Select {
    this.placeholder = placeholder;
    return this;
  }

  setValue(value: string): Select {
    this.value = value;
    return this;
  }

  getStyle() {
    return this.styles;
  }
}
