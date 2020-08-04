/**
 *  @fileoverview The tool-bar widget is the header component
 *  which contains the app title and export action. It handles the logic for
 *  displaying a serialized template string that the user can copy
 *  and import into the code editor.
 */
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-toast/paper-toast.js';
import { LitElement, html, customElement, css, query } from 'lit-element';
import { store } from '../../redux/store';
import { PaperDialogElement } from '@polymer/paper-dialog/paper-dialog.js';
import { AppCreatorStore } from '../../redux/reducer';
import { WIDGET_REF, ROOT_ID } from '../../utils/constants';
import { setSelectedTemplate, setImporting } from '../../redux/actions';
import { PaperToastElement } from '@polymer/paper-toast/paper-toast.js';

@customElement('tool-bar')
export class ToolBar extends LitElement {
  static prefix = 'Google Earth Engine';
  static suffix = 'App Creator';

  static styles = css`
    #container {
      height: 15px;
      padding: var(--regular);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: var(--light-border);
      background-color: var(--primary-color);
    }

    #app-title-prefix {
      font-weight: 500;
      color: var(--accent-color);
    }

    #app-title-suffix {
      color: var(--app-title-suffix-color);
      font-weight: 400;
    }

    h3 {
      margin: 0;
      padding: 0;
      font-size: 1rem;
    }

    paper-dialog {
      padding: var(--tight);
      border-radius: var(--tight);
      width: 40%;
      max-height: 600px;
    }

    #json-string-container {
      margin: 16px;
      overflow-y: scroll;
      overflow-x: scroll;
      padding: 16px;
      background-color: var(--background-color);
      max-height: 400px;
    }

    #json-snippet {
      font-family: monospace;
    }

    .action-button {
      background-color: var(--accent-color);
    }

    #cancel-button {
      color: var(--accent-color);
    }

    paper-button {
      margin-right: var(--tight);
    }

    #import-textarea {
      width: calc(100% - 2 * var(--tight) - 44px);
      height: 250px;
      margin-left: 24px;
      padding: var(--tight);
    }

    #import-button {
      background-color: var(--primary-color);
      color: var(--accent-color);
      height: 30px;
      font-size: 0.8rem;
      border: 0.3px solid var(--accent-color);
    }

    #export-button {
      background-color: var(--accent-color);
      color: var(--primary-color);
      height: 30px;
      font-size: 0.8rem;
    }

    #invalid-json-toast {
      background-color: var(--validation-error-red-color);
    }
  `;

  /**
   * Reference to the export dialog element.
   */
  @query('#export-dialog') exportDialog!: PaperDialogElement;

  /**
   * Reference to the import dialog element.
   */
  @query('#import-dialog') importDialog!: PaperDialogElement;

  /**
   * Reference to the textarea element.
   */
  @query('#import-textarea') importTextArea!: HTMLTextAreaElement;

  /**
   * Triggered when export button is clicked. It displays the paper dialog which
   * contains the serialized template string.
   */
  openExportDialog() {
    const jsonSnippetContainer = this.shadowRoot?.getElementById(
      'json-snippet'
    );

    if (this.exportDialog == null || jsonSnippetContainer == null) {
      return;
    }

    jsonSnippetContainer.textContent = this.getTemplateString(3);

    this.exportDialog.open();
  }

  /**
   * Triggered when import button is clicked. It displays the paper dialog which
   * allows users to paste a template string.
   */
  openImportDialog() {
    if (this.importDialog == null) {
      return;
    }

    this.importDialog.open();
  }

  /**
   * Returns a deep clone of template without widgetRefs.
   */
  deepCloneTemplate(
    template: AppCreatorStore['template']
  ): AppCreatorStore['template'] {
    const clone: AppCreatorStore['template'] = {};
    for (const key in template) {
      /**
       * Widget refs are only needed in the context of the app creator. Once we serialize the data,
       * we no longer need to keep the refs. As a result, we skip over them when we are producing the
       * output string.
       */
      if (key === WIDGET_REF) {
        continue;
      }
      if (typeof template[key] === 'object' && !Array.isArray(template[key])) {
        clone[key] = this.deepCloneTemplate(template[key]);
      } else if (Array.isArray(template[key])) {
        clone[key] = template[key].slice();
      } else {
        clone[key] = template[key];
      }
    }

    return clone;
  }

