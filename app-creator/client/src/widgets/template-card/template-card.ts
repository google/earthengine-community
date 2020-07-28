/**
 *  @fileoverview The template-card widget allows users to switch to a new template.
 */
import { LitElement, html, customElement, css, property } from 'lit-element';
import { nothing } from 'lit-html';
import { noop } from '../../utils/helpers';
import { store } from '../../redux/store';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';

@customElement('template-card')
export class TemplateCard extends LitElement {
  static styles = css`
    .card-image {
      height: 120px;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      border-bottom: var(--light-border);
      overflow: hidden;
    }

    .card-container {
      border: var(--light-border);
      border-radius: var(--tight);
      overflow: hidden;
      margin-bottom: var(--tight);
    }

    .card-actions {
      display: flex;
      justify-content: flex-end;
      padding: var(--extra-tight);
    }

    h4 {
      margin: var(--tight) 0px 0px var(--tight);
      font-weight: 400;
    }
  `;

  /**
   * Template id. Used to determine if button should be disabled or not.
   */
  @property({ type: String }) id = '';

  /**
   * Template title.
   */
  @property({ type: String }) title = '';

  /**
   * Sets card image.
   */
  @property({ type: String }) imageUrl = '';

  /**
   * Callback triggered on select button click.
   */
  @property({ type: Object }) onSelection: VoidFunction = noop;

  /**
   * Disables button if true and sets label to 'selected'.
   */
  @property({ type: Boolean }) selected = false;

  /**
   * Hides title when false.
   */
  @property({ type: Boolean }) showTitle = false;

  render() {
    const { id, imageUrl, title, showTitle, onSelection } = this;
    const selected = store.getState().template.config?.parentID === id;
    const buttonLabel = selected ? 'Selected' : 'Select';

    const titleMarkup = showTitle ? html`<h4>${title}</h4>` : nothing;
    return html`
      <div class="card-container">
        <div
          class="card-image"
          style="background-image: url(${imageUrl});"
        ></div>
        ${titleMarkup}
        <div class="card-actions">
          <paper-button
            @click=${() => {
              onSelection();
              this.requestUpdate();
            }}
            ?disabled=${selected}
          >
            ${buttonLabel}
          </paper-button>
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
