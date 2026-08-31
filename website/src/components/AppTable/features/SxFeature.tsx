import type { SxProps } from "@mui/material";
import {
	type TableFeature,
	type RowData,
	type Cell,
	type Header,
	type TableFeatures,
	assignPrototypeAPIs,
	type CellData,
} from "@tanstack/react-table";

export interface ColumnDef_Sx<TFeatures extends TableFeatures, TData extends RowData> {
	/** Styles to add to the table body cell */
	bodySx?: (cell: Cell<TFeatures, TData>) => SxProps;
	/** Styles to add to the table header cell */
	headerSx?: (header: Header<TFeatures, TData>) => SxProps;
}

export interface CellHeader_Sx {
	getSx: () => SxProps;
}

declare module "@tanstack/react-table" {
	interface Plugins {
		sxPlugin: TableFeature;
	}
	interface Cell_FeatureMap {
		sxPlugin: CellHeader_Sx;
	}
	interface Header_FeatureMap {
		sxPlugin: CellHeader_Sx;
	}
	interface ColumnDef_FeatureMap<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData> {
		sxPlugin: ColumnDef_Sx<TFeatures, TData>;
	}
}

export const SxFeature: TableFeature = {
	assignCellPrototype(prototype, table) {
		assignPrototypeAPIs("sxPlugin", prototype, table, {
			cell_getSx: {
				fn: (cell: Cell<TableFeatures, RowData>) => {
					const value = cell.column.columnDef.bodySx;
					if (typeof value === "function") return value(cell);
					return {};
				},
			},
		});
	},
	assignHeaderPrototype(prototype, table) {
		assignPrototypeAPIs("sxPlugin", prototype, table, {
			header_getSx: {
				fn: (header: Header<TableFeatures, RowData>) => {
					const value = header.column.columnDef.headerSx;
					if (typeof value === "function") return value(header);
					return {};
				},
			},
		});
	},
};
