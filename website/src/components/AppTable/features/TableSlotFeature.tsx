/* eslint-disable @typescript-eslint/no-empty-object-type */
import { type ReactElement } from "react";
import type { TableFeature, Table, RowData } from "@tanstack/react-table";

interface TableSlotOptions<T> {
	/** Extra slots surrounding the table to add custom components */
	slots: TableSlots<T>;
}

type SlotRender<T> = (table: Table<T>) => ReactElement | undefined;

type TableSlots<T> = {
	before?: SlotRender<T>;
	after?: SlotRender<T>;
};

// Define types for our new feature's table APIs
interface TableSlotInstance {
	getBeforeSlot: () => ReactElement | undefined;
	getAfterSlot: () => ReactElement | undefined;
}

// Use declaration merging to add our new feature APIs and state types to TanStack Table's existing types.
declare module "@tanstack/react-table" {
	interface TableOptionsResolved<TData extends RowData> extends TableSlotOptions<TData> {}
	interface Table<TData extends RowData> extends TableSlotInstance {}
}

/** Adds ability to render something other than a table on narrow screens */
export const TableSlotFeature: TableFeature = {
	getDefaultOptions: <TData extends RowData>(_table: Table<TData>): TableSlotOptions<TData> => {
		return { slots: {} } as TableSlotOptions<TData>;
	},
	createTable: <TData extends RowData>(table: Table<TData>): void => {
		table.getBeforeSlot = () => {
			return table.options.slots.before?.(table);
		};
		table.getAfterSlot = () => {
			return table.options.slots.after?.(table);
		};
	},
};
