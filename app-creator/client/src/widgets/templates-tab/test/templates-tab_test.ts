/**
 *  @fileoverview This file tests the templates-tab widget.
 */
import { TemplatesTab } from '../templates-tab';
import { html, expect, assert } from '@open-wc/testing';
import { DeviceType } from '../../../redux/types/enums';

suite('templates-tab', () => {
  test('is defined', () => {
    const el = document.createElement('templates-tab');
    assert.instanceOf(el, TemplatesTab);
  });

  suite('filter template cards', () => {
    test('Empty query for all devices', () => {
      const result = TemplatesTab.filterTemplates(
        templatesStub,
        '',
        DeviceType.all
      );
      expect(result.length).to.equal(templatesStub.length);
    });

    test('Sub query for all devices', () => {
      const query = 'le';
      const result = TemplatesTab.filterTemplates(
        templatesStub,
        query,
        DeviceType.all
      );
      expect(result.length).to.equal(
        templatesStub.filter(({ name }) => name.toLowerCase().includes(query))
          .length
      );
    });

    test('Empty query for mobile devices', () => {
      const result = TemplatesTab.filterTemplates(
        templatesStub,
        '',
        DeviceType.mobile
      );
      expect(result.length).to.equal(
        templatesStub.filter(({ device }) => device === DeviceType.mobile)
          .length
      );
    });

    test('Sub query for mobile devices', () => {
      const query = 'le';
      const result = TemplatesTab.filterTemplates(
        templatesStub,
        query,
        DeviceType.mobile
      );
      expect(result.length).to.equal(
        templatesStub.filter(
          ({ device, name }) =>
            name.toLowerCase().includes(query) && device === DeviceType.mobile
        ).length
      );
    });

    test('Empty query for desktop devices', () => {
      const result = TemplatesTab.filterTemplates(
        templatesStub,
        '',
        DeviceType.desktop
      );
      expect(result.length).to.equal(
        templatesStub.filter(({ device }) => device === DeviceType.desktop)
          .length
      );
    });

    test('Sub query for desktop devices', () => {
      const query = 'le';
      const result = TemplatesTab.filterTemplates(
        templatesStub,
        query,
        DeviceType.desktop
      );
      expect(result.length).to.equal(
        templatesStub.filter(
          ({ device, name }) =>
            name.toLowerCase().includes(query) && device === DeviceType.desktop
        ).length
      );
    });
  });
});

const templatesStub = [
  {
    id: '0',
    name: 'Left Side Panel',
    markup: html``,
    device: DeviceType.desktop,
  },
  {
    id: '1',
    name: 'Left Drawer Mobile',
    markup: html``,
    device: DeviceType.mobile,
  },
  {
    id: '2',
    name: 'Right Side Panel',
    markup: html``,
    device: DeviceType.desktop,
  },
];
