/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { TableFeature, RowData, Cell, Column, Row, Table } from "@tanstack/react-table";

// define types for our new feature's table options
interface ClassNameOptions<T> {
	/** Styles to add to the table body cell */
	title?: (cell: Cell<T, unknown>) => string | undefined;
}

interface ClassNameCell {
	getTitle: () => string | undefined;
}

// Use declaration merging to add our new feature APIs and state types to TanStack Table's existing types.
declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends RowData, TValue> extends ClassNameOptions<TData> {}
	interface Cell<TData extends RowData, TValue> extends ClassNameCell {}
}

// Export feature to use in useReactTable's _features array
export const HoverTitleFeature: TableFeature = {
	// if you need to add cell instance APIs...
	createCell: <TData extends RowData>(
		cell: Cell<TData, unknown>,
		column: Column<TData>,
		_row: Row<TData>,
		_table: Table<TData>,
	): void => {
		cell.getTitle = () => {
			const value = column.columnDef.meta?.title;
			if (typeof value === "function") return value(cell);
			return;
		};
	},
};
