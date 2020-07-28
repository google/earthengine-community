/**
 *  @fileoverview This file tests the ui-sidemenu widget.
 */
import { SideMenu } from '../ui-sidemenu';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('ui-sidemenu', () => {
  test('is defined', () => {
    const el = document.createElement('ui-sidemenu');
    assert.instanceOf(el, SideMenu);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<ui-sidemenu></ui-sidemenu>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<ui-sidemenu></ui-sidemenu>`);
    expect(el.tagName).to.equal('UI-SIDEMENU');
  });
});
