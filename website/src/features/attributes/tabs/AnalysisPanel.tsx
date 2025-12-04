import AppTable, { useAppTable } from "@/components/AppTable";
import { useAttributes, useChapter, useSkills, useStatusDictionary } from "@/data/api";
import { Autocomplete, FormControl, FormGroup, Stack, TextField, Typography } from "@mui/material";
import { calculateBaseAttributeValue, getCurrentBoost } from "../helpers";
import { useMemo, useState } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { formatNumber } from "@/data/helpers";

type AttributeAnalysisRow = {
	chapter: number;
	baseValue: number;
	titleBoost: number;
	calculatedValue: number;
	officialValue: string;
	lastOfficialValue: number;
};

const columns = [
	createColumnHelper<AttributeAnalysisRow>().accessor("chapter", { header: "Chapter" }),
	createColumnHelper<AttributeAnalysisRow>().accessor("officialValue", { header: "Official", enableSorting: false }),
	createColumnHelper<AttributeAnalysisRow>().display({
		id: "calculation",
		header: "Calculated",
		enableSorting: false,
		cell: ({ row }) => {
			const base = formatNumber(row.original.baseValue);
			const boost = Math.round(row.original.titleBoost * 100) + "%";
			const total = formatNumber(row.original.calculatedValue);
			return `${total} (${base} + ${boost})`;
		},
	}),
	createColumnHelper<AttributeAnalysisRow>().display({
		id: "difference",
		header: "Difference",
		enableSorting: false,
		cell: ({ row }) => {
			const diff = row.original.calculatedValue - row.original.lastOfficialValue;
			return diff === 0 ? "--" : diff > 0 ? `+${formatNumber(diff)}` : formatNumber(diff);
		},
	}),
	// todo: bring in note that is currently in comments on the Sheet
] as ColumnDef<AttributeAnalysisRow>[];

export function AnalysisPanel() {
	const chapter = useChapter();
	const { data: attributes } = useAttributes();
	const statuses = useStatusDictionary();
	const { data: skills } = useSkills();

	const [selectedAttribute, setSelectedAttribute] = useState<Attribute.Details | null>(null);

	const tableData = useMemo(
		() => getTableData(chapter, selectedAttribute, statuses, skills),
		[chapter, selectedAttribute, statuses, skills],
	);

	const table = useAppTable<AttributeAnalysisRow>({
		data: tableData,
		columns: columns,
		getRowId: (row) => row.chapter.toString(),
		initialState: { sorting: [{ id: "chapter", desc: true }] },
	});

	const isLoading = !attributes.length || !Object.keys(statuses).length || !skills.length;

	return (
		<Stack spacing={2}>
			<Typography variant="body2">Under Construction 🚧</Typography>
			<Typography variant="body2">
				Pick an attribute to view its growth since the beginning, and compare the calculated numbers to the official
				numbers.
			</Typography>
			<FormGroup>
				<FormControl sx={{ m: 1, width: 300 }}>
					<Autocomplete
						multiple={false}
						aria-description="Pick attribute to analyse"
						id="attributes-filter"
						value={selectedAttribute}
						onChange={(_evt, value) => setSelectedAttribute(value)}
						renderInput={(params) => <TextField {...params} label="Attribute:" />}
						options={attributes}
						groupBy={(x) => x.category}
						getOptionLabel={(x) => x.name}
						getOptionKey={(x) => x.name}
					/>
				</FormControl>
			</FormGroup>
			{selectedAttribute && <AppTable isLoading={isLoading} table={table} />}
		</Stack>
	);
}

function getTableData(
	chapterLimit: number,
	attribute: Attribute.Details | null,
	statuses: Record<number, Status>,
	skills: Skill[],
): AttributeAnalysisRow[] {
	const data: AttributeAnalysisRow[] = [];

	if (!attribute || !statuses[1]) {
		return data;
	}

	let previousStatus = statuses[1]!;
	for (let chapter = 1; chapter <= chapterLimit; chapter++) {
		const baseValue = calculateBaseAttributeValue(skills, attribute, chapter);
		const boost = getCurrentBoost(chapter, attribute);
		const calculatedValue = Math.round(baseValue * (1 + boost));
		const status = statuses[chapter];
		let officialValue = "?";
		if (status) {
			previousStatus = status;
			officialValue = formatNumber(status[attribute.name] || 0);
		}
		const lastOfficialValue = (status ?? previousStatus)[attribute.name] || 0;
		data.push({
			chapter: chapter,
			lastOfficialValue: lastOfficialValue,
			officialValue: officialValue,
			baseValue: baseValue,
			titleBoost: boost,
			calculatedValue: calculatedValue,
		});
	}

	return data;
}
