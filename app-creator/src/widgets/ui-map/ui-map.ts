import {} from 'googlemaps';
import { customElement, html, LitElement, property, css } from 'lit-element';
import { InputType } from '../../redux/types/enums';
import {
  AttributeMetaData,
  DefaultAttributesType,
  getDefaultAttributes,
} from '../../redux/types/attributes';

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
  static styles = css`
    #editable-view {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      justify-content: flex-end;
      width: 100%;
    }

    .edit-buttons {
      background-color: white;
      border: var(--light-border);
      border-radius: var(--extra-tight);
      margin-left: var(--extra-tight);
      cursor: pointer;
    }
  `;

  static attributes: AttributeMetaData = {
    // Default latitude and longitude is set to Google's Mountain View office.
    latitude: {
      value: '39.930546488601294',
      placeholder: '39.9305464',
      step: 0.000000000000000000001,
      type: InputType.number,
    },
    longitude: {
      value: '-100.825',
      step: 0.000000000000000000001,
      placeholder: '-100.825',
      type: InputType.number,
    },
    zoom: {
      value: '4',
      placeholder: '4',
      type: InputType.number,
    },
  };

  static DEFAULT_MAP_ATTRIBUTES: DefaultAttributesType = getDefaultAttributes(
    Map.attributes
  );

  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = {};

  /**
   * Map api key.
   */
  @property({ type: String }) apiKey = '';

  /**
   * Sets zoom property on map.
   */
  @property({ type: Number }) zoom = 4;

  /**
   * Center position of map.
   */
  @property({ type: Object }) center = {
    lat: 39.930546488601294,
    lng: -100.825,
  };

  /**
   * Properties of map. Full list can be found here.
   * https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.
   */
  @property({ type: Object }) mapOptions: google.maps.MapOptions = {};

  /**
   * Sets map element.
   */
  private map: google.maps.Map | null = null;

  /**
   * Adds edit icon to panel.
   */
  @property({ type: Boolean }) editable = false;

  connectedCallback() {
    this.initMap();
  }

  initMap() {
    loadGoogleMaps(this.apiKey).then(() => {
      this.mapOptions.zoom = this.zoom || 0;

      this.mapOptions.center = this.center;

      this.mapOptions.zoomControl = false;

      this.mapOptions.streetViewControl = false;

      this.mapOptions.fullscreenControl = false;

      this.mapOptions.mapTypeControl = false;

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
    this.initMap();
  }

  getStyle(): { [key: string]: string } {
    return this.styles;
  }

  setStyle(style: { [key: string]: string }) {
    for (const attribute in style) {
      this.style[attribute as any] = style[attribute];
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
