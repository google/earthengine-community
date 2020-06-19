/**
 *  @fileoverview This file tests the ui-panel widget.
 */
import { Panel } from '../ui-panel';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('ui-panel', () => {
  test('is defined', () => {
    const el = document.createElement('ui-panel');
    assert.instanceOf(el, Panel);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<ui-panel></ui-panel>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<ui-panel></ui-panel>`);
    expect(el.tagName).to.equal('UI-PANEL');
  });
});
