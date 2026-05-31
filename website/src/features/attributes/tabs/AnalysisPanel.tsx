import AppTable, { useAppTable } from "@/components/AppTable";
import { useAttributes, useChapter, useSkills, useStatusDictionary } from "@/data/api";
import { Stack, Typography } from "@mui/material";
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
};
type AttributeAnalysisRow = {
	chapter: number;
	note: string;
	attributes: Record<string, AttributeAnalysis>;
};

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
				bodySx: (cell: Cell<AttributeAnalysisRow, unknown>) => ({
					background: cell.row.original.note ? "#582b00" : "inherit",
					textAlign: "center",
				}),
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
		<Stack spacing={2}>
			<Typography variant="body2">Under Construction 🚧</Typography>
			<Typography variant="body2">Each attribute is shown as: [Official, Difference, Calculated]</Typography>
			<AppTable isLoading={isLoading} table={table} />
		</Stack>
	);
}

function createAttributeColumn(attribute: Attribute.Details) {
	return createColumnHelper<AttributeAnalysisRow>().display({
		id: attribute.name,
		header: attribute.name,
		enableSorting: false,
		cell: ({ row }) => {
			const analysis = row.original.attributes[attribute.name]!;
			const official = analysis.officialValue;

			const base = formatNumber(analysis.baseValue);
			const boost = Math.round(analysis.titleBoost * 100) + "%";
			const total = formatNumber(analysis.calculatedValue);

			const diff = analysis.calculatedValue - analysis.lastOfficialValue;
			const diffDisplay = diff === 0 ? "--" : diff > 0 ? `+${formatNumber(diff)}` : formatNumber(diff);

			return (
				<Stack direction="column" sx={{ textAlign: "center" }}>
					<span>{official}</span>
					<span>{diffDisplay}</span>
					<span title={`(${base} + ${boost})`}>{total}</span>
				</Stack>
			);
		},
	});
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
	for (let chapter = 1; chapter <= chapterLimit; chapter++) {
		const status = statuses[chapter];
		if (status) {
			previousStatus = status;
		}

		const row: AttributeAnalysisRow = {
			chapter: chapter,
			note: status?.note ?? "",
			attributes: {},
		};

		for (const attribute of attributes) {
			row.attributes[attribute.name] = calculateAttribute(previousStatus, status, chapter, attribute, skills);
		}
		data.push(row);
	}

	return data;
}

function calculateAttribute(
	previousStatus: Status,
	status: Status | undefined,
	chapter: number,
	attribute: Attribute.Details,
	skills: Skill[],
) {
	const baseValue = calculateBaseAttributeValue(skills, attribute, chapter);
	const boost = getCurrentBoost(chapter, attribute);
	const calculatedValue = Math.round(baseValue * (1 + boost));
	let officialValue = "?";
	if (status) {
		officialValue = formatNumber(status[attribute.name] || 0);
	}
	const lastOfficialValue = (status ?? previousStatus)[attribute.name] || 0;

	return {
		lastOfficialValue: lastOfficialValue,
		officialValue: officialValue,
		baseValue: baseValue,
		titleBoost: boost,
		calculatedValue: calculatedValue,
	};
}
