import { FormControlLabel, Switch, Typography } from "@mui/material";
import { toIdString } from "@/data/helpers";
import { useState, useEffect } from "react";
import SkillCard from "./SkillCard";
import AppTable, { useAppTable } from "@/components/AppTable";
import { useChapter, useSkills } from "@/data/api";
import { useColumns } from "./columns";
import { getFilteredRowModel } from "@tanstack/react-table";
import SkillFilters from "./SkillFilters";
import { showSkill, type SkillFiltersOptions } from "./helpers";

export default function SkillTable() {
	const chapter = useChapter();
	const { data: skills, isLoading } = useSkills();

	const [filters, setFilters] = useState<SkillFiltersOptions>({
		chapter,
		showFormerSkills: false,
		providesAttributes: [],
		idealOnly: false,
		tags: [],
	});

	const columns = useColumns();

	useEffect(() => {
		setFilters((filters) => ({ ...filters, chapter: chapter }));
	}, [chapter]);

	const [columnVisibility, setColumnVisibility] = useState({ gains: false });

	const toggleNotesColumn = () => {
		setColumnVisibility((visibility) => ({
			...visibility,
			gains: !visibility.gains,
		}));
	};

	const table = useAppTable<Skill>({
		data: skills,
		columns,
		getRowId: (row) => toIdString(row),
		initialState: {
			sorting: [{ id: "name", desc: false }],
		},
		narrowBreakpoint: "md",
		renderNarrowRow: ({ original }) => <SkillCard key={toIdString(original)} id={original} />,
		getFilteredRowModel: getFilteredRowModel(),
		state: { globalFilter: filters, columnVisibility },
		globalFilterFn: (row, _, filterValue: SkillFiltersOptions) => {
			return showSkill(row.original, filterValue);
		},
	});

	return (
		<>
			<SkillFilters onChange={setFilters} />
			<FormControlLabel
				label="Show levels gained by chapter"
				control={<Switch onChange={toggleNotesColumn} value={columnVisibility.gains} />}
			/>
			<Typography>
				Showing {table.getRowCount()}/{skills.length} skills
			</Typography>
			<AppTable isLoading={isLoading} table={table} />
		</>
	);
}
