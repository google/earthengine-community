/**
 *  @fileoverview This file tests the actions-panel widget.
 */
import { ActionsPanel } from '../actions-panel';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('actions-panel', () => {
  test('is defined', () => {
    const el = document.createElement('actions-panel');
    assert.instanceOf(el, ActionsPanel);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<actions-panel></actions-panel>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<actions-panel></actions-panel>`);
    expect(el.tagName).to.equal('ACTIONS-PANEL');
  });
});
