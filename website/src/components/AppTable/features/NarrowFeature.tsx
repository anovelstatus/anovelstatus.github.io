/* eslint-disable @typescript-eslint/no-empty-object-type */
import { type ReactElement } from "react";
import type { TableFeature, Table, RowData, Row } from "@tanstack/react-table";
import { type Breakpoint } from "@mui/material";

interface NarrowOptions<T> {
	/** At which point to render something different */
	narrowBreakpoint?: Breakpoint;
	/** Custom rendering for the narrow layout */
	renderNarrowRow?: (row: Row<T>) => ReactElement;
}

// Define types for our new feature's table APIs
interface NarrowInstance {
	getNarrowBreakpoint: () => Breakpoint;
}

// Use declaration merging to add our new feature APIs and state types to TanStack Table's existing types.
declare module "@tanstack/react-table" {
	interface TableOptionsResolved<TData extends RowData> extends NarrowOptions<TData> {}
	interface Table<TData extends RowData> extends NarrowInstance {}
}

/** Adds ability to render something other than a table on narrow screens */
export const NarrowFeature: TableFeature = {
	getDefaultOptions: <TData extends RowData>(_table: Table<TData>): NarrowOptions<TData> => {
		return { narrowBreakpoint: "sm" } as NarrowOptions<TData>;
	},
	createTable: <TData extends RowData>(table: Table<TData>): void => {
		table.getNarrowBreakpoint = () => {
			return table.options.narrowBreakpoint || "sm";
		};
	},
};
