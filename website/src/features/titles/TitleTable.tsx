import { Grid, Typography } from "@mui/material";
import { toIdString } from "@/data/helpers";
import { useState, useEffect } from "react";
import TitleCard from "./TitleCard";
import AppTable, { useAppTable } from "@/components/AppTable";
import { useChapter, useMetalTiers, useTitles } from "@/data/api";
import { useColumns, columnstyles } from "./columns";
import { getExpandedRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { getPreviousTitleChain } from "./helpers";
import { RarityButtonChip } from "@/components/chips";

export default function TitleTable() {
	const chapter = useChapter();
	const { data: titles, isFetching } = useTitles();
	const metalTiers = useMetalTiers();
	const columns = useColumns();

	const [filters, setFilters] = useState<FilterOptions>({ chapter });

	useEffect(() => {
		setFilters((filters) => ({ ...filters, chapter: chapter }));
	}, [chapter]);

	const currentTitles = titles.filter((x) => showTitle(x, { chapter }));

	const totals = currentTitles.reduce(
		(totals, title) => {
			if (!totals[title.tier]) totals[title.tier] = 0;
			totals[title.tier]!++;
			return totals;
		},
		{} as Partial<Record<string, number>>,
	);

	const changeTierFilter = (tier: string) => {
		setFilters((filters) => {
			if (filters.tier === tier) return { ...filters, tier: undefined };
			return { ...filters, tier: tier };
		});
	};

	const table = useAppTable<Title>({
		data: titles,
		columns,
		getRowId: (row) => toIdString(row),
		initialState: {
			sorting: [
				{ id: "tier", desc: true },
				{ id: "name", desc: false },
			],
		},
		narrowBreakpoint: "md",
		renderNarrowRow: ({ original }) => <TitleCard key={toIdString(original)} id={original} />,
		getFilteredRowModel: getFilteredRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		maxLeafRowFilterDepth: 0,
		getSubRows: (row) => getPreviousTitleChain(titles, row),
		state: { globalFilter: filters },
		globalFilterFn: (row, _, filterValue: FilterOptions) => {
			return showTitle(row.original, filterValue);
		},
	});

	return (
		<>
			<Typography variant="h4" gutterBottom>
				Priam's Titles
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
			<AppTable table={table} isLoading={isFetching} sx={columnstyles} />
		</>
	);
}

type FilterOptions = {
	chapter: number;
	tier?: string;
};

function showTitle(x: Title, { chapter, tier }: FilterOptions) {
	if (x.chapter >= chapter) return false;

	if (x.replaced && x.replaced <= chapter) return false;

	if (tier && x.tier !== tier) return false;

	return true;
}
