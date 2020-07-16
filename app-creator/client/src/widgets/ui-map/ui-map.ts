import {} from 'googlemaps';
import { customElement, html, LitElement, css } from 'lit-element';
import { InputType, Tab } from '../../redux/types/enums';
import {
  AttributeMetaData,
  DefaultAttributesType,
  getDefaultAttributes,
} from '../../redux/types/attributes';
import { store } from '../../redux/store';
import { setEditingWidget, setSelectedTab } from '../../redux/actions';
import { aubergine } from '../../map-styles/aubergine';
import { standard } from '../../map-styles/standard';
import { silver } from '../../map-styles/silver';
import { retro } from '../../map-styles/retro';
import { night } from '../../map-styles/night';
import { dark } from '../../map-styles/dark';
import { DraggableWidget } from '../draggable-widget/draggable-widget';
import { MAP_STYLES } from '../../utils/constants';

declare global {
  interface Window {
    __initGoogleMap: any;
    gm_authFailure: Function;
  }
}

window.__initGoogleMap = window.__initGoogleMap || {};

let initCalled: boolean = false;
const callbackPromise = new Promise((r) => (window.__initGoogleMap = r));

function loadGoogleMaps(apiKey: string) {
  if (apiKey == null || apiKey === '') {
    return callbackPromise;
  }
  if (!initCalled) {
    const script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?' +
      (apiKey ? `key=${apiKey}&` : '') +
      'callback=__initGoogleMap';
    document.head.appendChild(script);
    initCalled = true;
  }
  return callbackPromise;
}

@customElement('ui-map')
export class Map extends LitElement {
  static styles = css``;

  static attributes: AttributeMetaData = {
    // Default latitude and longitude is set to Google's Mountain View office.
    latitude: {
      value: '37.419857',
      placeholder: '37.419857',
      step: 0.00000000000001,
      min: -90,
      max: 90,
      type: InputType.number,
      validator: (value: string) => {
        const float = parseFloat(value);
        return value === '' || (!isNaN(float) && float >= -90 && float <= 90);
      },
    },
    longitude: {
      value: '-122.078827',
      step: 0.00000000000001,
      min: -180,
      max: 180,
      placeholder: '-122.078827',
      type: InputType.number,
      validator: (value: string) => {
        const float = parseFloat(value);
        return value === '' || (!isNaN(float) && float >= -180 && float <= 180);
      },
    },
    zoom: {
      value: '4',
      placeholder: '4',
      type: InputType.number,
    },
    zoomControl: {
      value: 'false',
      type: InputType.select,
      items: ['true', 'false'],
    },
    fullscreenControl: {
      value: 'false',
      type: InputType.select,
      items: ['true', 'false'],
    },
    streetViewControl: {
      value: 'false',
      type: InputType.select,
      items: ['true', 'false'],
    },
    scaleControl: {
      value: 'false',
      type: InputType.select,
      items: ['true', 'false'],
    },
    mapTypeControl: {
      value: 'false',
      type: InputType.select,
      items: ['true', 'false'],
    },
    mapStyles: {
      value: 'standard',
      type: InputType.select,
      items: MAP_STYLES,
    },
    customMapStyles: {
      value: '',
      validator: (value: string) => {
        try {
          JSON.parse(value);
          return true;
        } catch (e) {
          return false;
        }
      },
      placeholder: 'Paste JSON here',
      type: InputType.textarea,
      tooltip: {
        text: 'Create custom map styles at the following link.',
        url: 'https://mapstyle.withgoogle.com',
      },
    },
  };

  static DEFAULT_MAP_ATTRIBUTES: DefaultAttributesType = getDefaultAttributes(
    Map.attributes
  );

  /**
   * Map api key.
   */
  private apiKey = '';

  /**
   * Sets zoom property on map.
   */
  private zoom = 4;

  /**
   * Center position of map.
   */
  private center = {
    lat: 37.419857,
    lng: -122.078827,
  };

  /**
   * Enables zoom control on map.
   */
  private zoomControl = false;

  /**
   * If set to true, adds full screen button.
   */
  private fullscreenControl = false;

  /**
   * If set to true, adds street view control button.
   */
  private streetViewControl = false;

  /**
   * If set to true, adds map type control.
   */
  private mapTypeControl = false;

  /**
   * If set to true, adds scale control.
   */
  private scaleControl = false;

  /**
   * Sets pre-existing map styling.
   * Options: aubergine, dark, night, retro, silver, standard.
   */
  private mapStyles = standard;

