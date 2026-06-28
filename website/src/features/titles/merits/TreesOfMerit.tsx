import { Chip, Stack, Typography } from "@mui/material";
import { useChapter, useMetalTiers, useTitles } from "@/data/api";
import { LoreSection } from "@/components/LoreSection";
import AppTable, { useAppTable } from "@/components/AppTable";
import { getTierRank, toIdString } from "@/data/helpers";
import { columnstyles, useColumns } from "./columns";
import { useMemo } from "react";
import { WrappedRow } from "@/components/WrappedRow";
import { getMeritTrees, getTreeForChapter, type TableTree } from "./helpers";
import { orderBy, range } from "es-toolkit";

export default function TreesOfMerit() {
	const chapter = useChapter();
	const { data: titles, isLoading } = useTitles();
	const tiers = useMetalTiers();

	const trees = useMemo(() => {
		console.log("creating trees");
		return getMeritTrees(titles, tiers);
	}, [titles, tiers]);
	const data = useMemo(() => {
		console.log("creating data");
		const data = trees.map((x) => getTreeForChapter(x, chapter)).filter((x) => x) as TableTree[];
		return orderBy(data, [(x) => getTierRank(tiers, x.title.tier), (x) => x.title.name], ["desc", "asc"]);
	}, [trees, chapter]);
	const columns = useColumns();

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
			<AppTable table={table} isLoading={isLoading} sx={{ overflowX: "auto", ...columnstyles }} />
		</Stack>
	);
}
