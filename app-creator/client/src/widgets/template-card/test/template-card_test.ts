/**
 *  @fileoverview This file tests the template-card widget.
 */
import { TemplateCard } from '../template-card';
import { fixture, html, expect, assert } from '@open-wc/testing';

suite('template-card', () => {
  test('is defined', () => {
    const el = new TemplateCard();
    assert.instanceOf(el, TemplateCard);
  });

  test('renders widget', async () => {
    const el = await fixture(html`<template-card></template-card>`);
    expect(el.shadowRoot!.childNodes.length).to.be.greaterThan(0);
  });
});
