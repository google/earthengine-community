/**
 *  @fileoverview The template-card widget allows users to switch to a new template.
 */
import { LitElement, html, customElement, css } from 'lit-element';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';

@customElement('template-card')
export class TemplateCard extends LitElement {
  static styles = css``;

  render() {
    return html`
      <paper-card
        heading="Emmental"
        image="http://placehold.it/350x150/FFC107/000000"
        alt="Emmental"
      >
        <div class="card-content">
          Emmentaler or Emmental is a yellow, medium-hard cheese that originated
          in the area around Emmental, Switzerland. It is one of the cheeses of
          Switzerland, and is sometimes known as Swiss cheese.
        </div>
        <div class="card-actions">
          <paper-button>Share</paper-button>
          <paper-button>Explore!</paper-button>
        </div>
      </paper-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'template-card': TemplateCard;
  }
}
