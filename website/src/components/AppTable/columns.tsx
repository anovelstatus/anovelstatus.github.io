import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";

export function createCollapsedTierColumn<T extends TieredId>(tiers: string[]): ColumnDef<T, string> {
	return createColumnHelper<T>().accessor((row) => row.tier, {
		header: "Tier",
		id: "tier",
		size: 20,
		meta: {
			bodyColSpan: 0,
		},
		sortingFn: (a, b) => tierSortComparator(tiers, a.original.tier, b.original.tier),
	});
}

export function createCollapsedChapterColumn<T>(accessor: (row: T) => number): ColumnDef<T, number> {
	return createColumnHelper<T>().accessor(accessor, {
		header: "Chapter",
		id: "chapter",
		size: 20,
		meta: {
			bodyColSpan: 0,
		},
	});
}

function getRank(tiers: string[], tier: string): number {
	return tiers.findIndex((x) => tier.startsWith(x));
}

/** Rank the given tiers, for sorting in a table */
function tierSortComparator(tiers: string[], a: string, b: string) {
	return getRank(tiers, a) - getRank(tiers, b);
}
