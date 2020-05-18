/**
 *  @fileoverview The tab-container is used as a wrapper for the different tabs
 *  in the actions panel
 */
import { LitElement, html, customElement, css, property } from 'lit-element';

@customElement('tab-container')
export class TabContainer extends LitElement {
  static styles = css`
    #container {
      height: calc(100vh - 67.57px - 80px);
      width: 100%;
      overflow-y: scroll;
      padding: var(--regular);
    }
  `;

  @property({ type: String })
  title = '';

  render() {
    const { title } = this;
    return html`
      <div id="container">
        <h5>${title}</h5>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tab-container': TabContainer;
  }
}
