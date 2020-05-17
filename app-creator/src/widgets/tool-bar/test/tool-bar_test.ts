/**
 *  @fileoverview This file tests the tool-bar widget
 *  which contains the app title and export actions
 */
import { ToolBar } from '../tool-bar';
import { fixture, html, expect } from '@open-wc/testing';

const assert = chai.assert;

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
});
