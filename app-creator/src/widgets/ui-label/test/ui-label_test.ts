/**
 *  @fileoverview This file tests the ui-label widget.
 */
import { Label } from '../ui-label';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('ui-label', () => {
  test('is defined', () => {
    const el = document.createElement('ui-label');
    assert.instanceOf(el, Label);
  });

  test('renders widget', async () => {
    const title = 'Title';
    const el = await fixture(html`<ui-label value="${title}"></ui-label>`);
    expect(el.shadowRoot!.textContent).to.include(title);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<ui-label></ui-label>`);
    expect(el.tagName).to.equal('UI-LABEL');
  });
});
