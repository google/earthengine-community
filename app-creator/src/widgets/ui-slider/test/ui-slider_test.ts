/**
 *  @fileoverview This file tests the ui-slider widget.
 */
import { Slider } from '../ui-slider';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('ui-slider', () => {
  test('is defined', () => {
    const el = document.createElement('ui-slider');
    assert.instanceOf(el, Slider);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<ui-slider></ui-slider>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });
});
