/**
 *  @fileoverview The ui-label widget is a text widget that allows users to add
 *  text to their templates.
 */
import '@polymer/iron-label';
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import {
  DEFAULT_SHARED_ATTRIBUTES,
  AttributeMetaData,
  DefaultAttributesType,
  getDefaultAttributes,
} from '../../redux/types/attributes';
import { InputType } from '../../redux/types/enums';

@customElement('ui-label')
export class Label extends LitElement {
  static styles = css`
    .paragraph {
      font-size: 0.7rem;
    }

    .title {
      font-size: 1rem;
      font-weight: 600;
    }

    a {
      text-decoration: none;
      color: inherit;
    }
  `;

  static attributes: AttributeMetaData = {
    value: {
      value:
        "Google Earth Engine combines a multi-petabyte catalog of satellite imagery and geospatial datasets with planetary-scale analysis capabilities and makes it available for scientists, researchers, and developers to detect changes, map trends, and quantify differences on the Earth's surface.",
      placeholder: 'Enter text',
      type: InputType.textarea,
    },
    targetUrl: {
      value: '',
      placeholder: 'https://www.website.com',
      type: InputType.text,
    },
  };

  static DEFAULT_LABEL_ATTRIBUTES: DefaultAttributesType = getDefaultAttributes(
    Label.attributes
  );

  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = DEFAULT_SHARED_ATTRIBUTES;

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
    const { type } = this;
    return html`
      <iron-label class="${type}">
        ${this.targetUrl
          ? html`<a
              href="${this.targetUrl}"
              target="_blank"
              rel="noopener noreferrer"
              ><p style="${styleMap(this.styles)}">${this.value}</p></a
            >`
          : html`<p style="${styleMap(this.styles)}">
              ${this.value}
            </p>`}
      </iron-label>
    `;
  }

  getValue(): string {
    return this.value;
  }

  getUrl(): string {
    return this.targetUrl;
  }

  getStyle(): object {
    return this.styles;
  }

  setAttribute(key: string, value: string) {
    switch (key) {
      case 'value':
        this.value = value;
        return;
      case 'targetUrl':
        this.targetUrl = value;
        return;
    }
  }

  setStyle(style: { [key: string]: string }) {
    this.styles = style;
    this.requestUpdate();
  }
}
