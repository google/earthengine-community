/**
 *  @fileoverview The ui-label widget is a text widget that allows users to add
 *  text to their templates.
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
      font-size: 0.8rem;
    }

    .title {
      font-size: 1.4rem;
      font-weight: 600;
    }

    a {
      text-decoration: none;
      color: inherit;
    }
  `;

  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = {};

  /**
   * Sets the value of the label.
   */
  @property({ type: String }) value = '';

  /**
   * If set, the label turns into a link that
   * leads to the target url.
   */
  @property({ type: String }) targetUrl = '';

  /**
   * Sets pre-defined styles for the specified type (ie. paragraph, title).
   */
  @property({ type: String })
  type = 'paragraph';

  render() {
    console.log('rendering..');
    const { type } = this;
    return html`
      <iron-label class=${type} style=${styleMap(this.styles)}>
        ${this.targetUrl
          ? html`<a
              href="${this.targetUrl}"
              target="_blank"
              rel="noopener noreferrer"
              ><p>${this.value}</p></a
            >`
          : html`<p>${this.value}</p>`}
      </iron-label>
    `;
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
