import { Autocomplete, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, TextField } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { useAttributes, useChapter, useSkills, useSkillTiers } from "@/data/api";
import { RarityButtonChip } from "@/components/chips";
import { IDEAL_QUALITY, showSkill, type SkillFiltersOptions } from "./helpers";

export type SkillFiltersProps = {
	onChange: (filters: SkillFiltersOptions) => void;
};

export default function SkillFilters({ onChange }: SkillFiltersProps) {
	const chapter = useChapter();
	const { data: skills } = useSkills();
	const skillTiers = useSkillTiers();
	const { data: attributes } = useAttributes();

	const [filters, setFilters] = useState<SkillFiltersOptions>({
		chapter,
		showFormerSkills: false,
		providesAttributes: [],
		idealOnly: false,
	});

	useEffect(() => {
		onChange(filters);
	}, [filters]);

	useEffect(() => {
		setFilters((filters) => ({ ...filters, chapter: chapter }));
	}, [chapter]);

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

	const toggleIdealFilter = () => {
		setFilters((filters) => ({ ...filters, idealOnly: !filters.idealOnly }));
	};

	return (
		<>
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
					<FormControlLabel
						label={totals[IDEAL_QUALITY] + " ⭐ Ideal Only"}
						control={<Checkbox onChange={toggleIdealFilter} />}
					/>
					<FormControlLabel label="Show Former Skills" control={<Checkbox onChange={toggleFormerSkills} />} />
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
		</>
	);
}

function getTotals(skills: Skill[], chapter: number): Partial<Record<string, number>> {
	const filters: SkillFiltersOptions = { chapter, providesAttributes: [], idealOnly: false };

	return skills
		.filter((x) => showSkill(x, filters))
		.reduce(
			(totals, skill) => {
				if (!totals[skill.tier]) totals[skill.tier] = 0;
				totals[skill.tier]!++;
				if (skill.quality === IDEAL_QUALITY) totals[IDEAL_QUALITY]!++;
				return totals;
			},
			{ [IDEAL_QUALITY]: 0 } as Partial<Record<string, number>>,
		);
}
