/**
 *  @fileoverview This file tests the templates-tab widget.
 */
import { TemplatesTab } from '../templates-tab';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('templates-tab', () => {
  test('is defined', () => {
    const el = document.createElement('templates-tab');
    assert.instanceOf(el, TemplatesTab);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<templates-tab></templates-tab>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });
});
