/**
 * Object were global application state is stored.
 */
class Store {
  /**
   * Reference to widget currently being dragged if any.
   */
  draggingElement: Element | null;

  /**
   * Reference to widget selected for editing.
   */
  editingElement: Element | null;

  /**
   * Lets us know if a widget has been added to a dropzone. In that case, we will increment the widget id, if not, we keep the id as is.
   */
  elementAdded: boolean;

  /**
   * Lets us know if we are dragging a widget for reordering or for adding. If reordering, we don't want to create a clone when appending the widget to a dropzone.
   */
  reordering: boolean;

  /**
   * Object that keeps track of the ids for different widgets. Allows us to have a unique id for each element.
   */
  widgetIDs: { [key: string]: number };

  constructor() {
    this.draggingElement = null;
    this.editingElement = null;
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

  /**
   * Resets instance variables corresponding to dragging events to their defaults.
   */
  resetDraggingValues() {
    this.draggingElement = null;
    this.elementAdded = false;
    this.reordering = false;
  }
}

export const store = new Store();