  /**
   * Sets map styling to custom JSON.
   * Custom JSON can be generated from https://mapstyle.withgoogle.com/.
   */
  private customMapStyles = '';

  /**
   * Properties of map. Full list can be found here.
   * https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.
   */
  private mapOptions: google.maps.MapOptions = {};

  /**
   * Sets map element.
   */
  private map: google.maps.Map | null = null;

  connectedCallback() {
    this.onmousedown = this.handleMouseDown;
    this.onclick = (e: Event) => e.stopPropagation();
  }

  handleMouseDown(e: Event) {
    e.stopPropagation();
    DraggableWidget.removeEditingWidgetHighlight();
    if (store.getState().editingElement != this) {
      store.dispatch(setEditingWidget(this as Map));
    }
    store.dispatch(setSelectedTab(Tab.attributes));
  }

  /**
   * Called on initialization and on property changes. Initial call
   * creates a new map instance but subsequent ones update the existing object.
   */
  updateMap() {
    loadGoogleMaps(this.apiKey).then(() => {
      this.mapOptions.zoom = this.zoom || 0;

      this.mapOptions.center = this.center;

      this.mapOptions.zoomControl = this.zoomControl;

      this.mapOptions.fullscreenControl = this.fullscreenControl;

      this.mapOptions.streetViewControl = this.streetViewControl;

      this.mapOptions.scaleControl = this.scaleControl;

      this.mapOptions.mapTypeControl = this.mapTypeControl;

      this.mapOptions.styles =
        this.customMapStyles != ''
          ? JSON.parse(this.customMapStyles)
          : this.mapStyles;

      if (this.map == null) {
        this.map = new google.maps.Map(this, this.mapOptions);
      } else {
        this.map.setOptions(this.mapOptions);
      }

      this.dispatchEvent(
        new CustomEvent('google-maps-ready', { detail: this.map })
      );
    });
  }

  // Disable the shadow root, since it interferes with Google Maps.
  // https://lit-element.polymer-project.org/guide/templates#renderroot
  createRenderRoot() {
    return this;
  }

  render() {
    return html``;
  }

  setAttribute(key: string, value: any) {
    switch (key) {
      case 'zoom':
        this.zoom = parseInt(value);
        break;
      case 'zoomControl':
        this.zoomControl = value === 'true';
        break;
      case 'scaleControl':
        this.scaleControl = value === 'true';
        break;
      case 'streetViewControl':
        this.streetViewControl = value === 'true';
        break;
      case 'fullscreenControl':
        this.fullscreenControl = value === 'true';
        break;
      case 'mapTypeControl':
        this.mapTypeControl = value === 'true';
        break;
      case 'mapStyles':
        this.mapStyles = this.getCustomMapStyle(value);
        break;
      case 'customMapStyles':
        this.customMapStyles = value;
        break;
      case 'center':
        this.center = value;
        break;
      case 'latitude':
        this.center = { ...this.center, lat: parseFloat(value) };
        break;
      case 'longitude':
        this.center = { ...this.center, lng: parseFloat(value) };
        break;
      case 'map':
        this.map = value;
        break;
      case 'apiKey':
        this.apiKey = value;
        break;
    }
    this.updateMap();
  }

  getCustomMapStyle(value: string): google.maps.MapTypeStyle[] {
    switch (value) {
      case 'standard':
        return standard;
      case 'silver':
        return silver;
      case 'retro':
        return retro;
      case 'night':
        return night;
      case 'dark':
        return dark;
      case 'aubergine':
        return aubergine;
      default:
        return standard;
    }
  }

  getMapStyle(): google.maps.MapTypeStyle[] {
    return this.mapStyles;
  }

  setStyle(style: { [key: string]: string }) {
    for (const attribute in style) {
      if (attribute === 'height' || attribute === 'width') {
        this.style[attribute] = '100%';
      } else {
        this.style[attribute as any] = style[attribute];
      }
    }
    this.requestUpdate();
  }

  getZoom(): number {
    return this.zoom;
  }

  setZoom(value: number) {
    this.zoom = value;
  }

  getCenter(): { lat: number; lng: number } {
    return this.center;
  }

  setCenter(value: { lat: number; lng: number }) {
    this.center = value;
  }

  getMap(): google.maps.Map<Element> | null {
    return this.map;
  }

  setMap(map: google.maps.Map | null) {
    this.map = map;
  }
}
