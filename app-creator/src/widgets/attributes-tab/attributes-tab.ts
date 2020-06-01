/**
 *  @fileoverview The attributes-tab widget contains the different
 *  attributes that a user can edit for a particular element.
 */
import { html, customElement, css, property, LitElement } from 'lit-element';
import { nothing } from 'lit-html';
import { connect } from 'pwa-helpers';
import { store } from '../../redux/store.js';
import { AppCreatorStore, EventType } from '../../redux/reducer';
import { Label } from '../ui-label/ui-label';
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

    .attribute-input {
      margin: var(--extra-tight) 0px;
      margin-right: 0px;
      padding: var(--extra-tight);
      border: var(--light-border);
      -webkit-border-radius: var(--extra-tight);
      border-radius: var(--extra-tight);
      width: 100% !important;
      resize: none;
      font-family: inherit;
      background-color: var(--primary-color);
    }

    .attribute-input:focus {
      border-color: var(--accent-color);
      outline: none;
    }

    .attribute-input-container {
      margin: var(--tight) 0px;
      width: calc(100% - var(--regular));
    }

    .select-input {
      width: 97.5%;
    }
  `;

  stateChanged(state: AppCreatorStore) {
    if (state.eventType === EventType.editing) {
      this.editingWidget = state.element;
    }
  }

  /**
   * Sets the search query.
   */
  @property({ type: String }) query = '';

  /**
   * Widget currently being edited.
   */
  @property({ type: Object })
  editingWidget: Element | null =
    store.getState().eventType === EventType.editing
      ? store.getState().element
      : null;

  getLabelInputs(widget: Element | null) {
    if (widget == null) {
      return nothing;
    }

    return html`
      <div class="attribute-input-container">
        <p class="input-label">Value:</p>
        <textarea
          class="attribute-input"
          rows="4"
          @keyup=${(e: Event) =>
            ((widget as Label).value = (e.target as HTMLInputElement).value)}
        >
${(widget as Label).value}</textarea
        >
      </div>
      <div class="attribute-input-container">
        <p class="input-label">Target Url:</p>
        <input
          class="attribute-input"
          @keyup=${(e: Event) =>
            ((widget as Label).targetUrl = (e.target as HTMLInputElement).value)}
          value="${(widget as Label).targetUrl}"
        ></input
        >
      </div>
      <div class="attribute-input-container">
        <p class="input-label">Color:</p>
        <input
          class="attribute-input"
          type='color'
          @change=${(e: Event) =>
            ((widget as Label).style[
              'color'
            ] = (e.target as HTMLInputElement).value)}
          value="${(widget as HTMLElement).style.color}"
        ></input
        >
      </div>
      <div class="attribute-input-container select-input">
        <p class="input-label">Text Align:</p>
        <select
          name='Text Align'
          placeholder='Text Align'
          class="attribute-input"
          value="${(widget as HTMLElement).style.textAlign}"
          @change=${(e: Event) =>
            ((widget as Label).style[
              'textAlign'
            ] = (e.target as HTMLSelectElement).value)}
          >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select
        >
      </div>
      <div class="attribute-input-container">
        <p class="input-label">Padding:</p>
        <input
          class="attribute-input"
          type='number'
          value='0'
          @change=${(e: Event) => {
            console.log((e.target as HTMLInputElement).value + 'px');
            console.log('padding', (widget as HTMLElement).style.padding);
            (widget as Label).style['padding'] =
              (e.target as HTMLInputElement).value + 'px';
          }}
          value="${(widget as HTMLElement).style.padding}"
        ></input
        >
      </div>
    `;
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

    const editableAttributesMarkup = this.getLabelInputs(this.editingWidget);

    return html`
      <tab-container title="Attributes"
        >${editableAttributesMarkup}
        ${this.editingWidget ? nothing : emptyNotice}</tab-container
      >
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'attributes-tab': AttributesTab;
  }
}

/**
 * Label
 * - value
 * - targetUrl
 */

/**
 * Button
 * - label
 * - disabled
 */

/**
 * Checkbox
 * - label
 * - value
 * - disabled
 */

/**
 * Select
 * - items
 * - placeholder
 * - value
 * - disabled
 */

/**
 * Slider
 * - min
 * - max
 * - value
 * - step
 * - direction
 * - disabled
 */

/**
 * Textbox
 * - placeholder
 * - value
 * - disabled
 */
