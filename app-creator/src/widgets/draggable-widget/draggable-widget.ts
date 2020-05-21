/**
 *  @fileoverview The draggable-widget wraps other widgets to make them draggable.
 */
import { LitElement, html, customElement, css, property } from 'lit-element';
import { nothing } from 'lit-html';
import '../tab-container/tab-container';
import '@polymer/iron-icons/editor-icons.js';

@customElement('draggable-widget')
export class DraggableWidget extends LitElement {
  /**
   * Additional custom styles.
   */
  static styles = css`
    #container {
      border: 0.8px dashed rgba(0, 0, 0, 0.3);
      border-radius: var(--tight);
      width: 100%;
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

  /**
   * Determines if widget should have a draggable overlay.
   */
  @property({ type: Boolean })
  hasOverlay = true;

  render() {
    const { hasOverlay } = this;

    const overlay = hasOverlay ? html`<div class="overlay"></div>` : nothing;

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
