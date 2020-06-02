/**
 * Object were global application state is stored.
 */
class Store {
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
//# sourceMappingURL=store.js.map