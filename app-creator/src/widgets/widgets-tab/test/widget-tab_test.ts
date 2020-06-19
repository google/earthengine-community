/**
 *  @fileoverview This file tests the widgets-tab.
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

  test('filtering widgets', async () => {
    const widgetsTab = new WidgetsTab();
    const checkbox = Object.assign(
      {},
      WidgetsTab.widgets.find(({ name }) => name === 'checkbox')
    );
    expect(widgetsTab.filterWidgets('')).to.deep.equal(WidgetsTab.widgets);
    expect(widgetsTab.filterWidgets('does not exist')).to.deep.equal([]);
    expect(widgetsTab.filterWidgets('checkbox')).to.deep.equal([checkbox]);
  });

  test('renders correct tag', async () => {
    const el = await fixture(html`<widget-tab></widget-tab>`);
    expect(el.tagName).to.equal('WIDGET-TAB');
  });
});
