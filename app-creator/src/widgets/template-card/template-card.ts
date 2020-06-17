/**
 *  @fileoverview The template-card widget allows users to switch to a new template.
 */
import { LitElement, html, customElement, css, property } from 'lit-element';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import { noop } from '../../utils/helpers';
import { store } from '../../redux/store';

@customElement('template-card')
export class TemplateCard extends LitElement {
  static styles = css`
    .card-image {
      height: 120px;
      background-size: cover;
      background-position: center;
      border-bottom: var(--light-border);
      overflow: hidden;
    }

    .card-container {
      border: var(--light-border);
      border-radius: var(--tight);
      overflow: hidden;
    }

    .card-actions {
      display: flex;
      justify-content: flex-end;
      padding: var(--extra-tight);
    }
  `;

  /**
   * Template id. Used to determine if button should be disabled or not.
   */
  @property({ type: String }) id = '';

  /**
   * Sets card image.
   */
  @property({ type: String }) imageUrl = '';

  /**
   * Callback triggered on select button click.
   */
  @property({ type: Object }) onSelection: () => void = noop;

  /**
   * Disables button if true and sets label to 'selected'.
   */
  @property({ type: Boolean }) selected = false;

  render() {
    const { id, imageUrl, onSelection } = this;

    const selected = store.getState().template.id === id;
    const buttonLabel = selected ? 'Selected' : 'Select';

    return html`
      <div class="card-container">
        <div class="card-image" style="background: url(${imageUrl})"></div>
        <div class="card-actions">
          <paper-button
            @click=${() => {
              onSelection();
              this.requestUpdate();
            }}
            ?disabled=${selected}
            >${buttonLabel}</paper-button
          >
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'template-card': TemplateCard;
  }
}
