import {
	Autocomplete,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import { getCurrentLevel, toIdString } from "@/data/helpers";
import { useState, useEffect, useMemo } from "react";
import SkillCard from "./SkillCard";
import AppTable, { useAppTable } from "@/components/AppTable";
import { useAttributes, useChapter, useSkills, useSkillTiers } from "@/data/api";
import { columnstyles, useColumns } from "./columns";
import { getFilteredRowModel } from "@tanstack/react-table";
import { RarityButtonChip } from "@/components/chips";

export default function SkillTable() {
	const chapter = useChapter();
	const { data: skills, isFetching } = useSkills();
	const skillTiers = useSkillTiers();
	const { data: attributes } = useAttributes();

	const [filters, setFilters] = useState<FilterOptions>({ chapter, showFormerSkills: false, providesAttributes: [] });

	const columns = useColumns();

	useEffect(() => {
		setFilters((filters) => ({ ...filters, chapter: chapter }));
	}, [chapter]);

	const [columnVisibility, setColumnVisibility] = useState({ gains: false });

	const totals = useMemo(() => getTotals(skills, chapter), [chapter, skills]);

	const toggleFormerSkills = () => {
		setFilters((filters) => ({ ...filters, showFormerSkills: !filters.showFormerSkills }));
	};
	const changeAttributesFilter = (attributes: Attribute.Details[]) => {
		setFilters((filters) => ({ ...filters, providesAttributes: attributes }));
	};

	const changeTierFilter = (tier: string) => {
		setFilters((filters) => {
			if (filters.tier === tier) return { ...filters, tier: undefined };
			return { ...filters, tier: tier };
		});
	};

	const toggleNotesColumn = () => {
		setColumnVisibility((visibility) => ({ ...visibility, gains: !visibility.gains }));
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
		globalFilterFn: (row, _, filterValue: FilterOptions) => {
			return showSkill(row.original, filterValue);
		},
	});

	return (
		<>
			<Typography variant="h4" gutterBottom>
				Priam's Skills
			</Typography>
			<Grid container spacing={2}>
				{skillTiers
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
			<Grid container spacing={2}>
				<FormGroup>
					<FormControlLabel label="Show Former Skills" control={<Checkbox onChange={toggleFormerSkills} />} />
					<FormControlLabel
						label="Show Notes"
						control={<Checkbox onChange={toggleNotesColumn} value={columnVisibility.gains} />}
					/>
					<FormControl sx={{ m: 1, width: 300 }}>
						<Autocomplete
							multiple={true}
							aria-description="Filter by skills which provide selected attributes"
							id="attributes-filter"
							value={filters.providesAttributes}
							onChange={(_evt, value) => changeAttributesFilter(value)}
							renderInput={(params) => <TextField {...params} label="Provides..." />}
							options={attributes}
							groupBy={(x) => x.category}
							getOptionLabel={(x) => x.name}
							getOptionKey={(x) => x.name}
						/>
					</FormControl>
				</FormGroup>
			</Grid>
			<AppTable sx={columnstyles} isLoading={isFetching} table={table} />
		</>
	);
}

type FilterOptions = {
	chapter: number;
	showFormerSkills?: boolean;
	providesAttributes: Attribute.Details[];
	tier?: string;
};

function getTotals(skills: Skill[], chapter: number): Partial<Record<string, number>> {
	const filters = { chapter, providesAttributes: [] };

	return skills
		.filter((x) => showSkill(x, filters))
		.reduce(
			(totals, skill) => {
				if (!totals[skill.tier]) totals[skill.tier] = 0;
				totals[skill.tier]!++;
				return totals;
			},
			{} as Partial<Record<string, number>>,
		);
}

function showSkill(x: Skill, { chapter, showFormerSkills, providesAttributes, tier }: FilterOptions) {
	if (tier && x.tier !== tier) return false;

	if (getCurrentLevel(x, chapter) <= 0) return false;

	if (!showFormerSkills && x.replaced) return false;

	if (providesAttributes.length) {
		for (const attr of providesAttributes) {
			if (!x[attr.name]) return false;
		}
	}

	return true;
}
