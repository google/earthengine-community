/**
 *  @fileoverview This tests the ui-select widget.
 */
import { Select } from '../ui-select';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('ui-select', () => {
  test('is defined', () => {
    const el = document.createElement('ui-select');
    assert.instanceOf(el, Select);
  });

  test('renders widget with correct value', async () => {
    const value = 'Item 1';
    const el = await fixture(
      html`<ui-select items="Item 1, Item 2" } value="${value}"></ui-select>`
    );
    expect(el.shadowRoot!.textContent).to.include(value);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<ui-select></ui-select>`);
    expect(el.tagName).to.equal('UI-SELECT');
  });
});
