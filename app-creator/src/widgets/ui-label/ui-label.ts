/**
 *  @fileoverview The ui-label widget is a text widget that allows users to add
 *  text to their templates
 */
import '@polymer/iron-label';
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';

@customElement('ui-label')
export class Label extends LitElement {
  static styles = css`
    p {
      margin: var(--tight) 0px;
      padding: 0px var(--tight);
    }

    .paragraph {
      font-size: 1rem;
    }

    .title {
      font-size: 1.6rem;
      font-weight: 600;
    }
  `;
  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = {};

  @property({ type: String }) value = '';

  @property({ type: String }) targetUrl = '';

  @property({ type: String })
  type = 'paragraph';

  render() {
    const contentClass = this.type === 'paragraph' ? 'paragraph' : 'title';
    return html` <iron-label
      class=${contentClass}
      style=${styleMap(this.styles)}
    >
      ${this.targetUrl
        ? html`<a
            href="${this.targetUrl}"
            target="_blank"
            rel="noopener noreferrer"
            ><p>${this.value}</p></a
          >`
        : html`<p>${this.value}</p>`}
    </iron-label>`;
  }

  getValue(): string {
    return this.value;
  }

  getUrl(): string {
    return this.targetUrl;
  }

  setValue(value: string): Label {
    this.value = value;
    return this;
  }

  setUrl(targetUrl: string): Label {
    this.targetUrl = targetUrl;
    return this;
  }

  getStyle(): object {
    return this.styles;
  }
}
