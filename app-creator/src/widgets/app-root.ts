/**
 *  @fileoverview The app-root widget is the starting point of our application
 *  in which all other widgets are rendered
 */
import { LitElement, html, customElement, css } from 'lit-element';
import './tool-bar/tool-bar';
import './actions-panel/actions-panel';
import './tab-container/tab-container';
import './story-board/story-board';

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
      height: calc(100vh - 47px);
    }

    #storyboard {
      height: 95%;
      width: 90%;
    }

    #storyboard-container {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }
  `;

  render() {
    return html`
      <div id="app">
        <tool-bar></tool-bar>
        <div id="container">
          <actions-panel></actions-panel>
          <div id="storyboard-container">
            <story-board id="storyboard"> </story-board>
          </div>
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
