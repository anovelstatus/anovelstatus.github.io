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

export interface ColumnDef_Sx {
	/** Styles to add to the table body cell */
	bodySx?: SxProps | ((cell: Cell<TableFeatures, RowData>) => SxProps);
	/** Styles to add to the table header cell */
	headerSx?: SxProps | ((header: Header<TableFeatures, RowData>) => SxProps);
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
		sxPlugin: ColumnDef_Sx;
	}
}

export const SxFeature: TableFeature = {
	assignCellPrototype(prototype, table) {
		assignPrototypeAPIs("sxPlugin", prototype, table, {
			cell_getSx: {
				fn: (cell) => {
					const value = cell.column.columnDef.bodySx;
					if (typeof value === "object") return value;
					if (typeof value === "function") return value(cell, table);
					return {};
				},
			},
		});
	},
	assignHeaderPrototype(prototype, table) {
		assignPrototypeAPIs("sxPlugin", prototype, table, {
			header_getSx: {
				fn: (header) => {
					const value = header.column.columnDef.headerSx;
					if (typeof value === "object") return value;
					if (typeof value === "function") return value(header, table);
					return {};
				},
			},
		});
	},
};
