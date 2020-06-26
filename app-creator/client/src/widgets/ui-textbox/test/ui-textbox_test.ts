/**
 *  @fileoverview This file tests the ui-textbox widget.
 */
import { Textbox } from '../ui-textbox';
import { fixture, html, assert, expect } from '@open-wc/testing';

suite('ui-textbox', () => {
  test('is defined', () => {
    const el = document.createElement('ui-textbox');
    assert.instanceOf(el, Textbox);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<ui-textbox></ui-textbox>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<ui-select></ui-select>`);
    expect(el.tagName).to.equal('UI-SELECT');
  });
});
