/**
 *  @fileoverview This file tests the draggable-widget which wraps
 *  other widgets to make them draggable
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
});
