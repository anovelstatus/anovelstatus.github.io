import { Chip, Stack, Typography } from "@mui/material";
import { useChapter, useMetalTiers, useTitles } from "@/data/api";
import { LoreSection } from "@/components/LoreSection";
import AppTable, { useAppTable } from "@/components/AppTable";
import { toIdString } from "@/data/helpers";
import { getColumns, useStyles } from "./columns";
import { useEffect, useMemo, useState } from "react";
import { WrappedRow } from "@/components/WrappedRow";
import { getTableTrees, type MeritFilterOptions, type TableTree } from "./helpers";
import { range } from "es-toolkit";
import { getFilteredRowModel, type Row } from "@tanstack/react-table";

// $reactTemp1.getFilteredRowModel().rows.filter(x => $reactTemp1.getGlobalFilterFn()(x, undefined, $reactTemp1.getState().globalFilter))

const data: TableTree[] = [
	{ name: "test", tier: "Bronze", merits: [], chapterRange: [460, 480] },
	{ name: "test", tier: "Legendary", merits: [], chapterRange: [460, 480] },
	{ name: "test", tier: "Silver", merits: [], chapterRange: [460, 480] },
	{ name: "test", tier: "Gold", merits: [], chapterRange: [460, 480] },
];

export default function TreesOfMerit() {
	const chapter = useChapter();
	const { data: titles, isLoading } = useTitles();
	const tiers = useMetalTiers();

	const [filters, setFilters] = useState<MeritFilterOptions>({ chapter });
	useEffect(() => {
		console.log("chapter change");
		setFilters((filters) => ({ ...filters, chapter: chapter }));
	}, [chapter]);

	const columns = useMemo(() => {
		console.log("getColumns");
		return getColumns(tiers);
	}, [tiers]);

	const realData = useMemo(() => {
		console.log("getTableTrees");
		return getTableTrees(titles, tiers);
	}, [titles, tiers]);

	const styles = useStyles();

	const table = useAppTable<TableTree>({
		data,
		columns,
		getRowId: toRowId,

		initialState: { sorting: [{ id: "title", desc: true }] },

		state: { globalFilter: filters },
		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn: (row, _, filterValue: MeritFilterOptions) => {
			console.log("global filter");
			const [start, end] = row.original.chapterRange;
			return start <= filterValue.chapter && end >= filterValue.chapter;
		},

		// todo: narrow layout
		//narrowBreakpoint: "md",
		//renderNarrowRow: ({ original }) => <TitleCard key={toIdString(original)} id={original} />,
	});

	const rows = table.getRowModel().rows;
	const totals = useMemo(() => getTotals(rows, chapter), [rows, chapter]);

	return (
		<Stack>
			<LoreSection topic="Titles" subtopic="Merits" />
			<Typography variant="h4" color="error">
				🚧 Under Construction. 1 tree is missing for 168-195. Other things could be wrong!
			</Typography>
			<WrappedRow spacing={2}>
				<Chip label={`Total Trees: ${totals.trees}`} />
				<Chip label={`Merit Points Earned: ${totals.merits}`} />
				<Chip label={`Merits Acquired: ${totals.spent}`} />
			</WrappedRow>
			<AppTable table={table} isLoading={isLoading} sx={{ overflowX: "auto", ...styles }} />
		</Stack>
	);
}

function getTotals(rows: Row<TableTree>[], chapter: number) {
	const totalMerits = rows.length;
	const totalTrees = totalMerits - rows.filter((x) => x.original.noTreeReason).length;
	const meritsSpent = rows
		.flatMap((x) => range(10).map((tier) => x.original.merits[tier]))
		.filter((merit) => merit?.chBought && merit.chBought <= chapter).length;

	return { merits: totalMerits, trees: totalTrees, spent: meritsSpent };
}

function toRowId(tree: TableTree) {
	// Include chapter because a single title will have multiple rows.
	return toIdString(tree) + tree.chapterRange[0];
}
