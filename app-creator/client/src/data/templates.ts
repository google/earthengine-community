import { TemplateItem } from '../client/fetch-templates';

class TemplatesManager {
  private templates: TemplateItem[] = [];

  getTemplates() {
    return this.templates;
  }

  setTemplates(templates: TemplateItem[]) {
    this.templates = templates;
  }

  addTemplates(templates: TemplateItem[]) {
    this.templates.push(...templates);
  }
}

export const templatesManager = new TemplatesManager();
