/**
 *  @fileoverview The attributes-tab widget contains the different
 *  attributes that a user can edit for a particular element.
 */
import { html, customElement, css, property, LitElement } from 'lit-element';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icon/iron-icon.js';
import '../tab-container/tab-container';
import '../draggable-widget/draggable-widget';
import '../ui-label/ui-label';
import '../ui-button/ui-button';
import '../ui-select/ui-select';
import '../ui-checkbox/ui-checkbox';
import '../ui-textbox/ui-textbox';
import '../ui-slider/ui-slider';
import '../ui-panel/ui-panel';
import '../search-bar/search-bar';

@customElement('attributes-tab')
export class AttributesTab extends LitElement {
  static styles = css``;

  /**
   * Sets the search query.
   */
  @property({ type: String }) query = '';

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('edit-widget', this.handleEditWidget);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('edit-widget', this.handleEditWidget);
  }

  handleEditWidget(e: Event) {
    console.log(e);
  }

  render() {
    const emptyNotice = html`
      <empty-notice
        icon="create"
        message="No widget selected. Click on a widget's edit icon to select it."
        size="large"
        bold
      ></empty-notice>
    `;

    return html`
      <tab-container title="Attributes">${emptyNotice}</tab-container>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'attributes-tab': AttributesTab;
  }
}
