/**
 *  @fileoverview This file tests the ui-map widget.
 */
import { Map } from '../ui-map';
import { assert } from '@open-wc/testing';

suite('ui-map', () => {
  test('is defined', () => {
    const el = document.createElement('ui-map');
    assert.instanceOf(el, Map);
  });
});
