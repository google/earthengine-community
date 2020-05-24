class Store {
  draggingElement: Element | null;
  elementAdded: boolean;
  reordering: boolean;
  widgetIDs: { [key: string]: number };

  constructor() {
    this.draggingElement = null;
    this.elementAdded = false;
    this.reordering = false;
    this.widgetIDs = {
      label: 0,
      button: 0,
      select: 0,
      textbox: 0,
      panel: 0,
      slider: 0,
      checkbox: 0,
    };
  }
}

export const store = new Store();
