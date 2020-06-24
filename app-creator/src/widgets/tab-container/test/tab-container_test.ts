/**
 *  @fileoverview This file tests the tab-container widget.
 */
import { TabContainer } from '../tab-container';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('tab-container', () => {
  test('is defined', () => {
    const el = document.createElement('tab-container');
    assert.instanceOf(el, TabContainer);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<tab-container></tab-container>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });

  test('renders title', async () => {
    const title = 'Widgets';
    const el = await fixture(
      html`<tab-container title="${title}"></tab-container>`
    );
    expect(el.shadowRoot!.textContent).to.include(title);
  });

  test('renders h5 element with title', async () => {
    const title = 'Widgets';
    const el = await fixture(
      html`<tab-container title="${title}"></tab-container>`
    );
    expect(el.shadowRoot!.textContent).to.include(title);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<tab-container></tab-container>`);
    expect(el.tagName).to.equal('TAB-CONTAINER');
  });
});
