import { Chip, Stack, Typography } from "@mui/material";
import { useChapter, useMetalTiers, useTitles } from "@/data/api";
import { LoreSection } from "@/components/LoreSection";
import AppTable, { useAppTable } from "@/components/AppTable";
import { toIdString } from "@/data/helpers";
import { columnstyles, getColumns } from "./columns";
import { useEffect, useMemo, useState } from "react";
import { getFilteredRowModel } from "@tanstack/react-table";
import { WrappedRow } from "@/components/WrappedRow";
import { getMeritForChapter, getTitleForChapter, getMeritTrees } from "./helpers";
import { range } from "es-toolkit";
import { useTheme } from "@/data/useTheme";

export default function TreesOfMerit() {
	const chapter = useChapter();
	const { data: titles, isLoading } = useTitles();
	const tiers = useMetalTiers();
	const trees = useMemo(() => getMeritTrees(titles, tiers), [titles, tiers]);
	const themes = range(10).map((x) => useTheme(x));
	const columns = useMemo(() => getColumns(chapter, tiers, themes), [chapter, tiers, themes]);
	const [filters, setFilters] = useState<FilterOptions>({ chapter });
	useEffect(() => {
		setFilters((filters) => ({ ...filters, chapter: chapter }));
	}, [chapter]);

	const table = useAppTable<MeritTree>({
		data: trees,
		columns,
		getRowId: (row) => toIdString(row.titles[0]),

		initialState: {
			sorting: [{ id: "title", desc: true }],
		},
		state: { globalFilter: filters },

		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn: (row, _, filterValue: FilterOptions) => {
			return showTree(row.original, filterValue);
		},

		// todo: narrow layout
		//narrowBreakpoint: "md",
		//renderNarrowRow: ({ original }) => <TitleCard key={toIdString(original)} id={original} />,
	});

	const rows = table.getRowModel().rows;

	const totalMerits = rows.length;
	const totalTrees = totalMerits - rows.filter((x) => getTitleForChapter(x.original, chapter)?.noTreeReason).length;
	const meritsSpent = rows
		.flatMap((x) => range(10).map((tier) => getMeritForChapter(x.original, tier, chapter)))
		.filter((merit) => merit?.chBought && merit.chBought <= chapter).length;

	return (
		<Stack>
			<LoreSection topic="Titles" subtopic="Merits" />
			<Typography variant="h4" color="error">
				🚧 Under Construction. 1 tree is missing for 168-195. Other things could be wrong!
			</Typography>
			<WrappedRow spacing={2}>
				<Chip label={`Total Trees: ${totalTrees}`} />
				<Chip label={`Merit Points Earned: ${totalMerits}`} />
				<Chip label={`Merits Acquired: ${meritsSpent}`} />
			</WrappedRow>
			<AppTable table={table} isLoading={isLoading} sx={{ overflowX: "scroll", ...columnstyles }} />
		</Stack>
	);
}

type FilterOptions = {
	chapter: number;
};

function showTree(x: MeritTree, { chapter }: FilterOptions): boolean {
	return getTitleForChapter(x, chapter) !== undefined;
}
