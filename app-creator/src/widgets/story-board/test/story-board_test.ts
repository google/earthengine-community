/**
 *  @fileoverview This file tests the story-board widget.
 */
import { Storyboard } from '../story-board';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('story-board', () => {
  test('is defined', () => {
    const el = document.createElement('story-board');
    assert.instanceOf(el, Storyboard);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<story-board></story-board>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<story-board></story-board>`);
    expect(el.tagName).to.equal('STORY-BOARD');
  });
});
