/**
 *  @fileoverview This file tests the ui-label widget
 *  which is used to add text to the user's template
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
});
