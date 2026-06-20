/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { TableFeature, Table, RowData } from "@tanstack/react-table";

interface HideHeaderOptions {
	hideHeader?: boolean;
}

// Define types for our new feature's table APIs
interface HideHeaderInstance {
	getShowHeader: () => boolean;
}

// Use declaration merging to add our new feature APIs and state types to TanStack Table's existing types.
declare module "@tanstack/react-table" {
	interface TableOptionsResolved<TData extends RowData> extends HideHeaderOptions {}
	interface Table<TData extends RowData> extends HideHeaderInstance {}
}

/** Adds ability to render something other than a table on narrow screens */
export const HideHeaderFeature: TableFeature = {
	getDefaultOptions: <TData extends RowData>(_table: Table<TData>): HideHeaderOptions => {
		return { hideHeader: false } as HideHeaderOptions;
	},
	createTable: <TData extends RowData>(table: Table<TData>): void => {
		table.getShowHeader = () => {
			return !table.options.hideHeader;
		};
	},
};
