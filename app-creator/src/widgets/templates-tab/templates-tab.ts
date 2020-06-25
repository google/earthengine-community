/**
 *  @fileoverview The templates-tab widget contains the different templates that the user can use for their earth engine app.
 */
import { LitElement, html, customElement, css, property } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
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
import '../template-card/template-card';
import { store } from '../../redux/store';
import { setSelectedTemplate } from '../../redux/actions';
import { database } from '../../client/fetch-templates';

export interface TemplatesTabItem {
  id: string;
  name: string;
  markup: TemplateResult;
}

@customElement('templates-tab')
export class TemplatesTab extends LitElement {
  static styles = css`
    .subtitle {
      margin: var(--regular) 0px var(--tight) 0px;
      color: var(--accent-color);
    }

    #cards-container {
      margin-top: var(--regular);
    }
  `;

  /**
   * Sets the search query.
   */
  @property({ type: String }) query = '';

  getTemplateCards(showTitle = false) {
    return database.map(({ id, name, imageUrl, template }) => {
      return {
        id,
        name,
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
    templateCards: { id: string; name: string; markup: TemplateResult }[],
    query: string
  ): Array<TemplatesTabItem> {
    return templateCards.filter(({ id, name }) => {
      const lowerCasedQuery = query.toLowerCase();
      return (
        id.toLowerCase().includes(lowerCasedQuery) ||
        name.toLowerCase().includes(lowerCasedQuery)
      );
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

  render() {
    const { query, getTemplateCards, handleSearch } = this;

    const templateCards = getTemplateCards.call(this);

    const filteredTemplates = TemplatesTab.filterTemplates(
      templateCards,
      query
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

    return html`
      <tab-container title="Templates">
        <search-bar
          placeholder="Search for template (ie. side panel)"
          @onsearch=${handleSearch}
        ></search-bar>
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
