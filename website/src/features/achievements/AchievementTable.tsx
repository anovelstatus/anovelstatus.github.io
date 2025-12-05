import AppTable, { useAppTable } from "@/components/AppTable";
import { useAchievements, useChapter, useMetalTiers } from "@/data/api";
import { RarityButtonChip } from "@/components/chips";
import { getFilteredRowModel } from "@tanstack/react-table";
import { Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { columns } from "./columns";
import AchievementCard from "./AchievementCard";

export default function AchievementTable() {
	const chapter = useChapter();
	const { data, isFetching } = useAchievements();
	const metalTiers = useMetalTiers();
	const [filters, setFilters] = useState<FilterOptions>({ chapter });

	useEffect(() => {
		setFilters((filters) => ({ ...filters, chapter: chapter }));
	}, [chapter]);

	const changeTierFilter = (tier: string) => {
		setFilters((filters) => {
			if (filters.tier === tier) return { ...filters, tier: undefined };
			return { ...filters, tier: tier };
		});
	};

	const currentAchievements = data.filter((x) => showAchievement(x, { chapter }));

	const totals = currentAchievements.reduce(
		(totals, achievement) => {
			if (!totals[achievement.tier]) totals[achievement.tier] = 0;
			totals[achievement.tier]!++;
			return totals;
		},
		{} as Partial<Record<string, number>>,
	);

	const table = useAppTable({
		data,
		columns,
		getRowId: (row) => row.description,
		initialState: {
			sorting: [{ id: "chapter", desc: true }],
		},
		narrowBreakpoint: "md",
		renderNarrowRow: ({ original }) => <AchievementCard achievement={original} />,
		getFilteredRowModel: getFilteredRowModel(),
		state: { globalFilter: filters },
		globalFilterFn: (row, _, filterValue: FilterOptions) => {
			return showAchievement(row.original, filterValue);
		},
	});

	return (
		<>
			<Typography variant="h4" gutterBottom>
				Priam's Achievements
			</Typography>
			<Grid container spacing={2}>
				{metalTiers
					.filter((x) => totals[x])
					.toReversed()
					.map((x) => (
						<RarityButtonChip
							isActive={!filters.tier || filters.tier === x}
							key={x}
							onClick={() => changeTierFilter(x)}
							name={x}
							prefix={totals[x] + " "}
						/>
					))}
			</Grid>
			<AppTable table={table} isLoading={isFetching} />
		</>
	);
}

type FilterOptions = {
	chapter: number;
	tier?: string;
};

function showAchievement(x: Achievement, { chapter, tier }: FilterOptions) {
	if (x.chapter >= chapter) return false;

	if (tier && x.tier !== tier) return false;

	return true;
}
