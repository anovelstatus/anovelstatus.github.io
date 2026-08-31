import {
	type TableFeature,
	type RowData,
	type Cell,
	type Table,
	type Header,
	type TableFeatures,
	assignPrototypeAPIs,
	type CellData,
} from "@tanstack/react-table";

export interface ColumnDef_ClassName<TFeatures extends TableFeatures, TData extends RowData> {
	/** Styles to add to the table body cell */
	bodyClassName?: string | ((cell: Cell<TFeatures, TData>, table: Table<TFeatures, TData>) => string);
	/** Styles to add to the table header cell */
	headerClassName?: string | ((header: Header<TFeatures, TData>, table: Table<TFeatures, TData>) => string);
}

export interface CellHeader_ClassName {
	getClassName: () => string;
}

declare module "@tanstack/react-table" {
	interface Plugins {
		classNamePlugin: TableFeature;
	}
	interface Cell_FeatureMap {
		classNamePlugin: CellHeader_ClassName;
	}
	interface Header_FeatureMap {
		classNamePlugin: CellHeader_ClassName;
	}
	interface ColumnDef_FeatureMap<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData> {
		classNamePlugin: ColumnDef_ClassName<TFeatures, TData>;
	}
}

export const ClassNameFeature: TableFeature = {
	assignCellPrototype(prototype, table) {
		assignPrototypeAPIs("sxPlugin", prototype, table, {
			cell_getClassName: {
				fn: (cell) => {
					const value = cell.column.columnDef.bodyClassName;
					if (typeof value === "string") return value;
					if (typeof value === "function") return value(cell, table);
					return "";
				},
			},
		});
	},
	assignHeaderPrototype(prototype, table) {
		assignPrototypeAPIs("sxPlugin", prototype, table, {
			header_getClassName: {
				fn: (header) => {
					const value = header.column.columnDef.headerClassName;
					if (typeof value === "string") return value;
					if (typeof value === "function") return value(header, table);
					return "";
				},
			},
		});
	},
};
