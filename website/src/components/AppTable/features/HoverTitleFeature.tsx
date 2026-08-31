import {
	type TableFeature,
	type RowData,
	type Cell,
	type TableFeatures,
	assignPrototypeAPIs,
	type CellData,
} from "@tanstack/react-table";

export interface ColumnDef_HoverTitle<TFeatures extends TableFeatures, TData extends RowData> {
	/** Styles to add to the table body cell */
	title?: (cell: Cell<TFeatures, TData>) => string | undefined;
}

export interface Cell_HoverTitle {
	getTitle: () => string | undefined;
}

declare module "@tanstack/react-table" {
	interface Plugins {
		titlePlugin: TableFeature;
	}
	interface Cell_FeatureMap {
		titlePlugin: Cell_HoverTitle;
	}
	interface ColumnDef_FeatureMap<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData> {
		titlePlugin: ColumnDef_HoverTitle<TFeatures, TData>;
	}
}

export const HoverTitleFeature: TableFeature = {
	assignCellPrototype(prototype, table) {
		assignPrototypeAPIs("titlePlugin", prototype, table, {
			cell_getTitle: {
				fn: (cell: Cell<TableFeatures, RowData>) => {
					const value = cell.column.columnDef.title;
					if (typeof value === "function") return value(cell);
					return "";
				},
			},
		});
	},
};
