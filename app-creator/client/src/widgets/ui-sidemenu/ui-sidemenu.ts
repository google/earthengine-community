/**
 *  @fileoverview The ui-sidemenu is used as a wrapper for the different tabs
 *  in the actions-panel.
 */
import {
  LitElement,
  html,
  customElement,
  css,
  property,
  query,
} from 'lit-element';
import { Panel } from '../ui-panel/ui-panel';
import { classMap } from 'lit-html/directives/class-map';
import { Layout } from '../../redux/types/enums';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '../ui-panel/ui-panel';

@customElement('ui-sidemenu')
export class SideMenu extends LitElement {
  /**
   * Additional custom styles.
   */
  static styles = css`
    paper-icon-button {
      margin: var(--tight);
      pointer-events: auto;
      background-color: white;
      border-radius: 50%;
    }

    #container {
      display: flex;
      height: 100%;
      top: 0;
      left: 0;
      position: absolute;
      width: 100%;
      pointer-events: none;
    }

    ui-panel {
      height: 100%;
      width: 80%;
      overflow: hidden;
      background-color: var(--primary-color);
      pointer-events: auto;
    }

    .full-height {
      height: 100%;
    }

    .COLUMN {
      flex-direction: column;
    }

    .ROW {
      flex-direction: row;
    }
  `;

  /**
   * Sets the flex layout of child widgets.
   * Options available are 'column' and 'row'.
   * column layout will append widgets below the last child element.
   * row layout will append widgets to the right of the last child element.
   */
  @property({ type: String }) layout = Layout.COLUMN;

  /**
   * Contains an inner dropzone-widget.
   */
  @property({ type: Boolean }) hasDropzone = false;

  /**
   * Additional custom styles
   */
  @property({ type: Object }) styles = {};

  /**
   * Sets editable property.
   */
  @property({ type: Boolean }) editable = false;

  /**
   * Reference to ui panel widget.
   */
  @query('ui-panel') panel!: Panel;

  firstUpdated() {
    if (this.panel) {
      this.panel.id = this.id;
    }
  }

  toggleMenu(e: Event) {
    e.stopPropagation();

    const { panel } = this;
    if (!panel) {
      return;
    }

    const isZeroWidth = panel.style.width.match(/^\s*0(px|%)?/);
    panel.style.width = isZeroWidth ? '80%' : '0%';
  }

  setStyle(style: { [key: string]: string }) {
    const filteredStyles = new Set(['position', 'top', 'left', 'width']);
    if (this.panel != null) {
      for (const attribute in style) {
        if (!filteredStyles.has(attribute)) {
          this.panel.style[attribute as any] = style[attribute];
        }
      }
    }
    this.requestUpdate();
  }

  setAttribute(key: string, value: string) {
    switch (key) {
      case 'layout':
        this.layout = value.toUpperCase() as Layout;
        break;
      case 'hasDropzone':
        this.hasDropzone = value === 'true';
        break;
    }

    this.requestUpdate();
  }

  render() {
    const { toggleMenu, layout } = this;
    return html`
      <div id="container">
        <ui-panel>
          <slot class=${classMap({ [layout]: true })}></slot>
        </ui-panel>
        <paper-icon-button
          icon="icons:menu"
          @click=${toggleMenu}
        ></paper-icon-button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-sidemenu': SideMenu;
  }
}
