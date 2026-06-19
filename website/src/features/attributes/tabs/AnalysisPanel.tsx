import AppTable, { useAppTable } from "@/components/AppTable";
import { useAttributes, useChapter } from "@/data/api";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { createColumnHelper, getFilteredRowModel, type Cell, type ColumnDef } from "@tanstack/react-table";
import type { AttributeAnalysisRow } from "@/features/attributes/analysis/types";
import { styles, getClass } from "@/features/attributes/analysis/styles";
import { AnalysisStack } from "@/features/attributes/analysis/AnalysisStack";
import { AnalysisCard } from "@/features/attributes/analysis/AnalysisCard";
import { useAttributeAnalysis } from "@/features/attributes/analysis/helpers";

const notes = [
	{ class: "ch-note", note: "Hover this chapter cell for a note" },
	{
		class: "error",
		note: "The official status went down in this attribute. See chapter note for details, if this is on purpose.",
	},
	{ class: "higher", note: "The calculated status is higher than the official status." },
	{ class: "lower", note: "The calculated status is lower than the official status." },
];

export type AnalysisFilterOptions = {
	chapter: number;
};

export function AnalysisPanel() {
	const chapter = useChapter();
	const { data: attributes } = useAttributes();

	const [filters, setFilters] = useState<AnalysisFilterOptions>({ chapter });
	useEffect(() => {
		setFilters((filters) => ({ ...filters, chapter: chapter }));
	}, [chapter]);

	const columns = useMemo(() => {
		return [
			createColumnHelper<AttributeAnalysisRow>().accessor("chapter", {
				header: "Chapter",
				enableSorting: true,
				meta: {
					bodySx: { textAlign: "center" },
					bodyClassName: (cell: Cell<AttributeAnalysisRow, unknown>) => (cell.row.original.note ? "ch-note" : ""),
					title: (cell: Cell<AttributeAnalysisRow, unknown>) => cell.row.original.note,
				},
			}),
			...attributes.map(createAttributeColumn),
		] as ColumnDef<AttributeAnalysisRow>[];
	}, [attributes]);

	const tableData = useAttributeAnalysis();

	const table = useAppTable<AttributeAnalysisRow>({
		data: tableData,
		columns: columns,
		enableSorting: false,
		getRowId: (row) => row.chapter.toString(),
		renderNarrowRow: (row) => <AnalysisCard key={row.id} data={row.original} />,
		getFilteredRowModel: getFilteredRowModel(),
		state: { globalFilter: filters },
		globalFilterFn: (row, _, filterValue: AnalysisFilterOptions) => {
			return row.original.chapter <= filterValue.chapter;
		},
	});

	const isLoading = !tableData.length;

	return (
		<Stack spacing={2} sx={styles}>
			<Typography variant="body2">
				Each attribute is shown as: Official, Difference, then Calculated. Hover over the calculated value for details.
			</Typography>
			<Typography variant="body2">Some highlighting is automatically applied based on a few things:</Typography>
			<Grid container spacing={1} columns={{ xs: 4, sm: 8, md: 12, lg: 16 }}>
				{notes.map((obj) => (
					<Grid size={4} key={obj.class}>
						<Box sx={{ padding: 2, borderRadius: "16px" }} className={obj.class}>
							{obj.note}
						</Box>
					</Grid>
				))}
			</Grid>
			<AppTable isLoading={isLoading} table={table} size="small" />
		</Stack>
	);
}

function createAttributeColumn(attribute: Attribute.Details) {
	return createColumnHelper<AttributeAnalysisRow>().display({
		id: attribute.name,
		header: attribute.name,
		enableSorting: false,
		enableGlobalFilter: false,
		meta: {
			bodyClassName: (cell) => getClass(cell.row.original.attributes[attribute.index]!),
		},
		cell: ({ row }) => {
			const analysis = row.original.attributes[attribute.index]!;
			return useMemo(() => <AnalysisStack analysis={analysis} />, [analysis]);
		},
	});
}
