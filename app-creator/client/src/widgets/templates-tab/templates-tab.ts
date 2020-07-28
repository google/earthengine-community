/**
 *  @fileoverview The templates-tab widget contains the different templates that the user can use for their earth engine app.
 */
import { LitElement, html, customElement, css, property } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
import { onSearchEvent } from '../search-bar/search-bar';
import { store } from '../../redux/store';
import { setSelectedTemplate } from '../../redux/actions';
import { templatesManager } from '../../data/templates';
import { connect } from 'pwa-helpers';
import { AppCreatorStore } from '../../redux/reducer';
import { DeviceType } from '../../redux/types/enums';
import { classMap } from 'lit-html/directives/class-map';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icon/iron-icon.js';
import '../tab-container/tab-container';
import '../draggable-widget/draggable-widget';
import '../ui-label/ui-label';
import '../ui-button/ui-button';
import '../ui-select/ui-select';
import '../ui-checkbox/ui-checkbox';
import '../ui-textbox/ui-textbox';
import '../ui-slider/ui-slider';
import '../ui-panel/ui-panel';
import '../ui-chart/ui-chart';
import '../search-bar/search-bar';
import '../empty-notice/empty-notice';
import '../template-card/template-card';
import '@cwmr/paper-chip/paper-chip.js';
import { chips } from '../../utils/helpers';

export interface TemplatesTabItem {
  id: string;
  name: string;
  markup: TemplateResult;
  device: DeviceType;
}

@customElement('templates-tab')
export class TemplatesTab extends connect(store)(LitElement) {
  static styles = css`
    .subtitle {
      margin: var(--regular) 0px var(--tight) 0px;
      color: var(--accent-color);
    }

    #cards-container {
      margin-top: var(--regular);
    }

    #chips-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      margin-top: var(--tight);
    }

    paper-chip {
      margin: 0px var(--extra-tight);
      background-color: var(--primary-color);
      color: var(--accent-color);
    }

    .selected-paper-chip {
      background-color: var(--accent-color);
      color: var(--primary-color);
    }
  `;

  stateChanged(state: AppCreatorStore) {
    if (state.template.config.parentID !== this.selectedTemplateID) {
      this.selectedTemplateID = state.template.config.parentID;
      this.requestUpdate();
    }
  }

  /**
   * Represents the id of the currently selected template. Used to rerender templates tab.
   */
  @property({ type: String }) selectedTemplateID: string = '';

  /**
   * Sets the search query.
   */
  @property({ type: String }) query = '';

  /**
   * Sets device filter.
   */
  @property({ type: String }) deviceFilter = DeviceType.all;

  getTemplateCards(showTitle = false) {
    const templates = templatesManager.getTemplates();
    return templates.map(({ id, name, imageUrl, device, template }) => {
      return {
        id,
        name,
        device,
        markup: html`
          ${showTitle ? nothing : html`<h6 class="subtitle">${name}</h6>`}
          <template-card
            id="${id}"
            title="${name}"
            imageUrl="${imageUrl}"
            ?showTitle=${showTitle}
            .onSelection=${this.createSelectionCallback(template)}
          ></template-card>
        `,
      };
    });
  }

  /**
   * Returns widgets with names and ids that include the search query.
   */
  static filterTemplates(
    templateCards: TemplatesTabItem[],
    query: string,
    deviceFilter: DeviceType
  ): Array<TemplatesTabItem> {
    return templateCards.filter(({ id, name, device }) => {
      // Matches either the ID or name.
      const queryMatch =
        id.match(new RegExp(`${query}`, 'i')) ||
        name.match(new RegExp(`${query}`, 'i'));

      // And matches the device type (or all).
      const deviceMatch =
        deviceFilter === DeviceType.all || device === deviceFilter;

      return queryMatch && deviceMatch;
    });
  }

  createSelectionCallback(template: string): VoidFunction {
    return () => {
      store.dispatch(setSelectedTemplate(JSON.parse(template)));
      this.requestUpdate();
    };
  }

  /**
   * Sets the query property when an onsearch event is dispatched from the
   * searchbar widget.
   */
  handleSearch({ detail: { query } }: onSearchEvent) {
    this.query = query.trim();
  }

  handleDeviceFilters(device: DeviceType) {
    this.deviceFilter = device;
  }

  render() {
    const { query, deviceFilter, getTemplateCards, handleSearch } = this;

    const templateCards = getTemplateCards.call(this);

    const filteredTemplates = TemplatesTab.filterTemplates(
      templateCards,
      query,
      deviceFilter
    );

    const emptyNotice = html`
      <empty-notice
        id="empty-notice"
        icon="search"
        message='No templates match "${query}". Please search again.'
        size="large"
        bold
      ></empty-notice>
    `;

    const sortingChips = html`
      <div id="chips-container">
        ${chips.map(({ label, device }) => {
          return html`
            <paper-chip
              selectable
              class=${classMap({
                'selected-paper-chip': this.deviceFilter === device,
              })}
              @click=${() => {
                this.deviceFilter = device;
              }}
              >${label}</paper-chip
            >
          `;
        })}
      </div>
    `;

    return html`
      <tab-container title="Templates">
        <search-bar
          placeholder="Search for template (ie. side panel)"
          @onsearch=${handleSearch}
        ></search-bar>
        ${sortingChips}
        <div id="cards-container">
          ${filteredTemplates.map(({ markup }) => markup)}
          ${filteredTemplates.length === 0 ? emptyNotice : nothing}
        </div>
      </tab-container>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'templates-tab': TemplatesTab;
  }
}
