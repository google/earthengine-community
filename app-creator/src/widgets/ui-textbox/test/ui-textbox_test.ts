/**
 *  @fileoverview This file tests the ui-textbox widget.
 */
import { Textbox } from '../ui-textbox';
import { fixture, html, assert } from '@open-wc/testing';

suite('ui-textbox', () => {
  test('is defined', () => {
    const el = document.createElement('ui-textbox');
    assert.instanceOf(el, Textbox);
  });

  test('renders widget with correct label', async () => {
    const label = 'Item';
    const el = await fixture(html`<ui-textbox label="${label}"></ui-textbox>`);
    assert.shadowDom.equal(
      el,
      `
    <paper-input
      aria-disabled="false"
      no-float-label=""
      label="${label}"
      style=""
      tabindex="0"
      type="text"
      value=""
      ></paper-input>
    `
    );
  });
});
