import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import { AttributeSummary } from "@/features/attributes";
import { findByIds, getCurrentLevel, getTierRank } from "@/data/helpers";
import { ChaptersChip, IdealChip, RarityChip } from "@/components/chips";
import type { Cell, ColumnDef } from "@tanstack/react-table";
import { useChapter, useSkills, useSkillTiers } from "@/data/api";
import { createCollapsedTierColumn } from "@/components/AppTable/columns";
import SkillButton from "./SkillButton";
import { getPrerequisiteList } from "./helpers";

export const useColumns = () => {
	const skillTiers = useSkillTiers();

	return [
		{
			accessorKey: "name",
			header: "Skill",
			size: 100,
			enableSorting: true,
			cell: ({ row }) => {
				const chapter = useChapter();
				const max = (getTierRank(skillTiers, row.original.tier) + 1) * 20;
				const level = getCurrentLevel(row.original, chapter);
				const levelText = `Lvl ${level} / ${max}`;

				return (
					<Grid container spacing={1} alignItems="baseline">
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
					const value = getCurrentLevel(row, chapter);
					const max = (getTierRank(skillTiers, row.tier) + 1) * 20;

					if (value > max) return { backgroundColor: "error.main" };
					if (value === max) return { backgroundColor: "#666" };

					const color = "#333";
					const transparent = "#33333300";
					if (value === max) return { backgroundColor: color };
					const percent = ((1.0 * value) / max) * 100;
					// Gradient from color to transparent based on percent
					return {
						background: `linear-gradient(90deg, ${color} 0%, ${color} ${percent}%, ${transparent} ${percent}%, ${transparent} 100%)`,
					};
				},
			},
		},
		createCollapsedTierColumn<Skill>(skillTiers),
		{
			accessorKey: "level",
			header: "Level",
			size: 20,
			enableSorting: true,
			meta: {
				bodyColSpan: 0,
			},
		},
		{
			accessorKey: "Attributes",
			header: "Attributes",
			minSize: 100,
			enableSorting: false,
			cell: ({ row }) => (
				<Box fontSize={"0.9em"}>
					<AttributeSummary item={row.original} />
				</Box>
			),
		},
		{
			accessorKey: "previous",
			header: "Previously",
			enableSorting: false,
			cell: ({ row }) => {
				const { data: skills } = useSkills();
				const previousSkills = findByIds(skills, row.original.previous);
				if (!previousSkills) return <></>;
				return (
					<Stack>
						{previousSkills.map((x, index) => (
							<SkillButton key={index} skill={x} />
						))}
					</Stack>
				);
			},
		},
		{
			accessorKey: "description",
			header: "Description",
			enableSorting: false,
			cell: ({ row }) => {
				return <Typography variant="body2">{row.original.description}</Typography>;
			},
		},
		{
			accessorKey: "prerequisites",
			header: "Ideal Prerequisites",
			enableSorting: false,
			cell: ({ row }) => {
				const list = getPrerequisiteList(row.original);
				return <Stack> {list} </Stack>;
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
