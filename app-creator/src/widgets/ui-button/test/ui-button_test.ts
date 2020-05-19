/**
 *  @fileoverview This file tests the ui-button widget which enables users to add a buttons to their templates
 */
import { Button } from '../ui-button';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('ui-button', () => {
  test('is defined', () => {
    const el = document.createElement('ui-button');
    assert.instanceOf(el, Button);
  });

  test('renders widget with correct label', async () => {
    const label = 'Button';
    const el = await fixture(html`<ui-button label="${label}"></ui-button>`);
    expect(el.shadowRoot!.textContent).to.include(label);
  });
});
