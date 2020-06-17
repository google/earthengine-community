/**
 *  @fileoverview The templates-tab widget contains the different templates that the user can use for their earth engine app.
 */
import {
  LitElement,
  html,
  customElement,
  css,
  TemplateResult,
  property,
} from 'lit-element';
import { nothing } from 'lit-html';
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
import { onSearchEvent } from '../search-bar/search-bar';
import { AppCreatorStore } from '../../redux/reducer';
import { store } from '../../redux/store';
import { setSelectedTemplate, setSelectedTab } from '../../redux/actions';
import { Tab } from '../../redux/types/enums';

interface TemplateItem {
  id: string;
  title: string;
  card: TemplateResult;
  initialState: AppCreatorStore['template'];
  markup: string;
}

@customElement('templates-tab')
export class TemplatesTab extends LitElement {
  static styles = css`
    .subtitle {
      margin: var(--regular) 0px var(--tight) 0px;
      color: var(--accent-color);
    }

    .card-image {
      height: 120px;
      background-size: cover;
      background-position: center;
      border-bottom: var(--light-border);
      overflow: hidden;
    }

    .card-container {
      border: var(--light-border);
      border-radius: var(--tight);
      overflow: hidden;
    }

    .card-actions {
      display: flex;
      justify-content: flex-end;
      padding: var(--extra-tight);
    }

    #cards-container {
      margin-top: var(--regular);
    }
  `;

  static templates: { [key: string]: TemplateItem } = {
    'side-panel': {
      id: 'side-panel',
      title: 'Side Panel',
      card: html`
        <h6 class="subtitle">Side Panel</h6>
        <div class="card-container">
          <div
            class="card-image"
            style="background: url(https://miro.medium.com/max/552/0*aR2TiedsgbC4n0uQ)"
          ></div>
          <div class="card-actions">
            <paper-button
              @click=${() => {
                store.dispatch(
                  setSelectedTemplate(
                    TemplatesTab.templates['side-panel'].initialState,
                    TemplatesTab.templates['side-panel'].markup
                  )
                );
                store.dispatch(setSelectedTab(Tab.widgets));
              }}
              >Select</paper-button
            >
          </div>
          <div></div>
        </div>
      `,
      initialState: {
        templateID: 'side-panel',
        'panel-template-0': {
          id: 'panel-template-0',
          children: ['panel-template-1', 'map-template-0'],
          uniqueAttributes: {
            layout: 'row',
          },
          style: {
            height: '100%',
            width: '100%',
            padding: '0px',
            margin: '0px',
          },
        },
        'panel-template-1': {
          id: 'panel-template-1',
          children: [],
          uniqueAttributes: {
            layout: 'column',
            hasDropzone: 'true',
          },
          style: {
            height: '100%',
            width: '40%',
            padding: '0px',
            margin: '0px',
            color: 'black',
            backgroundColor: '#FFFFFF',
            borderWidth: '0px',
            borderStyle: 'solid',
            borderColor: 'black',
            fontSize: '12px',
            fontWeight: '300',
            fontFamily: 'Roboto',
            textAlign: 'left',
            whiteSpace: 'normal',
            shown: 'true',
          },
        },
        'map-template-0': {
          id: 'map-template-0',
          children: [],
          uniqueAttributes: {},
          style: {
            height: '100%',
            width: '60%',
          },
        },
      },
      markup: `
        <ui-panel>
          <ui-panel id="panel-template-1" style="width: 30%;" class="full-height" editable>
            <dropzone-widget class="full-height"></dropzone-widget>
          </ui-panel>
          <ui-map
            id="map-template-0"
            editable
<<<<<<< HEAD
            class="full-width"
=======
            style="width: 100%;"
>>>>>>> added templates tab and card
            apiKey=${window.process.env.MAPS_API_KEY}
            zoom="4"
          ></ui-map>
        </ui-panel>
      `,
    },
  };

  /**
   * Sets the search query.
   */
  @property({ type: String }) query = '';

  render() {
    const { query, filterTemplates, handleSearch } = this;
    const filteredTemplates: TemplateItem[] = filterTemplates(query);
    const emptyNotice =
      filteredTemplates.length === 0
        ? html`
            <empty-notice
              id="empty-notice"
              icon="search"
              message="No templates available. Please search again."
              size="large"
              bold
            ></empty-notice>
          `
        : nothing;

    return html`
      <tab-container title="Templates">
        <search-bar
          placeholder="Search for template"
          @onsearch=${handleSearch}
        ></search-bar>
        <div id="cards-container">
          ${filteredTemplates.map(({ card }) => card)} ${emptyNotice}
        </div>
      </tab-container>
    `;
  }

  /**
   * Returns widgets with names and ids that include the search query.
   */
  filterTemplates(query: string): TemplateItem[] {
    return Object.values(TemplatesTab.templates).filter(({ id, title }) => {
      const lowerCasedQuery = query.toLowerCase();
      return (
        id.toLowerCase().includes(lowerCasedQuery) ||
        title.toLowerCase().includes(lowerCasedQuery)
      );
    });
  }

  /**
   * Sets the query property when an onsearch event is dispatched from the
   * searchbar widget.
   */
  handleSearch({ detail: { query } }: onSearchEvent) {
    this.query = query;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'templates-tab': TemplatesTab;
  }
}
