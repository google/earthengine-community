import {ToolBar} from '../tool-bar';
import {fixture, html} from '@open-wc/testing';

const assert = chai.assert;

suite('tool-bar', () => {
  test('is defined', () => {
    const el = document.createElement('tool-bar');
    assert.instanceOf(el, ToolBar);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<tool-bar></tool-bar>`);
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
