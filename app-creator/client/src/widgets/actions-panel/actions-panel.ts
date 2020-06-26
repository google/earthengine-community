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
import '../attributes-tab/attributes-tab';
import '../templates-tab/templates-tab';
import { store } from '../../redux/store';
import { connect } from 'pwa-helpers';
import { AppCreatorStore } from '../../redux/reducer';
import { setSelectedTab } from '../../redux/actions';
import { Tab } from '../../redux/types/enums';

@customElement('actions-panel')
export class ActionsPanel extends connect(store)(LitElement) {
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
      right: -20px;
      background-color: white;
      border: var(--light-border);
      border-left: none;
      z-index: 10;
      --iron-icon-height: 18px;
      --iron-icon-width: 18px;
    }

    #panel {
      width: 100%;
      overflow-x: hidden;
    }

    paper-tabs {
      border-bottom: var(--light-border);
      --iron-icon-height: 16px;
      --iron-icon-width: 16px;
      height: 40px;
    }
  `;

  stateChanged(state: AppCreatorStore) {
    this.selectedTab = state.selectedTab;
  }

  /**
   * Sets the currently selected tab.
   */
  @property({ type: Number })
  selectedTab = Tab.templates;

  handleTabSwitch(index: Tab) {
    store.dispatch(setSelectedTab(index));
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

    let renderedTab = nothing;
    switch (selectedTab) {
      case Tab.templates:
        renderedTab = html`<templates-tab></templates-tab>`;
        break;
      case Tab.widgets:
        renderedTab = html`<widgets-tab></widgets-tab>`;
        break;
      case Tab.attributes:
        renderedTab = html`<attributes-tab></attributes-tab>`;
        break;
    }

    return html`
      <div id="container">
        <div id="panel">
          <paper-tabs selected="${selectedTab}" noink>
            <paper-tab @click=${() => this.handleTabSwitch(Tab.templates)}>
              <iron-icon icon="image:filter-none"></iron-icon>
            </paper-tab>
            <paper-tab @click=${() => this.handleTabSwitch(Tab.widgets)}>
              <iron-icon icon="device:widgets"></iron-icon>
            </paper-tab>
            <paper-tab @click=${() => this.handleTabSwitch(Tab.attributes)}>
              <iron-icon icon="image:tune"></iron-icon>
            </paper-tab>
          </paper-tabs>
          ${renderedTab}
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
