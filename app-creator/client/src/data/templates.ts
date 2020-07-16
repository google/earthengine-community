import { TemplateItem, database } from '../client/fetch-templates';

/**
 * TemplatesManager is a class that handles data fetching regarding template data.
 * It stores a local cache of templates to be used throughout the lifetime of the application.
 */
class TemplatesManager {
  private templates: TemplateItem[] = [];

  getTemplates() {
    return this.templates;
  }

  /**
   * fetchTemplates fetches the templates from the datastore. If the
   * network request is not successful, it will fall back by setting this.templates
   * to backup templates stored on the client. It will also store an error to be
   * handled by the consumer.
   */
  async fetchTemplates(
    forceReload: boolean = false
  ): Promise<TemplateItem[] | void> {
    /**
     * If we have already fetched the templates, then
     * we will just return what we have stored.
     */
    if (this.templates.length > 0) {
      return this.templates;
    }

    try {
      const response = await fetch('/api/v1/templates');

      this.templates = await response.json();

      return this.templates;
    } catch (e) {
      /**
       * If a request fails, with the forceReload flag set to true,
       * we will try again one more time.
       */
      if (forceReload) {
        await this.fetchTemplates(false);
      } else {
        this.templates = database;
        throw e;
      }
    }
  }

  setTemplates(templates: TemplateItem[]) {
    this.templates = templates;
  }

  addTemplates(templates: TemplateItem[]) {
    this.templates.push(...templates);
  }
}

export const templatesManager = new TemplatesManager();
