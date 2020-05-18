/**
 *  @fileoverview The tool-bar widget is the header component
 *  which contains the app title and export actions
 */
import { LitElement, html, customElement, css } from 'lit-element';
import '@polymer/paper-button/paper-button.js';

@customElement('tool-bar')
export class ToolBar extends LitElement {
  static prefix = 'Google Earth Engine';
  static suffix = 'App Creator';

  static styles = css`
    #container {
      height: 35px;
      padding: var(--regular);
      display: flex;
      align-items: center;
      border-bottom: var(--light-border);
      background-color: var(--primary-color);
    }

    #app-title-prefix {
      font-weight: 500;
      color: var(--accent-color);
    }

    #app-title-suffix {
      color: var(--app-title-suffix-color);
      font-weight: 400;
    }

    h3 {
      margin: 0;
      padding: 0;
      font-size: 1.3rem;
    }
  `;

  render() {
    return html`
      <div id="container">
        <h3>
          <strong id="app-title-prefix">${ToolBar.prefix}</strong>
          <span id="app-title-suffix">${ToolBar.suffix}</span>
        </h3>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tool-bar': ToolBar;
  }
}
