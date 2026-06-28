import { Chip, Stack, Typography } from "@mui/material";
import { useChapter, useMetalTiers, useTitles } from "@/data/api";
import { LoreSection } from "@/components/LoreSection";
import AppTable, { useAppTable } from "@/components/AppTable";
import { toIdString } from "@/data/helpers";
import { columnstyles, getColumns } from "./columns";
import { useMemo } from "react";
import { WrappedRow } from "@/components/WrappedRow";
import { getMeritTrees, getTreeForChapter, type TableTree } from "./helpers";
import { range } from "es-toolkit";
import { useTheme } from "@/data/useTheme";

export default function TreesOfMerit() {
	const chapter = useChapter();
	const { data: titles, isLoading } = useTitles();
	const tiers = useMetalTiers();
	const themes = range(10).map((x) => useTheme(x));

	const data = useMemo(() => {
		const trees = getMeritTrees(titles, tiers);
		return trees.map((x) => getTreeForChapter(x, chapter)).filter((x) => x) as TableTree[];
	}, [titles, tiers, chapter]);
	const columns = useMemo(() => getColumns(tiers, themes), [tiers, themes]);

	const table = useAppTable<TableTree>({
		data,
		columns,
		getRowId: (row) => toIdString(row.title),

		initialState: {
			sorting: [{ id: "title", desc: true }],
		},

		// todo: narrow layout
		//narrowBreakpoint: "md",
		//renderNarrowRow: ({ original }) => <TitleCard key={toIdString(original)} id={original} />,
	});

	const rows = table.getRowModel().rows;

	const totalMerits = rows.length;
	const totalTrees = totalMerits - rows.filter((x) => x.original.title.noTreeReason).length;
	const meritsSpent = rows
		.flatMap((x) => range(10).map((tier) => x.original.merits[tier]))
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
