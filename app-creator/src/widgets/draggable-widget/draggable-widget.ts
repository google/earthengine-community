import {LitElement, html, customElement, css} from 'lit-element';
import '../tab-container/tab-container';

@customElement('draggable-widget')
export class DraggableWidget extends LitElement {
  static styles = css`
    #container {
      border: 0.8px dashed rgba(0, 0, 0, 0.3);
      border-radius: var(--tight);
      cursor: move;
      width: 90%;
      margin: var(--tight) 0px;
    }
  `;

  render() {
    return html`<div
      id="container"
      draggable="true"
      @dragstart="${(e: DragEvent) => {
        console.log('dragstart', e.target);
      }}"
      @dragend="${(e: DragEvent) => {
        e.preventDefault();
      }}"
    >
      <slot></slot>
    </div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'draggable-widget': DraggableWidget;
  }
}
