/**
 * Object were global application state is stored.
 */
declare class Store {
    /**
     * Reference to widget currently being dragged if any.
     */
    draggingElement: Element | null;
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
    widgetIDs: {
        [key: string]: number;
    };
    constructor();
    /**
     * Resets instance variables corresponding to dragging events to their defaults.
     */
    resetDraggingValues(): void;
}
export declare const store: Store;
export {};
//# sourceMappingURL=store.d.ts.map