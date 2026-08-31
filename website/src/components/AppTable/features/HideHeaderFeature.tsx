import { type TableFeature, type RowData, type TableFeatures, assignTableAPIs } from "@tanstack/react-table";

export interface TableOptions_HideHeader {
	hideHeader?: boolean;
}

export interface Table_HideHeader {
	getShowHeader: () => boolean;
}

declare module "@tanstack/react-table" {
	interface Plugins {
		hideHeaderPlugin: TableFeature;
	}
	interface TableOptions_FeatureMap<TFeatures extends TableFeatures, TData extends RowData> {
		hideHeaderPlugin: TableOptions_HideHeader;
	}

	interface Table_FeatureMap<TFeatures extends TableFeatures, TData extends RowData> {
		hideHeaderPlugin: Table_HideHeader;
	}
}

/** Adds ability to render something other than a table on narrow screens */
export const HideHeaderFeature: TableFeature = {
	getDefaultTableOptions: (_table) => {
		return { hideHeader: false };
	},
	constructTableAPIs(table) {
		assignTableAPIs("narrowPlugin", table, {
			table_getShowHeader: {
				fn: () => !(table.options as TableOptions_HideHeader).hideHeader,
			},
		});
	},
};
