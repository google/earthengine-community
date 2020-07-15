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

  test('renders empty notice when editing widget is null', async () => {
    const el = await fixture(html`<attributes-tab></attributes-tab>`);
    expect(el.shadowRoot!.querySelector('empty-notice')).to.exist;
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<attributes-tab></attributes-tab>`);
    expect(el.tagName).to.equal('ATTRIBUTES-TAB');
  });
});
