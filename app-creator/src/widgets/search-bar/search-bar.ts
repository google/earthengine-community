/**
 *  @fileoverview The search-bar widget allows users to filter through different elements
 *  using a search query.
 */
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { debounce } from '../../utils/debounce';

export interface onSearchEvent {
  detail: {
    query: string;
  };
}

@customElement('search-bar')
export class Searchbar extends LitElement {
  constructor() {
    super();
    this.debouncedSearchEvent = debounce(this, this.dispatchSearchEvent, 300);
  }

  static styles = css`
    #container {
      width: calc(100% - 2 * var(--tight));
      border: 0.7px solid rgba(0, 0, 0, 0.3);
      padding: var(--tight);
      border-radius: var(--regular-border-radius);
      height: 15px;
      align-items: center;
      display: flex;
    }

    #search-icon {
      color: rgba(0, 0, 0, 0.3);
      margin-right: var(--extra-tight);
      --iron-icon-height: 18px;
      --iron-icon-width: 18px;
    }

    #search-input {
      border: none;
      height: 15px;
      font-size: 0.8rem;
      width: 100%;
    }

    #search-input:focus {
      outline: none;
    }
  `;

  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = {};

  /**
   * Sets search bar placeholder.
   */
  @property({ type: String }) placeholder = 'Search...';

  /**
   * Callback triggered on input change.
   */
  @property({ type: Object })
  debouncedSearchEvent: ({
    target,
  }: {
    target: EventTarget;
  }) => void = () => {};

  render() {
    const { placeholder, styles, debouncedSearchEvent } = this;
    return html`
      <div id="container" style=${styleMap(styles)}>
        <iron-icon id="search-icon" icon="search"></iron-icon>
        <input
          id="search-input"
          type="text"
          placeholder="${placeholder}"
          @keyup=${debouncedSearchEvent}
        />
      </div>
    `;
  }

  /**
   * Dispatches onsearch event when input query changes.
   */
  dispatchSearchEvent({ target }: { target: EventTarget }) {
    const event = new CustomEvent('onsearch', {
      bubbles: true,
      cancelable: true,
      detail: {
        query: (target as HTMLInputElement).value,
      },
    });
    this.dispatchEvent(event);
  }

  getStyle(): object {
    return this.styles;
  }
}
