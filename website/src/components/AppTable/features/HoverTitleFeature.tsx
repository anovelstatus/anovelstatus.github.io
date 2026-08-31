import {
	type TableFeature,
	type RowData,
	type Cell,
	type Table,
	type TableFeatures,
	assignPrototypeAPIs,
	type CellData,
} from "@tanstack/react-table";

export interface ColumnDef_Title<TFeatures extends TableFeatures, TData extends RowData> {
	/** Styles to add to the table body cell */
	title?: (cell: Cell<TFeatures, TData>, table: Table<TFeatures, TData>) => string | undefined;
}

export interface Cell_Title {
	getTitle: () => string | undefined;
}

declare module "@tanstack/react-table" {
	interface Plugins {
		titlePlugin: TableFeature;
	}
	interface Cell_FeatureMap {
		titlePlugin: Cell_Title;
	}
	interface ColumnDef_FeatureMap<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData> {
		titlePlugin: ColumnDef_Title<TFeatures, TData>;
	}
}

export const HoverTitleFeature: TableFeature = {
	assignCellPrototype(prototype, table) {
		assignPrototypeAPIs("sxPlugin", prototype, table, {
			cell_getTitle: {
				fn: (cell) => {
					const value = cell.column.columnDef.title;
					if (typeof value === "function") return value(cell);
					return "";
				},
			},
		});
	},
};