  /**
   * Returns the serialized template string with indentation.
   */
  getTemplateString(space: number = 0) {
    const template = this.deepCloneTemplate(store.getState().template);
    return JSON.stringify(template, null, space);
  }

  /**
   * Adds template string to clipboard.
   */
  copy() {
    const textArea = document.createElement('textarea');
    // We get the template string without indentation and with escaped single quotes.
    textArea.value = this.getTemplateString().replace(/'/g, "\\'");
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('Copy');
    textArea.remove();
  }

  /**
   * Imports template from JSON provided by the user.
   */
  importTemplate() {
    // Get textarea input element.
    if (this.importTextArea == null) {
      return;
    }

    // Get dialog element.
    if (this.importDialog == null) {
      return;
    }

    // Get template json string.
    let template = this.importTextArea.value.replace(/\\'/g, "'").trim();
    template = template.slice(
      template.indexOf('{'),
      template.lastIndexOf('}') + 1
    );

    try {
      const templateJSON = JSON.parse(template);

      // If the JSON doesn't contain a root_id (i.e. panel-template-0)
      // then it is not a valid template and thus we need to throw an error.
      if (!templateJSON.widgets.hasOwnProperty(ROOT_ID)) {
        throw new Error('Root ID (panel-template-0) not present...');
      }

      // Update the store with the new template.
      store.dispatch(setSelectedTemplate(templateJSON));
      store.dispatch(setImporting(true));

      this.importDialog.close();

      this.clearTextArea('import-textarea');
    } catch (e) {
      const fetchErrorToast = this.shadowRoot?.getElementById(
        'invalid-json-toast'
      ) as PaperToastElement;

      if (fetchErrorToast != null) {
        fetchErrorToast.open();
      }
    }
  }

  clearTextArea(id: string) {
    const textarea = this.shadowRoot?.querySelector(
      `#${id}`
    ) as HTMLTextAreaElement;

    if (textarea == null) {
      return;
    }

    textarea.value = '';
  }

  render() {
    const {
      openExportDialog,
      openImportDialog,
      importTemplate,
      clearTextArea,
      copy,
    } = this;

    const exportDialog = html`
      <paper-dialog id="export-dialog" with-backdrop no-cancel-on-outside-click>
        <h2>Paste string in EE Code Editor</h2>
        <paper-dialog-scrollable id="json-string-container">
          <pre><code id="json-snippet"></code
          ></pre>
        </paper-dialog-scrollable>
        <div class="buttons">
          <paper-button id="cancel-button" dialog-dismiss>Cancel</paper-button>
          <paper-button
            class="action-button"
            dialog-confirm
            autofocus
            @click=${copy}
            >Copy</paper-button
          >
        </div>
      </paper-dialog>
    `;

    const importDialog = html`
      <paper-dialog id="import-dialog" with-backdrop no-cancel-on-outside-click>
        <h2>Paste template string below</h2>

        <textarea
          id="import-textarea"
          class="attribute-input text-input"
          placeholder="Paste JSON string here (e.g. { panel-template-0: { ... } })"
          rows="4"
        ></textarea>
        <div class="buttons">
          <paper-button
            id="cancel-button"
            @click=${() => {
              clearTextArea.call(this, 'import-textarea');
            }}
            dialog-dismiss
            >Cancel</paper-button
          >
          <paper-button class="action-button" autofocus @click=${importTemplate}
            >Import</paper-button
          >
        </div>
      </paper-dialog>
    `;

    return html`
      <div id="container">
        <h3>
          <strong id="app-title-prefix">${ToolBar.prefix}</strong>
          <span id="app-title-suffix">${ToolBar.suffix}</span>
        </h3>

        <div>
          <paper-button id="import-button" @click=${openImportDialog}
            >Import</paper-button
          >
          <paper-button id="export-button" @click=${openExportDialog}
            >Export</paper-button
          >
        </div>

        ${importDialog} ${exportDialog}
        <paper-toast
          id="invalid-json-toast"
          text="Invalid template string."
        ></paper-toast>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tool-bar': ToolBar;
  }
}
