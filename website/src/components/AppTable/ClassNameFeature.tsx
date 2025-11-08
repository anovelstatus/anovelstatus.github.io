/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { TableFeature, RowData, Cell, Column, Row, Table, Header } from "@tanstack/react-table";

// define types for our new feature's table options
interface ClassNameOptions<T> {
	/** ColSpan to use for header cell of column */
	bodyClassName?: string | ((cell: Cell<T, unknown>) => string);
	/** ColSpan to use for body cell of column */
	headerClassName?: string | ((header: Header<T, unknown>) => string);
}

interface ClassNameCell {
	getClassName: () => string;
}

// Use declaration merging to add our new feature APIs and state types to TanStack Table's existing types.
declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends RowData, TValue> extends ClassNameOptions<TData> {}
	interface Cell<TData extends RowData, TValue> extends ClassNameCell {}
	interface Header<TData extends RowData, TValue> extends ClassNameCell {}
}

// Export feature to use in useReactTable's _features array
export const ClassNameFeature: TableFeature = {
	// if you need to add cell instance APIs...
	createCell: <TData extends RowData>(
		cell: Cell<TData, unknown>,
		column: Column<TData>,
		_row: Row<TData>,
		_table: Table<TData>,
	): void => {
		cell.getClassName = () => {
			const value = column.columnDef.meta?.bodyClassName;
			if (typeof value === "string") return value;
			if (typeof value === "function") return value(cell);
			return "";
		};
	},
	// if you need to add header instance APIs...
	createHeader: <TData extends RowData>(header: Header<TData, unknown>, _table: Table<TData>): void => {
		header.getClassName = () => {
			const value = header.column.columnDef.meta?.headerClassName;
			if (typeof value === "string") return value;
			if (typeof value === "function") return value(header);
			return "";
		};
	},
};
