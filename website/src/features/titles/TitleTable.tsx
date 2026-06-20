import { Button, Chip, Stack, Typography } from "@mui/material";
import { toIdString } from "@/data/helpers";
import { useState, useEffect } from "react";
import TitleCard from "./TitleCard";
import AppTable, { useAppTable } from "@/components/AppTable";
import { useChapter, useMetalTiers, useTitles } from "@/data/api";
import { useColumns, columnstyles } from "./columns";
import { getExpandedRowModel, getFilteredRowModel, type ExpandedState } from "@tanstack/react-table";
import { getPreviousTitleChain } from "./helpers";
import { RarityButtonChip } from "@/components/chips";
import { LoreSection } from "@/components/LoreSection";

export default function TitleTable() {
	const chapter = useChapter();
	const { data: titles, isLoading } = useTitles();
	const metalTiers = useMetalTiers();
	const columns = useColumns();
	const [expanded, setExpanded] = useState<ExpandedState>({});
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
		getRowId: (row, _, parent) => toIdString(row) + toIdString(parent?.original),
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
		getRowCanExpand: (row) => !row.parentId && row.subRows.length > 0,
		getIsRowExpanded: (row) => !row.parentId && (expanded === true || expanded[row.id] === true),
		getSubRows: (row) => {
			return getPreviousTitleChain(titles, row);
		},
		state: { globalFilter: filters, expanded },
		onExpandedChange: setExpanded,
		globalFilterFn: (row, _, filterValue: FilterOptions) => {
			return showTitle(row.original, filterValue);
		},
	});

	return (
		<>
			<Typography variant="h4" gutterBottom>
				Priam's Titles <Chip label={currentTitles.length} sx={{ fontWeight: "bold" }} />
			</Typography>
			<LoreSection topic="Titles" />
			<Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap" }}>
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

				<Button
					disabled={table.getIsAllRowsExpanded()}
					variant="contained"
					onClick={() => table.toggleAllRowsExpanded(true)}
					sx={{ display: { md: "inline-block", xs: "none" } }}
				>
					Expand All
				</Button>

				<Button
					disabled={!table.getIsSomeRowsExpanded()}
					variant="contained"
					onClick={() => table.toggleAllRowsExpanded(false)}
					sx={{ display: { md: "inline-block", xs: "none" } }}
				>
					Collapse All
				</Button>
			</Stack>
			<Typography>
				Showing {table.getRowCount()}/{titles.length} skills
			</Typography>
			<AppTable table={table} isLoading={isLoading} sx={columnstyles} />
		</>
	);
}

type FilterOptions = {
	chapter: number;
	tier?: string;
};

function showTitle(x: Title, { chapter, tier }: FilterOptions) {
	if (x.chapter > chapter) return false;

	if (x.replaced && x.replaced <= chapter) return false;

	if (tier && x.tier !== tier) return false;

	return true;
}
