/**
 *  @fileoverview The tool-bar widget is the header component
 *  which contains the app title and export action. It handles the logic for
 *  displaying a serialized template string that the user can copy
 *  and import into the code editor.
 */
import { LitElement, html, customElement, css } from 'lit-element';
import '@polymer/paper-button/paper-button.js';
import { store } from '../../redux/store';
import '@polymer/paper-dialog/paper-dialog.js';
import { PaperDialogElement } from '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import { AppCreatorStore } from '../../redux/reducer';
import { WIDGET_REF } from '../../utils/constants';

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

    #copy-button {
      background-color: var(--accent-color);
    }

    #cancel-button {
      color: var(--accent-color);
    }

    paper-button {
      margin-right: var(--tight);
    }

    #export-button {
      background-color: var(--accent-color);
      color: var(--primary-color);
      height: 30px;
      font-size: 0.8rem;
    }
  `;

  /**
   * Triggered when export button is clicked. It displays the paper dialog which
   * contains the serialized template string.
   */
  openDialog() {
    const dialog = this.shadowRoot?.querySelector('paper-dialog');
    const jsonSnippetContainer = this.shadowRoot?.getElementById(
      'json-snippet'
    );

    if (dialog == null || jsonSnippetContainer == null) {
      return;
    }
    jsonSnippetContainer.textContent = this.getTemplateString(3);

    (dialog as PaperDialogElement).open();
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

  render() {
    const { openDialog, copy } = this;
    return html`
      <div id="container">
        <h3>
          <strong id="app-title-prefix">${ToolBar.prefix}</strong>
          <span id="app-title-suffix">${ToolBar.suffix}</span>
        </h3>

        <paper-button id="export-button" @click=${openDialog}
          >Export</paper-button
        >

        <paper-dialog>
          <h2>Paste string in EE Code Editor</h2>
          <paper-dialog-scrollable id="json-string-container">
            <pre><code id="json-snippet"></code
          ></pre>
          </paper-dialog-scrollable>
          <div class="buttons">
            <paper-button id="cancel-button" dialog-dismiss
              >Cancel</paper-button
            >
            <paper-button
              id="copy-button"
              dialog-confirm
              autofocus
              @click=${copy}
              >Copy</paper-button
            >
          </div>
        </paper-dialog>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tool-bar': ToolBar;
  }
}
