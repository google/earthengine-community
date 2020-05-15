import {AppRoot} from '../app-root.js';
import {fixture, html} from '@open-wc/testing';

const assert = chai.assert;

suite('app-root', () => {
  test('is defined', () => {
    const el = document.createElement('app-root');
    assert.instanceOf(el, AppRoot);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<app-root></app-root>`);
    assert.shadowDom.equal(
      el,
      `
      <div id="app">
        <tool-bar></tool-bar>
        <div id="container"></div>
      </div>
    `
    );
  });
});
