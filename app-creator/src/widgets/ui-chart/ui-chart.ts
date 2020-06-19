/**
 *  @fileoverview The ui-chart widget allows users to add a chart element to their template. The chart
 *  element in the App Creator is a static image that represents an actual chart element in the EE code editor.
 */
import '@polymer/iron-label';
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import {
  DEFAULT_SHARED_ATTRIBUTES,
  AttributeMetaData,
  DefaultAttributesType,
  getDefaultAttributes,
} from '../../redux/types/attributes';
import { InputType } from '../../redux/types/enums';

@customElement('ui-chart')
export class Chart extends LitElement {
  static styles = css`
    #container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;

  static attributes: AttributeMetaData = {
    dataTable: {
      value: '',
      placeholder: `{
        cols: [{id: 'task', label: 'Task', type: 'string'},
               {id: 'hours', label: 'Hours per Day', type: 'number'}],
        rows: [{c:[{v: 'Work'}, {v: 11}]},
               {c:[{v: 'Eat'}, {v: 2}]},
               {c:[{v: 'Write EE code'}, {v:7, f:'7.000'}]}]
        }`,
      type: InputType.textarea,
    },
    chartType: {
      value: 'Scatter Chart',
      type: InputType.select,
      items: [
        'Geo Chart',
        'Scatter Chart',
        'Column Chart',
        'Histogram',
        'Bar Chart',
        'Combo Chart',
        'Area Chart',
        'SteppedArea Chart',
        'Line Chart',
        'Pie Chart',
        'Bubble Chart',
        'Donut Chart',
        'Org Chart',
        'Treemap',
        'Table',
        'Timeline',
        'Gauge',
        'Candlestick Chart',
      ],
    },
    title: {
      value: '',
      placeholder: 'Enter title',
      type: InputType.text,
    },
    color: {
      value: '',
      placeholder: '#ffffff, #000000, ...',
      type: InputType.text,
    },
    '3D': {
      value: 'false',
      type: InputType.select,
      items: ['true', 'false'],
    },
    downloadable: {
      value: 'false',
      type: InputType.select,
      items: ['true', 'false'],
    },
  };

  static DEFAULT_CHART_ATTRIBUTES: DefaultAttributesType = getDefaultAttributes(
    Chart.attributes
  );

  /**
   * Additional custom styles for the button.
   */
  @property({ type: Object }) styles = DEFAULT_SHARED_ATTRIBUTES;

  /**
   * A 2-D array of data or a Google Visualization DataTable literal.
   * See: http://developers.google.com/chart/interactive/docs/reference#DataTable.
   */
  @property({ type: Object }) dataTable = {};

  /**
   * If set, the label turns into a link that
   * leads to the target url.
   */
  @property({ type: String }) chartType = 'Scatter Chart';

  /**
   * Sets chart width.
   */
  @property({ type: Number }) width = 150;

  /**
   * Sets chart height.
   */
  @property({ type: Number }) height = 150;

  /**
   * Chart title
   */
  @property({ type: String }) title = '';

  /**
   * Array of color strings.
   */
  @property({ type: Array }) color = [];

  /**
   * Sets 3D property of the chart.
   */
  @property({ type: Boolean }) is3D = false;

  /**
   * Whether the chart can be downloaded as CSV, SVG, and PNG. Defaults to true.
   */
  @property({ type: Boolean }) downloadable = true;

  /**
   * Sets pre-defined styles for the specified type (ie. paragraph, title).
   */
  @property({ type: String })
  type = 'paragraph';

  render() {
    const { styles } = this;

    return html`
      <img
        style=${styleMap(styles)}
        src="https://ourcodingclub.github.io/assets/img/tutorials/earth-engine/forest_barplot.png"
        alt="chart image"
        height="100px"
        width="100px"
      />
    `;
  }

  getDataTable(): object {
    return this.dataTable;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getTitle(): string {
    return this.title;
  }

  getColor(): string[] {
    return this.color;
  }

  getIs3D(): boolean {
    return this.is3D;
  }

  getStyle(): object {
    return this.styles;
  }

  setAttribute(key: string, value: any) {
    switch (key) {
      case 'dataTable':
        this.dataTable = value;
        return;
      case 'width':
        this.width = value;
        return;
      case 'height':
        this.height = value;
        return;
      case 'title':
        this.title = value;
        return;
      case 'color':
        this.color = value;
        return;
      case 'is3D':
        this.is3D = value;
        return;
      case 'downloadable':
        this.downloadable = value;
    }
  }

  setStyle(style: { [key: string]: string }) {
    this.styles = style;
    this.requestUpdate();
  }
}
