/**
 *  @fileoverview This file tests the attributes-tab widget.
 */
import { AttributesTab } from '../attributes-tab';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('attributes-tab', () => {
  test('is defined', () => {
    const el = document.createElement('attributes-tab');
    assert.instanceOf(el, AttributesTab);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<attributes-tab></attributes-tab>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });
});
