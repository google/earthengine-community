/**
 *  @fileoverview This file tests the draggable-widget.
 */
import { DraggableWidget } from '../draggable-widget';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('draggable-widget', () => {
  test('is defined', () => {
    const el = document.createElement('draggable-widget');
    assert.instanceOf(el, DraggableWidget);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<draggable-widget></draggable-widget>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<draggable-widget></draggable-widget>`);
    expect(el.tagName).to.equal('DRAGGABLE-WIDGET');
  });
});
