import AppTable, { useAppTable } from "@/components/AppTable";
import { useAttributes, useChapter, useSkills, useStatusDictionary } from "@/data/api";
import { Box, Grid, Stack, Tooltip, Typography, type SxProps, type Theme } from "@mui/material";
import { calculateBaseAttributeValue, getCurrentBoost } from "../helpers";
import { useMemo } from "react";
import { createColumnHelper, type Cell, type ColumnDef } from "@tanstack/react-table";
import { formatNumber } from "@/data/helpers";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";

type AttributeAnalysis = {
	baseValue: number;
	titleBoost: number;
	calculatedValue: number;
	officialValue: string;
	lastOfficialValue: number;
	previousValue: number;
};

type AttributeAnalysisRow = {
	chapter: number;
	note: string;
	attributes: Record<string, AttributeAnalysis>;
};
const columnstyles: SxProps<Theme> = {
	".ch-note": {
		backgroundColor: "#582b00",
	},
	".error": {
		backgroundColor: "#af0000 !important",
	},
	".higher": {
		backgroundColor: "#b46c00 !important",
	},
	".lower": {
		backgroundColor: "#003b99 !important",
	},
};

const notes = [
	{ class: "ch-note", note: "Hover this chapter cell for a note" },
	{
		class: "error",
		note: "The official status went down in this attribute. See chapter note for details, if this is on purpose.",
	},
	{ class: "higher", note: "The calculated status is higher than the official status." },
	{ class: "lower", note: "The calculated status is lower than the official status." },
];

export function AnalysisPanel() {
	const chapter = useChapter();
	const { data: attributes } = useAttributes();
	const statuses = useStatusDictionary();
	const { data: skills } = useSkills();

	const columns: ColumnDef<AttributeAnalysisRow>[] = [
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

	const tableData = useMemo(
		() => getTableData(chapter, attributes, statuses, skills),
		[chapter, attributes, statuses, skills],
	);

	const table = useAppTable<AttributeAnalysisRow>({
		data: tableData,
		columns: columns,
		getRowId: (row) => row.chapter.toString(),
		initialState: { sorting: [{ id: "chapter", desc: true }] },
	});

	const isLoading = !attributes.length || !Object.keys(statuses).length || !skills.length;
	if (isLoading) return <LoadingPlaceholder text="Loading statuses, skill levels, and titles..." />;

	return (
		<Stack spacing={2} sx={columnstyles}>
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
		meta: {
			bodyClassName: (cell) => {
				const analysis = cell.row.original.attributes[attribute.name]!;
				if (analysis.lastOfficialValue < analysis.previousValue) return "error";
				const diff = analysis.calculatedValue - analysis.lastOfficialValue;
				return diff > 0.5 ? "higher" : diff < -0.5 ? "lower" : "";
			},
		},
		cell: ({ row }) => {
			const analysis = row.original.attributes[attribute.name]!;
			return <AnalysisStack analysis={analysis} />;
		},
	});
}

function AnalysisStack({ analysis }: { analysis: AttributeAnalysis }) {
	const diff = analysis.calculatedValue - analysis.lastOfficialValue;
	const diffDisplay = diff === 0 ? "--" : diff > 0 ? `+${formatNumber(diff)}` : formatNumber(diff);

	return (
		<Stack direction="column" sx={{ textAlign: "center" }}>
			<span>{analysis.officialValue}</span>
			<span>{diffDisplay}</span>
			<Tooltip
				title={<CalculationText analysis={analysis} />}
				arrow
				slotProps={{
					popper: { modifiers: [{ name: "offset", options: { offset: [0, -14] } }] },
				}}
			>
				<span>{formatNumber(analysis.calculatedValue)}</span>
			</Tooltip>
		</Stack>
	);
}

function CalculationText({ analysis }: { analysis: AttributeAnalysis }) {
	const base = formatNumber(analysis.baseValue);
	const boost = Math.round(analysis.titleBoost * 100) + "%";
	return `${base} + ${boost}`;
}

function getTableData(
	chapterLimit: number,
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
	for (let chapter = 1; chapter <= chapterLimit; chapter++) {
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
