/**
 *  @fileoverview The app-root widget is the starting point of our application
 *  in which all other widgets are rendered
 */
import {
  LitElement,
  html,
  customElement,
  css,
  property,
  query,
} from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { nothing } from 'lit-html';
import { PaperToastElement } from '@polymer/paper-toast/paper-toast.js';
import { PaperDialogElement } from '@polymer/paper-dialog/paper-dialog.js';
import { onSearchEvent } from './search-bar/search-bar';
import { TemplatesTab, TemplatesTabItem } from './templates-tab/templates-tab';
import { store } from '../redux/store';
import { setSelectedTemplate } from '../redux/actions';
import { TemplateItem } from '../client/fetch-templates';
import { templatesManager } from '../data/templates';
import { DeviceType } from '../redux/types/enums';
import { chips } from '../utils/helpers';
import './tool-bar/tool-bar';
import './actions-panel/actions-panel';
import './tab-container/tab-container';
import './story-board/story-board';
import './search-bar/search-bar';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-toast/paper-toast.js';
import '@cwmr/paper-chip/paper-chip.js';

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
      height: 90%;
      width: 90%;
    }

    #storyboard-container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }

    #cards-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      margin-top: var(--regular);
    }

    template-card {
      width: 200px;
      margin: var(--regular);
    }

    paper-dialog {
      width: 800px;
      height: 500px;
      padding: var(--regular);
      border-radius: var(--tight);
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: scroll;
    }

    #header-content {
      width: 400px;
    }

    .subtitle {
      margin: 0;
      font-size: 1rem;
      color: var(--accent-color);
      font-weight: 500;
    }

    #modal-title {
      text-align: center;
      font-weight: 500;
      color: var(--accent-color);
    }

    paper-progress {
      width: 100%;
      height: 20px;
      z-index: 10;
      position: absolute;
      top: 0;
      left: 0;
      margin: 0px;
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

  /**
   * Sets template dialog search query.
   */
  @property({ type: String }) query = '';

  /**
   * Sets device filter.
   */
  @property({ type: String }) deviceFilter: DeviceType = DeviceType.all;

  /**
   * Array of templates.
   */
  @property({ type: Array }) templates: TemplateItem[] = [];

  /**
   * Loading state.
   */
  @property({ type: Boolean }) loading = false;

  /**
   * Reference to dialog element.
   */
  @query('paper-dialog') dialog!: PaperDialogElement;

  async firstUpdated() {
    try {
      this.loading = true;

      const templates = await templatesManager.fetchTemplates(false);
      if (templates != null) {
        this.templates = templates;
      }
    } catch (e) {
      const fetchErrorToast = this.shadowRoot?.getElementById(
        'fetch-error-toast'
      ) as PaperToastElement;

      if (fetchErrorToast != null) {
        fetchErrorToast.open();
      }
      this.templates = templatesManager.getTemplates();
    } finally {
      this.loading = false;
    }
    this.showTemplateSelectionModal();
  }

  showTemplateSelectionModal() {
    this.dialog.open();
  }

  createSelectionCallback(template: string): VoidFunction {
    return () => {
      const { dialog } = this;
      if (dialog != null) {
        dialog.close();
        store.dispatch(setSelectedTemplate(JSON.parse(template)));
      }
    };
  }

  getTemplateCards(showTitle = false): Array<TemplatesTabItem> {
    return this.templates.map(({ id, name, imageUrl, device, template }) => {
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
   * Sets the query property when an onsearch event is dispatched from the
   * searchbar widget.
   */
  handleSearch({ detail: { query } }: onSearchEvent) {
    this.query = query.trim();
  }

  render() {
    const {
      handleSearch,
      getTemplateCards,
      deviceFilter,
      query,
      loading,
    } = this;

    const templateCards = getTemplateCards.call(this, true);
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

    const contentMarkup = loading
      ? nothing
      : html`
          <div id="cards-container">
            ${filteredTemplates.map(({ markup }) => markup)}
            ${filteredTemplates.length === 0 ? emptyNotice : nothing}
          </div>
        `;

    const loadingBar = loading
      ? html`<paper-progress indeterminate></paper-progress>`
      : nothing;

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
      <div id="app">
        <tool-bar></tool-bar>
        <div id="container">
          <actions-panel></actions-panel>
          <div id="storyboard-container">
            <story-board id="storyboard"></story-board>
          </div>

          <paper-dialog with-backdrop no-cancel-on-outside-click>
            ${loadingBar}
            <div id="header-content">
              <h2 id="modal-title">Select Template</h2>
              <search-bar
                placeholder="Search for template (i.e. side panel)"
                @onsearch=${handleSearch}
              ></search-bar>
              ${sortingChips}
            </div>
            ${contentMarkup}
          </paper-dialog>

          <paper-toast
            id="fetch-error-toast"
            text="Unable to fetch the latest templates from the server."
          ></paper-toast>
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
