/**
 *  @fileoverview The story-board widget lets users preview and edit their templates.
 */
import {
  css,
  customElement,
  html,
  LitElement,
  property,
  query,
} from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { classMap } from 'lit-html/directives/class-map';
import { connect } from 'pwa-helpers';
import { DeviceType } from '../../redux/types/enums';
import { store } from '../../redux/store';
import { AppCreatorStore } from '../../redux/reducer';
import { PaperCardElement } from '@polymer/paper-card/paper-card.js';
import { generateUI } from '../../utils/template-generation';
import { setSelectedTemplateID } from '../../redux/actions';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-icons/hardware-icons.js';
import '@polymer/paper-tabs/paper-tabs';
import '@polymer/paper-tabs/paper-tab';
import '../dropzone-widget/dropzone-widget';
import '../ui-map/ui-map';
import '../ui-panel/ui-panel';

const STORYBOARD_ID = 'storyboard';

/**
 * The story-board widget renders the currently selected template
 * and allows the user to interact with it.
 */
@customElement('story-board')
export class Storyboard extends connect(store)(LitElement) {
  static styles = css`
    #container {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .storyboard {
      height: 100%;
      width: 100%;
      background-color: var(--primary-color);
      margin: 0 auto;
      overflow: hidden;
      transition: 0.5s ease;
    }

    .mobile-storyboard {
      height: 700px;
      width: 350px;
      background-color: var(--primary-color);
      margin: 0 auto;
      overflow: hidden;
      transition: 0.5s ease;
    }

    #root-panel {
      height: 100%;
      width: 100%;
      background-color: blue;
    }

    .full-size {
      height: 100%;
      width: 100%;
    }

    .full-width {
      width: 100%;
    }

    .full-height {
      height: 100%;
    }

    .padded {
      padding: var(--extra-tight);
    }

    ui-map {
      display: block;
      height: 100%;
    }

    empty-notice {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #device-tabs {
      width: 150px;
      margin: var(--regular) auto var(--tight) auto;
    }
  `;

  stateChanged(state: AppCreatorStore) {
    const template = state.template;
    if (
      template.hasOwnProperty('config') &&
      template.config.id !== state.selectedTemplateID
    ) {
      store.dispatch(setSelectedTemplateID(template.config.id));

      const { storyboard } = this;
      if (storyboard) {
        storyboard.innerHTML = ``;
        generateUI(template, storyboard);
      }

      this.requestUpdate();
    }
  }

  /**
   * Additional custom styles.
   */
  @property({ type: Object }) styles = {};

  /**
   * Reference to storyboard element.
   */
  @query(`#${STORYBOARD_ID}`) storyboard!: PaperCardElement;

  render() {
    const { styles } = this;

    const isMobile =
      store.getState().template.config?.device === DeviceType.mobile;

    return html`
      <div id="container">
        <paper-card
          id="storyboard"
          style=${styleMap(styles)}
          class=${classMap({ storyboard: true, 'mobile-storyboard': isMobile })}
        ></paper-card>
      </div>
    `;
  }

  getStyle(): object {
    return this.styles;
  }
}
