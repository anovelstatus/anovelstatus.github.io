import { Stack, Typography } from "@mui/material";
import { useChapter, useTitles } from "@/data/api";
import { LoreSection } from "@/components/LoreSection";
import AppTable, { useAppTable } from "@/components/AppTable";
import { toIdString } from "@/data/helpers";
import { columnstyles, useColumns } from "./columns";
import { useEffect, useState } from "react";
import { getFilteredRowModel } from "@tanstack/react-table";

export default function TreesOfMerit() {
	const chapter = useChapter();
	const { data: titles, isLoading } = useTitles();
	const columns = useColumns();
	const [filters, setFilters] = useState<FilterOptions>({ chapter });
	useEffect(() => {
		setFilters((filters) => ({ ...filters, chapter: chapter }));
	}, [chapter]);

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
		state: { globalFilter: filters },

		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn: (row, _, filterValue: FilterOptions) => {
			return showTitle(row.original, filterValue);
		},
		// todo: narrow layout
		//narrowBreakpoint: "md",
		//renderNarrowRow: ({ original }) => <TitleCard key={toIdString(original)} id={original} />,
	});

	return (
		<Stack>
			<LoreSection topic="Titles" subtopic="Merits" />
			<Typography variant="h4">🚧 Under Construction, there's still a lot of bugs and missing info.</Typography>
			<AppTable table={table} isLoading={isLoading} sx={{ overflowX: "scroll", ...columnstyles }} />
		</Stack>
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
