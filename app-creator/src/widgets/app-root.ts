/**
 *  @fileoverview The app-root widget is the starting point of our application
 *  in which all other widgets are rendered
 */
import { LitElement, html, customElement, css } from 'lit-element';
import './tool-bar/tool-bar';
import './actions-panel/actions-panel';
import './tab-container/tab-container';

@customElement('app-root')
export class AppRoot extends LitElement {
  static styles = css`
    #app {
      height: 100%;
      width: 100%;
    }

    #container {
      display: flex;
      width: 100%;
      height: calc(100vh - 67.57px);
    }
  `;

  render() {
    return html`
      <div id="app">
        <tool-bar></tool-bar>
        <div id="container">
          <actions-panel></actions-panel>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}
