/**
 *  @fileoverview The attributes-tab widget contains the different
 *  attributes that a user can edit for a particular element.
 */
import { html, customElement, css, property, LitElement } from 'lit-element';
import { nothing } from 'lit-html';
import { connect } from 'pwa-helpers';
import { store } from '../../redux/store.js';
import { AppCreatorStore } from '../../redux/reducer';
import '../tab-container/tab-container';

@customElement('attributes-tab')
export class AttributesTab extends connect(store)(LitElement) {
  static styles = css`
    input {
      margin: var(--tight) 0px;
    }

    .input-label {
      margin: 0px 0px;
      font-size: 0.8rem;
      font-weight: 600;
    }
  `;

  stateChanged(state: AppCreatorStore) {
    this.editingWidget = state.editingWidget;
  }

  /**
   * Sets the search query.
   */
  @property({ type: String }) query = '';

  /**
   * Widget currently being edited.
   */
  @property({ type: Object })
  editingWidget: Element | null = store.getState().editingWidget;

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
      <tab-container title="Attributes"
        >${this.editingWidget ? nothing : emptyNotice}</tab-container
      >
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'attributes-tab': AttributesTab;
  }
}
