import {ActionsPanel} from '../actions-panel';
import {fixture, html} from '@open-wc/testing';

const assert = chai.assert;

suite('actions-panel', () => {
  test('is defined', () => {
    const el = document.createElement('actions-panel');
    assert.instanceOf(el, ActionsPanel);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<actions-panel></actions-panel>`);
    assert.shadowDom.equal(
      el,
      `
      <div id="container">
        <h3>
          <strong id="app-title-prefix">Google Earth Engine</strong>
          <span id="app-title-suffix">App Creator</span>
        </h3>
      </div>
    `
    );
  });
});
