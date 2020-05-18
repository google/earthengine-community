/**
 *  @fileoverview The widgets-tab component contains the different widgets that the user can add to their
 *  template
 */
import { LitElement, html, customElement, css } from 'lit-element';
import '../tab-container/tab-container';
import '../draggable-widget/draggable-widget';
import '../ui-label/ui-label';
import './tab-subtitle/tab-subtitle';

@customElement('widgets-tab')
export class WidgetsTab extends LitElement {
  static styles = css`
    .subtitle {
      margin: var(--regular) 0px var(--tight) 0px;
    }
  `;

  render() {
    return html`
      <tab-container title="Widgets">
        <h5 class="subtitle">Text</h5>
        <draggable-widget>
          <ui-label type="title" value="Title"></ui-label>
        </draggable-widget>
        <draggable-widget>
          <ui-label
            type="paragraph"
            value="Lorem Khaled Ipsum is a major key to success. Surround yourself with angels, positive energy, beautiful people, beautiful souls, clean heart, angel. To succeed you must believe. When you believe, you will succeed. The other day the grass was brown, now it’s green because I ain’t give up. Never surrender. Stay focused. Major key, don’t fall for the trap, stay focused."
          ></ui-label>
        </draggable-widget>
      </tab-container>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'widgets-tab': WidgetsTab;
  }
}
