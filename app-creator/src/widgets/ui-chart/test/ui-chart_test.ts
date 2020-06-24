/**
 *  @fileoverview This file tests the ui-chart widget.
 */
import { Chart } from '../ui-chart';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('ui-chart', () => {
  test('is defined', () => {
    const el = document.createElement('ui-chart');
    assert.instanceOf(el, Chart);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<ui-chart></ui-chart>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<ui-chart></ui-chart>`);
    expect(el.tagName).to.equal('UI-CHART');
  });
});
