/**
 *  @fileoverview This file tests the widgets tab component
 *  which displays a list of widgets that the user can add
 *  to their templates
 */
import { WidgetsTab } from '../widgets-tab';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('widgets-tab', () => {
  test('is defined', () => {
    const el = document.createElement('widgets-tab');
    assert.instanceOf(el, WidgetsTab);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<widgets-tab></widgets-tab>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });
});
