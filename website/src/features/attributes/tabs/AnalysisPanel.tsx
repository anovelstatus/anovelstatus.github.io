import AppTable, { useAppTable } from "@/components/AppTable";
import { useAttributes, useChapter, useLatestChapter, useSkills, useStatusDictionary } from "@/data/api";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { calculateBaseAttributeValue, getCurrentBoost } from "../helpers";
import { useEffect, useMemo, useState } from "react";
import { createColumnHelper, getFilteredRowModel, type Cell, type ColumnDef } from "@tanstack/react-table";
import { formatNumber } from "@/data/helpers";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import type { AttributeAnalysis, AttributeAnalysisRow } from "../analysis/types";
import { styles, getClass } from "../analysis/styles";
import { AnalysisStack } from "../analysis/AnalysisStack";
import { AnalysisCard } from "../analysis/AnalysisCard";

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
	const maxChapter = useLatestChapter();
	const { data: attributes } = useAttributes();
	const statuses = useStatusDictionary();
	const { data: skills } = useSkills();

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

	const tableData = useMemo(
		() => getTableData(maxChapter, attributes, statuses, skills),
		[maxChapter, attributes, statuses, skills],
	);

	const table = useAppTable<AttributeAnalysisRow>({
		data: tableData,
		columns: columns,
		getRowId: (row) => row.chapter.toString(),
		initialState: { sorting: [{ id: "chapter", desc: true }] },
		renderNarrowRow: (row) => <AnalysisCard key={row.id} data={row.original} />,
		getFilteredRowModel: getFilteredRowModel(),
		state: { globalFilter: filters },
		globalFilterFn: (row, _, filterValue: AnalysisFilterOptions) => {
			return row.original.chapter <= filterValue.chapter;
		},
	});

	const isLoading = !attributes.length || !Object.keys(statuses).length || !skills.length;
	if (isLoading) return <LoadingPlaceholder text="Loading statuses, skill levels, and titles..." />;

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
			bodyClassName: (cell) => getClass(cell.row.original.attributes[attribute.name]!),
		},
		cell: ({ row }) => {
			const analysis = row.original.attributes[attribute.name]!;
			return <AnalysisStack analysis={analysis} />;
		},
	});
}

function getTableData(
	maxChapter: number,
	attributes: Attribute.Details[],
	statuses: Record<number, Status>,
	skills: Skill[],
): AttributeAnalysisRow[] {
	const data: AttributeAnalysisRow[] = [];

	if (!attributes.length || !statuses[1]) {
		return data;
	}

	let previousStatus = statuses[1]!;
	let lastOfficialStatus = statuses[1]!;
	for (let chapter = 1; chapter <= maxChapter; chapter++) {
		const status = statuses[chapter];
		if (status) {
			lastOfficialStatus = status;
		}

		const row: AttributeAnalysisRow = {
			chapter: chapter,
			note: status?.note ?? "",
			attributes: {},
		};

		for (const attribute of attributes) {
			row.attributes[attribute.name] = calculateAttribute(
				previousStatus,
				lastOfficialStatus,
				status,
				chapter,
				attribute,
				skills,
			);
		}
		data.push(row);
		previousStatus = lastOfficialStatus;
	}

	return data;
}

function calculateAttribute(
	previousStatus: Status,
	lastOfficialStatus: Status,
	status: Status | undefined,
	chapter: number,
	attribute: Attribute.Details,
	skills: Skill[],
): AttributeAnalysis {
	const previousValue = previousStatus[attribute.name]!;
	const baseValue = calculateBaseAttributeValue(skills, attribute, chapter);
	const boost = getCurrentBoost(chapter, attribute);
	const calculatedValue = Math.round(baseValue * (1 + boost));
	let officialValue = "?";
	if (status) {
		officialValue = formatNumber(status[attribute.name] || 0);
	}
	const lastOfficialValue = (status ?? lastOfficialStatus)[attribute.name] || 0;

	return {
		previousValue,
		lastOfficialValue: lastOfficialValue,
		officialValue: officialValue,
		baseValue: baseValue,
		titleBoost: boost,
		calculatedValue: calculatedValue,
	};
}
