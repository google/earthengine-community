/**
 *  @fileoverview This file tests the search-bar widget.
 */
import { Searchbar } from '../search-bar';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('search-bar', () => {
  test('is defined', () => {
    const el = document.createElement('search-bar');
    assert.instanceOf(el, Searchbar);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<search-bar></search-bar>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<search-bar></search-bar>`);
    expect(el.tagName).to.equal('SEARCH-BAR');
  });
});
