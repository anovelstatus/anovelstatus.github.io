import {
	tableFeatures,
	rowSortingFeature,
	createSortedRowModel,
	sortFns,
	cellSpanningFeature,
	globalFilteringFeature,
	columnSizingFeature,
	rowExpandingFeature,
	columnVisibilityFeature,
	columnFilteringFeature,
	filterFns,
	createFilteredRowModel,
	createExpandedRowModel,
} from "@tanstack/react-table";
import { ClassNameFeature } from "./ClassNameFeature";
import { NarrowFeature } from "./NarrowFeature";
import { SxFeature } from "./SxFeature";
import { HoverTitleFeature } from "./HoverTitleFeature";
import { HideHeaderFeature } from "./HideHeaderFeature";

export const features = tableFeatures({
	// Filtering
	columnFilteringFeature,
	globalFilteringFeature,
	filteredRowModel: createFilteredRowModel(),
	filterFns, // todo: individual fns

	// Sorting
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),
	sortFns, // todo: individual fns

	// Row expansion (for previous items)
	rowExpandingFeature,
	expandedRowModel: createExpandedRowModel(),

	// Other built-in features
	cellSpanningFeature,
	columnSizingFeature,
	columnVisibilityFeature,

	// Custom features
	hideHeaderPlugin: HideHeaderFeature,
	classNamePlugin: ClassNameFeature,
	narrowPlugin: NarrowFeature,
	titlePlugin: HoverTitleFeature,
	sxPlugin: SxFeature,
});
export type AppTableFeatures = typeof features;
