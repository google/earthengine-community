/**
 *  @fileoverview This file tests the ui-checkbox widget.
 */
import { Checkbox } from '../ui-checkbox';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('ui-checkbox', () => {
  test('is defined', () => {
    const el = document.createElement('ui-checkbox');
    assert.instanceOf(el, Checkbox);
  });

  test('renders widget with correct label', async () => {
    const label = 'Item';
    const el = await fixture(
      html`<ui-checkbox label="${label}"></ui-checkbox>`
    );
    expect(el.shadowRoot!.textContent).to.include(label);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<ui-checkbox></ui-checkbox>`);
    expect(el.tagName).to.equal('UI-CHECKBOX');
  });
});
