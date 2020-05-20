/**
 *  @fileoverview The actions-panel widget is the left side panel in which
 *  all template actions take place. This includes selecting templates,
 *  adding widgets, and editing widget attributes.
 */
import { LitElement, html, customElement, css, property } from 'lit-element';
import { nothing } from 'lit-html';
import { IronIconElement } from '@polymer/iron-icon';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/device-icons.js';
import '@polymer/iron-icons/image-icons.js';
import '../widgets-tab/widgets-tab';

@customElement('actions-panel')
export class ActionsPanel extends LitElement {
  static styles = css`
    #container {
      width: var(--actions-panel-width);
      height: 100%;
      border-right: var(--light-border);
      display: flex;
      position: relative;
      background-color: var(--primary-color);
    }

    #toggle-side-panel {
      position: absolute;
      cursor: pointer;
      top: 16px;
      right: -25.5px;
      background-color: white;
      border: var(--light-border);
      border-left: none;
      z-index: 10;
    }

    #panel {
      width: 100%;
      overflow-x: hidden;
    }
  `;

  /**
   * Sets the currently selected tab.
   */
  @property({ type: Number })
  selectedTab = 1;

  handleTabSwitch(id: number) {
    this.selectedTab = id;
  }

  /**
   * Collapses/Expands the actions panel.
   */
  togglePanel({ target }: { target: EventTarget }) {
    const panel = this.shadowRoot?.getElementById('container');

    if (panel == null) {
      return;
    }

    if (panel.style.width === '0px') {
      panel.style.width = 'var(--actions-panel-width)';
      (target as IronIconElement).icon = 'icons:chevron-left';
    } else {
      panel.style.width = '0px';
      (target as IronIconElement).icon = 'icons:chevron-right';
    }
  }

  render() {
    const { selectedTab } = this;

    const widgetsMarkup =
      selectedTab === 1 ? html`<widgets-tab></widgets-tab>` : nothing;

    return html`
      <div id="container">
        <div id="panel">
          <paper-tabs selected="${selectedTab}" noink>
            <paper-tab @click=${() => this.handleTabSwitch(0)}>
              <iron-icon icon="image:filter-none"></iron-icon>
            </paper-tab>
            <paper-tab @click=${() => this.handleTabSwitch(1)}>
              <iron-icon icon="device:widgets"></iron-icon>
            </paper-tab>
            <paper-tab @click=${() => this.handleTabSwitch(2)}>
              <iron-icon icon="image:tune"></iron-icon>
            </paper-tab>
          </paper-tabs>
          ${widgetsMarkup}
        </div>
        <iron-icon
          @click=${this.togglePanel}
          id="toggle-side-panel"
          icon="icons:chevron-left"
        ></iron-icon>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'actions-panel': ActionsPanel;
  }
}
