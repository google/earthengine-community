/**
 *  @fileoverview The input-header widget contains a title and an optional tool-tip
 *  to describe an input field.
 */
import { LitElement, html, customElement, css, property } from 'lit-element';
import '@polymer/paper-tooltip/paper-tooltip.js';

@customElement('input-header')
export class InputHeader extends LitElement {
  static styles = css`
    #container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    #info-icon {
      color: var(--accent-color);
      cursor: pointer;
      margin: 0px;
    }

    #info-icon:hover {
      opacity: 0.5;
    }

    #input-label {
      margin: 0px 0px;
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--accent-color);
    }

    #info-icon {
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background-color: #bbb;
      color: white;
      font-size: 13px;
      font-style: italic;
      font-family: none;
    }
    #info-icon:after {
      content: 'i';
      color: white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  `;

  /**
   * Sets input header title.
   */
  @property({ type: String }) title = '';

  /**
   * Sets input header tooltip.
   */
  // @property({ type: Object }) tooltip: Tooltip | typeof emptyObj = emptyObj;

  handleInfoClick() {
    console.log('info clicked');
  }

  render() {
    const { title } = this;

    // const tooltipMarkup =
    //   tooltip === emptyObj
    //     ? nothing
    //     : html`<p @click=${handleInfoClick} id="info-icon">i</p>
    //         <paper-tooltip for="info-icon" position="top" animation-delay="0"
    //           >${'text' in tooltip ? tooltip.text : nothing}
    //           ${
    //             'url' in tooltip && tooltip.url != null
    //               ? html`<a href="${tooltip.url}">${tooltip.url}</a>`
    //               : nothing
    //           }</paper-tooltip
    //         ></paper-tooltip>`;
    return html`
      <div id="container">
        <p id="input-label">${title}</p>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'input-header': InputHeader;
  }
}
