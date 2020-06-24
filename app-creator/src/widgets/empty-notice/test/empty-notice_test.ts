/**
 *  @fileoverview This file tests the empty-notice widget.
 */
import { EmptyNotice } from '../empty-notice';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('empty-notice', () => {
  test('is defined', () => {
    const el = document.createElement('empty-notice');
    assert.instanceOf(el, EmptyNotice);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<empty-notice></empty-notice>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<empty-notice></empty-notice>`);
    expect(el.tagName).to.equal('EMPTY-NOTICE');
  });
});
