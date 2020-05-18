import {LitElement, html, customElement} from 'lit-element';
import '../tab-container/tab-container';
import '../draggable-widget/draggable-widget';
import '../ui-label/ui-label';
import './../tab-subtitle/tab-subtitle';
import '../ui-button/ui-button';
import '../ui-select/ui-select';
import '../ui-map/ui-map';

@customElement('widgets-tab')
export class WidgetsTab extends LitElement {
  render() {
    return html`
      <tab-container title="Widgets">
        <tab-subtitle value="Text"></tab-subtitle>
        <draggable-widget>
          <ui-label
            value="Title"
            .styles=${{fontSize: '1.6rem', fontWeight: '600'}}
          ></ui-label>
        </draggable-widget>
        <draggable-widget>
          <ui-label
            value="Lorem Khaled Ipsum is a major key to success. Surround yourself with angels, positive energy, beautiful people, beautiful souls, clean heart, angel. To succeed you must believe. When you believe, you will succeed. The other day the grass was brown, now it’s green because I ain’t give up. Never surrender. Stay focused. Major key, don’t fall for the trap, stay focused."
            .styles=${{
              fontSize: '1rem',
            }}
          ></ui-label>
        </draggable-widget>
        <tab-subtitle value="Button"></tab-subtitle>
        <draggable-widget>
          <ui-button label="button"></ui-button>
        </draggable-widget>
        <tab-subtitle value="Select"></tab-subtitle>
        <draggable-widget>
          <ui-select
            placeholder="Select an item"
            .items="${['Item 1', 'Item 2']}"
          ></ui-select>
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
