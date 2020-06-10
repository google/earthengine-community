import {} from 'googlemaps';
import { customElement, html, LitElement } from 'lit-element';

@customElement('ui-map')
export class Map extends LitElement {
  /**
   * Sets zoom property on map.
   */
  private zoom = 4;

  getZoom() {
    return this.zoom;
  }

  setZoom(value: number) {
    this.zoom = value;
  }

  /**
   * Sets center location on initial render.
   */
  private center = { lng: -100.825, lat: 39.930546488601294 };

  getCenter() {
    return this.center;
  }

  setCenter(value: { lng: number; lat: number }) {
    this.center = value;
  }

  /**
   * Sets map element.
   */
  private map: google.maps.Map | null = null;

  getMap() {
    return this.map;
  }

  setMap(map: google.maps.Map | null) {
    this.map = map;
  }

  connectedCallback() {}

  // Disable the shadow root, since it interferes with Google Maps.
  // https://lit-element.polymer-project.org/guide/templates#renderroot
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
