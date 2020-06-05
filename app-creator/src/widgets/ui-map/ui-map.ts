import {} from 'googlemaps';
import { customElement, html, LitElement } from 'lit-element';

@customElement('ui-map')
export class Map extends LitElement {
  /**
   * Sets zoom property on map.
   */
  zoom = 4;

  /**
   * Sets center location on initial render.
   */
  center = { lng: -100.825, lat: 39.930546488601294 };

  /**
   * Sets map element.
   */
  map: google.maps.Map | null = null;

  // Disable the shadow root, since it interferes with Google Maps.
  // https://lit-element.polymer-project.org/guide/templates#renderroot
  connectedCallback() {}

  createRenderRoot() {
    return this;
  }

  render() {
    return html``;
  }

  init(): void {
    const mapOptions = {
      center: this.center,
      zoom: this.zoom,
      maxZoom: 10,
      streetViewControl: false,
    };

    const mapContainer = document.createElement('div');
    mapContainer.style.width = '100%';
    mapContainer.style.height = '100%';
    this.appendChild(mapContainer);
    // Render the base Google Map directly into the component.
    this.map = new google.maps.Map(mapContainer, mapOptions);
  }
}
