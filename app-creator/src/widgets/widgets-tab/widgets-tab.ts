/**
 *  @fileoverview The widgets-tab component contains the different widgets that the user can add to their
 *  template
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
import '../search-bar/search-bar';
import '../empty-notice/empty-notice';
import { onSearchEvent } from '../search-bar/search-bar';

interface WidgetItem {
  id: string;
  name: string;
  markup: TemplateResult;
}

@customElement('widgets-tab')
export class WidgetsTab extends LitElement {
  static styles = css`
    .subtitle {
      margin: var(--regular) 0px var(--tight) 0px;
      color: var(--accent-color);
    }
  `;

  /**
   * A list of widgets that the user can add to their template.
   */
  static widgets: WidgetItem[] = [
    {
      id: 'ui-label',
      name: 'text',
      markup: html`<h6 class="subtitle">Text</h6>
        <draggable-widget>
          <ui-label
            id="label"
            value="Google Earth Engine combines a multi-petabyte catalog of satellite imagery and geospatial datasets with planetary-scale analysis capabilities and makes it available for scientists, researchers, and developers to detect changes, map trends, and quantify differences on the Earth's surface."
          ></ui-label>
        </draggable-widget> `,
    },
    {
      id: 'ui-button',
      name: 'button',
      markup: html`<h6 class="subtitle">Button</h6>
        <draggable-widget .hasOverlay=${false}>
          <ui-button id="button" label="Button"></ui-button>
        </draggable-widget>`,
    },
    {
      id: 'ui-select',
      name: 'select',
      markup: html`<h6 class="subtitle">Select</h6>
        <draggable-widget>
          <ui-select
            id="select"
            .items=${'Item 1, Item 2'}
            placeholder="Select Item"
          ></ui-select>
        </draggable-widget>`,
    },
    {
      id: 'ui-textbox',
      name: 'textbox',
      markup: html`<h6 class="subtitle">Textbox</h6>
        <draggable-widget>
          <ui-textbox
            id="textbox"
            label=""
            placeholder="Enter text"
            no-label-float
          ></ui-textbox>
        </draggable-widget>`,
    },
    {
      id: 'ui-slider',
      name: 'slider',
      markup: html`<h6 class="subtitle">Slider</h6>
        <draggable-widget>
          <ui-slider id="slider" label="Item"></ui-slider>
        </draggable-widget>`,
    },
    {
      id: 'ui-checkbox',
      name: 'checkbox',
      markup: html`<h6 class="subtitle">Checkbox</h6>
        <draggable-widget .hasOverlay=${false}>
          <ui-checkbox id="checkbox" label="Item"></ui-checkbox>
        </draggable-widget>`,
    },
  ];

  /**
   * Sets the search query.
   */
  @property({ type: String }) query = '';

  render() {
    const { query, filterWidgets, handleSearch } = this;
    const filteredWidgets: WidgetItem[] = filterWidgets(query);
    const emptyNotice =
      filteredWidgets.length === 0
        ? html`
            <empty-notice
              id="empty-notice"
              icon="search"
              message="No widgets available. Please search again."
              size="large"
              bold
            ></empty-notice>
          `
        : nothing;

    return html`
      <tab-container title="Widgets">
        <search-bar @onsearch=${handleSearch}></search-bar>
        ${filteredWidgets.map(({ markup }) => markup)} ${emptyNotice}
      </tab-container>
    `;
  }

  /**
   * Returns widgets with names and ids that include the search query.
   */
  filterWidgets(query: string): WidgetItem[] {
    return WidgetsTab.widgets.filter(({ id, name }) => {
      const lowerCasedQuery = query.toLowerCase();
      return (
        id.toLowerCase().includes(lowerCasedQuery) ||
        name.toLowerCase().includes(lowerCasedQuery)
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
    'widgets-tab': WidgetsTab;
  }
}
