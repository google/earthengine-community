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
import '@polymer/paper-card/paper-card.js';
import '../dropzone-widget/dropzone-widget';
import '../ui-map/ui-map';
import '@polymer/iron-icons/hardware-icons.js';
import './../ui-panel/ui-panel';
import { connect } from 'pwa-helpers';
import { DeviceType, WidgetType } from '../../redux/types/enums';
import { store } from '../../redux/store';
import { AppCreatorStore, WidgetMetaData } from '../../redux/reducer';
import { getIdPrefix } from '../../utils/helpers';
import { Map } from '../ui-map/ui-map';
import { Dropzone } from '../dropzone-widget/dropzone-widget';
import { Panel } from './../ui-panel/ui-panel';
import { setSelectedTemplate } from '../../redux/actions';
import { ROOT_ID } from '../../utils/constants';
import { EEWidget } from '../../redux/types/types';
import { PaperCardElement } from '@polymer/paper-card/paper-card.js';

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

    #storyboard {
      height: 100%;
      width: 100%;
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
    if (state.template.id !== this.templateID) {
      this.templateID = state.template.id;
      const { storyboard } = this;
      if (storyboard == null) {
        return;
      }
      storyboard.innerHTML = ``;
      generateUI(state.template, storyboard);
    }
  }

  /**
   * Represents the id of the currently selected template. Used to avoid rerendering on state changes.
   */
  @property({ type: String }) templateID: string = '';

  /**
   * Switches between desktop and mobile view.
   */
  switchDeviceViewTab(device: DeviceType) {
    const { storyboard } = this;
    if (storyboard == null) {
      return;
    }

    switch (device) {
      case DeviceType.desktop:
        this.selectedTab = 0;
        storyboard.style.width = '100%';
        storyboard.style.height = '100%';
        break;
      case DeviceType.mobile:
        this.selectedTab = 1;
        storyboard.style.width = '400px';
        storyboard.style.height = '800px';
        break;
    }

    this.requestUpdate();
  }

  /**
   * Sets selected tab.
   * 0 for desktop and 1 for mobile.
   */
  @property({ type: Number }) selectedTab = 0;

  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = {};

  @query(`#${STORYBOARD_ID}`) storyboard!: PaperCardElement;

  render() {
    const { switchDeviceViewTab, styles } = this;
    return html`
      <div id="container">
        <paper-tabs id="device-tabs" selected=${this.selectedTab} noink>
          <paper-tab
            @click=${() =>
              switchDeviceViewTab.call(
                this,
                DeviceType.desktop
              )}><iron-icon icon="hardware:desktop-windows"></iron-icon></paper-tab>
          <paper-tab @click=${() =>
            switchDeviceViewTab.call(this, DeviceType.mobile)}
            ><iron-icon icon="hardware:smartphone"></iron-icon></paper-icon-button
          ></paper-tab>
        </paper-tabs>

        <paper-card id="storyboard" style=${styleMap(styles)}></paper-card>
      </div>
    `;
  }

  getStyle(): object {
    return this.styles;
  }
}

function generateUI(template: AppCreatorStore['template'], node: HTMLElement) {
  const templateCopy = Object.assign({}, template);

  function helper(widgetData: WidgetMetaData): HTMLElement {
    const { id, children } = widgetData;
    const { element, dropzone } = getWidgetElement(widgetData);

    for (const childID of children) {
      if (dropzone != null) {
        dropzone.appendChild(helper(templateCopy[childID]));
      } else {
        element.appendChild(helper(templateCopy[childID]));
      }
    }

    templateCopy[id].widgetRef = element;

    return element;
  }

  // The root of the template will always have an id of panel-template-0
  const root = templateCopy[ROOT_ID];
  node.appendChild(helper(root));

  // Replace the store's template with the one that include the widgetRefs.
  store.dispatch(setSelectedTemplate(templateCopy));
}

function getWidgetElement({
  id,
  editable,
  uniqueAttributes,
  style,
}: WidgetMetaData): { element: HTMLElement; dropzone: Dropzone | null } {
  // Get widget type (ie. panel-0 -> panel).
  const type = getIdPrefix(id);

  // Create DOM element.
  let element = document.createElement(`ui-${type}`);
  element.id = id;

  // Set Unique attributes.
  for (const attribute in uniqueAttributes) {
    element.setAttribute(attribute, uniqueAttributes[attribute]);
  }

  // Set styles.
  (element as EEWidget).setStyle(style);

  let dropzone = null;

  switch (type) {
    case WidgetType.map:
      (element as Map).setAttribute('apiKey', window.process.env.MAPS_API_KEY);
      break;
    case WidgetType.panel:
      (element as Panel).editable = editable ?? false;
      if (editable) {
        const dropzoneWidget = document.createElement(
          'dropzone-widget'
        ) as Dropzone;
        dropzoneWidget.classList.add('full-height');
        element.appendChild(dropzoneWidget);
        dropzone = dropzoneWidget;
      }
      break;
  }

  return { element, dropzone };
}
