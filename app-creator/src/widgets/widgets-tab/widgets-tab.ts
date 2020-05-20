/**
 *  @fileoverview The widgets-tab component contains the different widgets that the user can add to their
 *  template
 */
import { LitElement, html, customElement, css } from 'lit-element';
import '../tab-container/tab-container';
import '../draggable-widget/draggable-widget';
import '../ui-label/ui-label';
import '../ui-button/ui-button';
import '../ui-select/ui-select';
import '../ui-checkbox/ui-checkbox';
import '../ui-textbox/ui-textbox';

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
            value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          ></ui-label>
        </draggable-widget>
        <h5 class="subtitle">Button</h5>
        <draggable-widget .hasOverlay=${false}>
          <ui-button label="Button"></ui-button>
        </draggable-widget>
        <h5 class="subtitle">Select</h5>
        <draggable-widget .hasOverlay=${false}>
          <ui-select
            .items=${['Item 1', 'Item 2']}
            placeholder="Select Item"
          ></ui-select>
        </draggable-widget>
        <h5 class="subtitle">Textbox</h5>
        <draggable-widget>
          <ui-textbox label="Enter text"></ui-textbox>
        </draggable-widget>
        <h5 class="subtitle">Checkbox</h5>
        <draggable-widget .hasOverlay=${false}>
          <ui-checkbox label="Item"></ui-checkbox>
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
