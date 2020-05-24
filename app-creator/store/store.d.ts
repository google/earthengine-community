declare class Store {
    draggingElement: Element | null;
    elementAdded: boolean;
    reordering: boolean;
    widgetIDs: {
        [key: string]: number;
    };
    constructor();
}
export declare const store: Store;
export {};
//# sourceMappingURL=store.d.ts.map