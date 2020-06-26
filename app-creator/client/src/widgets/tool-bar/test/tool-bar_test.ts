/**
 *  @fileoverview This file tests the tool-bar widget
 *  which contains the app title and export actions
 */
import { ToolBar } from '../tool-bar';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('tool-bar', () => {
  test('is defined', () => {
    const el = new ToolBar();
    assert.instanceOf(el, ToolBar);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<tool-bar></tool-bar>`);
    expect(el.shadowRoot!.textContent).to.include(ToolBar.prefix);
    expect(el.shadowRoot!.textContent).to.include(ToolBar.suffix);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<tool-bar></tool-bar>`);
    expect(el.tagName).to.equal('TOOL-BAR');
  });
});
