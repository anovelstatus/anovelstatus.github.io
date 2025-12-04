import { Box, Grid, Stack, type SxProps, type Theme, Typography } from "@mui/material";
import { AttributeSummary } from "@/features/attributes";
import { findByIds, getCurrentLevel } from "@/data/helpers";
import { ChaptersChip, RarityChip } from "@/components/chips";
import type { ColumnDef } from "@tanstack/react-table";
import { useChapter, useSkills, useSkillTiers } from "@/data/api";
import { createCollapsedTierColumn } from "@/components/AppTable/columns";
import SkillButton from "./SkillButton";

export const columnstyles: SxProps<Theme> = {
	".maxed-skill": {
		backgroundColor: "text.disabled",
	},
	".too-many-levels": {
		backgroundColor: "error.main",
	},
};

export const useColumns = () => {
	const skillTiers = useSkillTiers();

	return [
		{
			accessorKey: "name",
			header: "Skill",
			size: 200,
			enableSorting: true,
			cell: ({ row }) => (
				<Grid container spacing={1} alignItems="baseline">
					<Typography variant="subtitle1">{row.original.name}</Typography>
					<RarityChip name={row.original.tier} />
				</Grid>
			),
			meta: {
				bodyColSpan: 2,
			},
		},
		createCollapsedTierColumn<Skill>(skillTiers),
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
			accessorKey: "level",
			header: "Level",
			minSize: 100,
			enableSorting: true,
			cell: ({ row }) => {
				const chapter = useChapter();
				const max = (getSkillRank(skillTiers, row.original.tier) + 1) * 20;
				const level = getCurrentLevel(row.original, chapter);
				return `${level} / ${max}`;
			},
			meta: {
				bodyClassName: (cell) => {
					const chapter = useChapter();
					const row = cell.row.original;
					const value = getCurrentLevel(row, chapter);
					const max = (getSkillRank(skillTiers, row.tier) + 1) * 20;
					if (value === max) return "maxed-skill";
					if (value > max) return "too-many-levels";
					return "";
				},
			},
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
			accessorKey: "gains",
			header: "Notes",
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

function getSkillRank(skillTiers: string[], tier: string): number {
	return skillTiers.findIndex((x) => tier.startsWith(x));
}
