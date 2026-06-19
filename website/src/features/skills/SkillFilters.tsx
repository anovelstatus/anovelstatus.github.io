import { Autocomplete, FormControl, FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { useAttributes, useChapter, useSkills, useSkillTiers } from "@/data/api";
import { RarityButtonChip } from "@/components/chips";
import { IDEAL_QUALITY, showSkill, type SkillFiltersOptions } from "./helpers";
import { uniq } from "es-toolkit";

export type SkillFiltersProps = {
	onChange: (filters: SkillFiltersOptions) => void;
};

export default function SkillFilters({ onChange }: SkillFiltersProps) {
	const chapter = useChapter();
	const { data: skills } = useSkills();
	const skillTiers = useSkillTiers();
	const { data: attributes } = useAttributes();

	const tags = useMemo(() => getTags(skills), [skills]);

	const [filters, setFilters] = useState<SkillFiltersOptions>({
		chapter,
		showFormerSkills: false,
		providesAttributes: [],
		idealOnly: false,
		tags: [],
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
	const changeTagsFilter = (tags: string[]) => {
		setFilters((filters) => ({ ...filters, tags }));
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
			<Stack direction="row" sx={{ flexWrap: "wrap", alignItems: "center" }}>
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
			</Stack>
			<Stack direction="row" sx={{ flexWrap: "wrap", alignItems: "center" }}>
				<FormControlLabel label="⭐ Ideal Only" control={<Switch onChange={toggleIdealFilter} />} />
				<FormControlLabel label="Show former skills" control={<Switch onChange={toggleFormerSkills} />} />
				<FormControl sx={{ margin: 1, width: 400 }}>
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
				<FormControl sx={{ margin: 1, width: 400 }}>
					<Autocomplete
						multiple={true}
						aria-description="Filter by skills with selected tags"
						id="attributes-filter"
						value={filters.tags}
						onChange={(_evt, value) => changeTagsFilter(value)}
						renderInput={(params) => <TextField {...params} label="Tagged as..." />}
						options={tags}
					/>
				</FormControl>
			</Stack>
		</>
	);
}

function getTotals(skills: Skill[], chapter: number): Partial<Record<string, number>> {
	const filters: SkillFiltersOptions = { chapter, providesAttributes: [], idealOnly: false, tags: [] };

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

function getTags(skills: Skill[]): string[] {
	return uniq(skills.filter((x) => x.tags?.length).flatMap((x) => x.tags)).sort();
}
