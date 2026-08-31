import { type ColumnDef, type ColumnHelper, type RowData } from "@tanstack/react-table";
import type { TableFeatures } from "./features";

export function createCollapsedTierColumn<T extends HasTier & RowData>(
	helper: ColumnHelper<TableFeatures, T>,
	tiers: string[],
): ColumnDef<TableFeatures, T, string> {
	return helper.accessor((row) => row.tier, {
		header: "Tier",
		id: "tier",
		size: 100,
		spanColumns: 0,
		sortFn: (a, b) => tierSortComparator(tiers, a.original.tier, b.original.tier),
	});
}

export function createCollapsedChapterColumn<T extends RowData>(
	helper: ColumnHelper<TableFeatures, T>,
	accessor: (row: T) => number,
): ColumnDef<TableFeatures, T, number> {
	return helper.accessor(accessor, {
		header: "Chapter",
		id: "chapter",
		size: 100,
		spanColumns: 0,
	});
}

function getRank(tiers: string[], tier: string): number {
	return tiers.findIndex((x) => tier.startsWith(x));
}

/** Rank the given tiers, for sorting in a table */
function tierSortComparator(tiers: string[], a: string, b: string) {
	return getRank(tiers, a) - getRank(tiers, b);
}
