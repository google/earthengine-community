/**
 *  @fileoverview The draggable widget wraps around other widgets to make them draggable
 */
import { LitElement, html, customElement, css, property } from 'lit-element';
import '../tab-container/tab-container';
import '@polymer/iron-icons/editor-icons.js';

@customElement('draggable-widget')
export class DraggableWidget extends LitElement {
  static styles = css`
    #container {
      border: 0.8px dashed rgba(0, 0, 0, 0.3);
      border-radius: var(--tight);
      width: 90%;
      margin: var(--tight) 0px;
      position: relative;
      cursor: move;
    }

    .overlay {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  `;

  @property({ type: Boolean })
  hasOverlay = true;

  render() {
    const { hasOverlay } = this;

    const overlay = hasOverlay ? html`<div class="overlay"></div>` : null;
    return html`
      <div id="container" draggable="true">
        <slot></slot>
        ${overlay}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'draggable-widget': DraggableWidget;
  }
}
