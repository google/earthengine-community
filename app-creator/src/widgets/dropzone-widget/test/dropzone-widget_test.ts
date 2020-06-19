/**
 *  @fileoverview This file tests the dropzone-widget.
 */
import { Dropzone } from '../dropzone-widget';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('dropzone-widget', () => {
  test('is defined', () => {
    const el = document.createElement('dropzone-widget');
    assert.instanceOf(el, Dropzone);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<dropzone-widget></dropzone-widget>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<dropzone-widget></dropzone-widget>`);
    expect(el.tagName).to.equal('DROPZONE-WIDGET');
  });
});
