import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import { AttributeSummary } from "@/features/attributes";
import { findByIds } from "@/data/helpers";
import { ChaptersChip, IdealChip, RarityChip } from "@/components/chips";
import type { Cell, ColumnDef } from "@tanstack/react-table";
import { useChapter, useSkills, useSkillTiers } from "@/data/api";
import { createCollapsedTierColumn } from "@/components/AppTable/columns";
import SkillButton from "./SkillButton";
import { getLevelOnChapter, getMaxLevel, getProgressGradient } from "./helpers";
import { RichTextSpan } from "@/components/RichTextSpan";
import { PrerequisiteList } from "./PrerequisiteList";

export const useColumns = () => {
	const skillTiers = useSkillTiers();
	const chapter = useChapter();

	return [
		{
			accessorKey: "name",
			header: "Skill",
			size: 120,
			enableSorting: true,
			cell: ({ row }) => {
				const chapter = useChapter();
				const max = getMaxLevel(row.original, skillTiers);
				const level = getLevelOnChapter(row.original, chapter);
				const levelText = `Lvl ${level} / ${max}`;

				return (
					<Grid container spacing={1} sx={{ alignItems: "baseline" }}>
						<Typography variant="subtitle1">{row.original.name}</Typography>
						<RarityChip name={row.original.tier} />
						<IdealChip skill={row.original} />
						<Chip size="small" label={levelText} />
					</Grid>
				);
			},
			meta: {
				bodyColSpan: 3,
				bodySx: (cell: Cell<Skill, unknown>) => {
					const chapter = useChapter();
					const row = cell.row.original;
					const value = getLevelOnChapter(row, chapter);
					const max = getMaxLevel(row, skillTiers);

					if (value > max) return { backgroundColor: "error.main" };
					if (value === max) return { backgroundColor: "#666" };

					const percent = ((1.0 * value) / max) * 100;
					return {
						background: getProgressGradient(percent, "#333333"),
					};
				},
			},
		},
		createCollapsedTierColumn<Skill>(skillTiers),
		{
			id: "level",
			accessorFn: (skill) => getLevelOnChapter(skill, chapter),
			header: "Level",
			size: 30,
			enableSorting: true,
			meta: {
				bodyColSpan: 0,
			},
			sortingFn: "basic",
		},
		{
			accessorKey: "attributes",
			header: "Attributes",
			size: 200,
			enableSorting: false,
			cell: ({ row }) => (
				<Box sx={{ fontSize: "0.9em" }}>
					<AttributeSummary gains={row.original.attributes} />
				</Box>
			),
		},
		{
			accessorKey: "description",
			header: "Description",
			enableSorting: false,
			size: 1000,
			cell: ({ row }) => {
				const { data: skills } = useSkills();
				const previousSkills = findByIds(skills, row.original.previous);
				return (
					<Stack>
						<RichTextSpan data={row.original.description} />
						<PrerequisiteList skill={row.original} headerSx={{ fontWeight: "bold" }} />
						{previousSkills.length > 0 && (
							<Stack direction="row" sx={{ flexWrap: "wrap", alignItems: "center" }}>
								<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
									Previous:
								</Typography>
								{previousSkills.map((x, index) => (
									<SkillButton key={index} item={x} />
								))}
							</Stack>
						)}
					</Stack>
				);
			},
		},
		{
			accessorKey: "gains",
			header: "Levels Gained",
			enableSorting: false,
			cell: ({ row }) => {
				const chapter = useChapter();
				return (
					<Stack>
						{row.original.gains
							.filter((x) => x.chapter <= chapter)
							.map((x, index) => (
								<Stack direction="row" key={index}>
									<Typography variant="body2">{x.note}</Typography>
									<ChaptersChip chapters={[x.chapter]} />
								</Stack>
							))}
					</Stack>
				);
			},
		},
	] as ColumnDef<Skill>[];
};
