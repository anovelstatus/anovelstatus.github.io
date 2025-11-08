/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { TableFeature, ColumnDef, RowData, Cell, Column, Row, Table, Header } from "@tanstack/react-table";

// define types for our new feature's table options
interface ColSpanOptions<T> {
	/** ColSpan to use for header cell of column */
	headerColSpan?: number;
	/** ColSpan to use for body cell of column */
	bodyColSpan?: number | ((row: Row<T>) => number);
}

interface ColSpanCell {
	getColSpan: () => number;
}

// Use declaration merging to add our new feature APIs and state types to TanStack Table's existing types.
declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends RowData, TValue> extends ColSpanOptions<TData> {}
	interface Cell<TData extends RowData, TValue> extends ColSpanCell {}
	interface Header<TData extends RowData, TValue> extends ColSpanCell {}
}

// Export feature to use in useReactTable's _features array
export const ColSpanFeature: TableFeature = {
	getDefaultColumnDef: <TData extends RowData>(): Partial<ColumnDef<TData>> => {
		return {
			meta: {
				bodyColSpan: 1,
				headerColSpan: 1,
			},
		};
	},
	// if you need to add cell instance APIs...
	createCell: <TData extends RowData>(
		cell: Cell<TData, unknown>,
		column: Column<TData>,
		row: Row<TData>,
		_table: Table<TData>,
	): void => {
		cell.getColSpan = () => {
			const prop = column.columnDef.meta?.bodyColSpan;
			if (typeof prop === "number") return prop;
			if (typeof prop === "function") return prop(row);
			return 1;
		};
	},
	// if you need to add header instance APIs...
	createHeader: <TData extends RowData>(header: Header<TData, unknown>, _table: Table<TData>): void => {
		header.getColSpan = () => header.column.columnDef.meta?.headerColSpan ?? 1;
	},
};
