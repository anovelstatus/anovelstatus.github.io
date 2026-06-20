/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { SxProps } from "@mui/material";
import type { TableFeature, RowData, Cell, Column, Row, Table, Header } from "@tanstack/react-table";

// define types for our new feature's table options
interface ClassNameOptions<T> {
	/** Styles to add to the table body cell */
	bodySx?: SxProps | ((cell: Cell<T, unknown>) => SxProps);
	/** Styles to add to the table header cell */
	headerSx?: SxProps | ((header: Header<T, unknown>) => SxProps);
}

interface ClassNameCell {
	getSx: () => SxProps;
}

// Use declaration merging to add our new feature APIs and state types to TanStack Table's existing types.
declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends RowData, TValue> extends ClassNameOptions<TData> {}
	interface Cell<TData extends RowData, TValue> extends ClassNameCell {}
	interface Header<TData extends RowData, TValue> extends ClassNameCell {}
}

// Export feature to use in useReactTable's _features array
export const SxFeature: TableFeature = {
	// if you need to add cell instance APIs...
	createCell: <TData extends RowData>(
		cell: Cell<TData, unknown>,
		column: Column<TData>,
		_row: Row<TData>,
		_table: Table<TData>,
	): void => {
		cell.getSx = () => {
			const value = column.columnDef.meta?.bodySx;
			if (typeof value === "object") return value;
			if (typeof value === "function") return value(cell);
			return {};
		};
	},
	// if you need to add header instance APIs...
	createHeader: <TData extends RowData>(header: Header<TData, unknown>, _table: Table<TData>): void => {
		header.getSx = () => {
			const value = header.column.columnDef.meta?.headerSx;
			if (typeof value === "object") return value;
			if (typeof value === "function") return value(header);
			return {};
		};
	},
};
