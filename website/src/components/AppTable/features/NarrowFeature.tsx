import { type ReactElement } from "react";
import { type TableFeature, type RowData, type Row, type TableFeatures, assignTableAPIs } from "@tanstack/react-table";
import { type Breakpoint } from "@mui/material";

export interface TableOptions_Narrow<TFeatures extends TableFeatures, TData extends RowData> {
	/** At which point to render something different */
	narrowBreakpoint?: Breakpoint;
	/** Custom rendering for the narrow layout */
	renderNarrowRow?: (row: Row<TFeatures, TData>) => ReactElement;
}

export interface Table_Narrow {
	getNarrowBreakpoint: () => Breakpoint;
}

declare module "@tanstack/react-table" {
	interface Plugins {
		narrowPlugin: TableFeature;
	}
	interface TableOptions_FeatureMap<TFeatures extends TableFeatures, TData extends RowData> {
		narrowPlugin: TableOptions_Narrow<TFeatures, TData>;
	}

	interface Table_FeatureMap<TFeatures extends TableFeatures, TData extends RowData> {
		narrowPlugin: Table_Narrow;
	}
}

/** Adds ability to render something other than a table on narrow screens */
export const NarrowFeature: TableFeature = {
	getDefaultTableOptions: (_table) => {
		return { narrowBreakpoint: "md" };
	},
	constructTableAPIs(table) {
		assignTableAPIs("narrowPlugin", table, {
			table_getNarrowBreakpoint: {
				fn: () => (table.options as TableOptions_Narrow<TableFeatures, RowData>).narrowBreakpoint ?? "md",
			},
		});
	},
};
