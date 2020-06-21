/**
 *  @fileoverview This file tests the input-header widget.
 */
import { InputHeader } from '../input-header';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('input-header', () => {
  test('is defined', () => {
    const el = new InputHeader();
    assert.instanceOf(el, InputHeader);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<input-header></input-header>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<input-header></input-header>`);
    expect(el.tagName).to.equal('TOOL-BAR');
  });
});
