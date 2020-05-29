/**
 *  @fileoverview The attributes-tab widget contains the different
 *  attributes that a user can edit for a particular element.
 */
import { html, customElement, css, property, LitElement } from 'lit-element';
import { nothing } from 'lit-html';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icon/iron-icon.js';
import '../tab-container/tab-container';
import '../draggable-widget/draggable-widget';
import '../ui-label/ui-label';
import '../ui-button/ui-button';
import '../ui-select/ui-select';
import '../ui-checkbox/ui-checkbox';
import '../ui-textbox/ui-textbox';
import '../ui-slider/ui-slider';
import '../ui-panel/ui-panel';
import '../search-bar/search-bar';
import { store } from '../../store';
import { Label } from '../ui-label/ui-label';
import '@polymer/paper-input/paper-input.js';
import { Textbox } from '../ui-textbox/ui-textbox';

@customElement('attributes-tab')
export class AttributesTab extends LitElement {
  static styles = css`
    input {
      margin: var(--tight) 0px;
    }

    .input-label {
      margin: 0px 0px;
      font-size: 0.8rem;
      font-weight: 600;
    }
  `;

  handleOnChange(e: Event) {
    console.log({ target: e.target });

    const widget = store.editingElement;
    if (widget == null) {
      return;
    }

    (widget as Label).value = (e.target as Textbox).value;
  }

  handleTargetUrlChange(e: Event) {
    const widget = store.editingElement;
    if (widget == null) {
      return;
    }

    (widget as Label).targetUrl = (e.target as Textbox).value;
  }

  handleSelectionChange(selection: string, property: any) {
    console.log({ selection });
    const widget = store.editingElement;
    if (widget == null) {
      return;
    }

    (widget as LitElement).style[property] = selection;
  }

  handleStyleChange(e: Event, property: any) {
    const widget = store.editingElement;
    if (widget == null) {
      return;
    }

    (widget as Label).style[property] = (e.target as HTMLInputElement).value;

    (widget as Label).requestUpdate();
  }

  getMarkup() {
    const widget = store.editingElement;
    if (widget == null) {
      return;
    }

    const editableAttributes = {
      label: [
        html`<ui-textbox
          label="Value"
          value="${(widget as Label).value}"
          .onKeyupChangeHandler=${this.handleOnChange}
        ></ui-textbox>`,
        html`<ui-textbox
          label="Target Url"
          value=${(widget as Label).targetUrl}
          .onKeyupChangeHandler=${this.handleTargetUrlChange}
        ></ui-textbox>`,
        html`
          <ui-textbox
            label="Color"
            value=${(widget as Label).style.color}
            .onChangeHandler=${(e: Event) => this.handleStyleChange(e, 'color')}
            type="color"
          ></ui-textbox>
        `,
        // html`
        //   <ui-textbox
        //     label="Background Color"
        //     value=${(widget as Label).value}
        //     @change=${(e: Event) =>
        //       this.handleStyleChange(e, 'backgroundColor')}
        //     type="color"
        //
        //   ></ui-textbox>
        // `,

        html`
          <ui-textbox
            label="Padding"
            .onKeyupChangeHandler=${(e: Event) =>
              this.handleStyleChange(e, 'padding')}
            type="text"
          ></ui-textbox>
        `,
        html`
          <ui-textbox
            label="Margin"
            .onKeyupChangeHandler=${(e: Event) =>
              this.handleStyleChange(e, 'margin')}
            type="text"
          ></ui-textbox>
        `,
        html`
          <ui-textbox
            label="Font Size"
            .onKeyupChangeHandler=${(e: Event) =>
              this.handleStyleChange(e, 'fontSize')}
            type="text"
          ></ui-textbox>
        `,
        html`
          <ui-select
            placeholder="Font Weight"
            .items=${[
              '100',
              '200',
              '300',
              '400',
              '500',
              '600',
              '700',
              '800',
              '900',
              '1000',
            ]}
            .onChangeHandler=${(selection: string) =>
              this.handleSelectionChange(selection, 'fontWeight')}
          ></ui-select>
        `,
        html`
          <ui-select
            placeholder="Text Align"
            .items=${['left', 'center', 'right']}
            .onChangeHandler=${(selection: string) =>
              this.handleSelectionChange(selection, 'textAlign')}
          ></ui-select>
        `,
      ],
    };

    return editableAttributes.label.map((template) => template);
  }

  /**
   * Sets the search query.
   */
  @property({ type: String }) query = '';

  @property({ type: Object })
  editingElement: Element | null = store.editingElement;

  connectedCallback() {
    super.connectedCallback();
    store.on('edit-widget', this, this.handleEditWidget);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    store.remove('edit-widget', this, this.handleEditWidget);
  }

  handleEditWidget() {
    this.editingElement = store.editingElement;
  }

  createInputField(callback: Function) {
    return html`Value: <input type="text" @change=${callback}></input>`;
  }

  render() {
    const emptyNotice =
      this.editingElement == null
        ? html`
            <empty-notice
              icon="create"
              message="No widget selected. Click on a widget's edit icon to select it."
              size="large"
              bold
            ></empty-notice>
          `
        : nothing;

    const editableFieldsMarkup = this.getMarkup();

    return html`
      <tab-container title="Attributes"
        >${editableFieldsMarkup} ${emptyNotice}</tab-container
      >
    `;
  }

  // getMarkup(widget: Element | null) {
  //   if (widget == null) {
  //     return nothing;
  //   }
  //   const prefix = widget.id.slice(0, widget.id.indexOf('-'));
  //   console.log({ prefix });
  //   switch (prefix) {
  //     case 'label':
  //       const { label } = editableAttributes;
  //       return label.map(({ title, type, style, property }) => {
  //         if (type.includes('input') && type.includes('text') && !style) {
  //           return html`
  //           <div>
  //            ${title} <input type="text" placeholder="Enter ${title}" @keyup=${(
  //             e: Event
  //           ) =>
  //             ((widget as Label).value = (e.target as HTMLInputElement).value)}></input>
  //           </div>
  //           `;
  //         } else if (
  //           type.includes('input') &&
  //           type.includes('color') &&
  //           style
  //         ) {
  //           return html`
  //           <div>
  //            ${title} <input type="color" placeholder="Enter ${title}" @change=${(
  //             e: Event
  //           ) => {
  //             (widget as HTMLInputElement).style[
  //               property
  //             ] = (e.target as HTMLInputElement).value;
  //           }}></input>
  //           </div>
  //           `;
  //         } else if (type.includes('input') && type.includes('text') && style) {
  //           return html`
  //           <div>
  //            ${title} <input type="text" placeholder="Enter ${title}" @change=${(
  //             e: Event
  //           ) => {
  //             (widget as HTMLInputElement).style[
  //               property
  //             ] = (e.target as HTMLInputElement).value;
  //           }}></input>
  //           </div>
  //           `;
  //         } else {
  //           return nothing;
  //         }
  //       });
  //     default:
  //       return nothing;
  //   }
  //   return nothing;
  // }
}

declare global {
  interface HTMLElementTagNameMap {
    'attributes-tab': AttributesTab;
  }
}
