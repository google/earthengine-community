/**
 *  @fileoverview This file tests the app-root widget
 *  which is the root level component of our application
 */
import { AppRoot } from '../app-root.js';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('app-root', () => {
  test('is defined', () => {
    const el = document.createElement('app-root');
    assert.instanceOf(el, AppRoot);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<app-root></app-root>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<app-root></app-root>`);
    expect(el.tagName).to.equal('APP-ROOT');
  });
});
