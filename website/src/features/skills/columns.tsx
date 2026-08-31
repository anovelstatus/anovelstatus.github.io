import { Box, Chip, Grid, Stack, Typography, type SxProps } from "@mui/material";
import { AttributeSummary } from "@/features/attributes";
import { findByIds } from "@/data/helpers";
import { ChaptersChip, IdealChip, RarityChip } from "@/components/chips";
import { createColumnHelper, type Cell } from "@tanstack/react-table";
import { useChapter, useSkills, useSkillTiers } from "@/data/api";
import { createCollapsedTierColumn } from "@/components/AppTable/columns";
import SkillButton from "./SkillButton";
import { getLevelOnChapter, getMaxLevel, getProgressGradient } from "./helpers";
import { RichTextSpan } from "@/components/RichTextSpan";
import { PrerequisiteList } from "./PrerequisiteList";
import { WrappedRow } from "@/components/WrappedRow";
import type { AppTableFeatures } from "@/components/AppTable";

export const useColumns = () => {
	const skillTiers = useSkillTiers();
	const chapter = useChapter();
	const columnHelper = createColumnHelper<AppTableFeatures, Skill>();

	return columnHelper.columns([
		columnHelper.accessor("name", {
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

			spanColumns: 3,
			bodySx: (_cell: unknown): SxProps => {
				// todo: fix typing
				const cell = _cell as Cell<AppTableFeatures, Skill>;
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
		}),
		createCollapsedTierColumn(columnHelper, skillTiers),
		columnHelper.accessor((x) => getLevelOnChapter(x, chapter), {
			id: "level",
			header: "Level",
			size: 30,
			enableSorting: true,
			spanColumns: 0,
			sortFn: "basic",
		}),
		columnHelper.accessor("attributes", {
			header: "Attributes",
			size: 200,
			enableSorting: false,
			cell: ({ row }) => (
				<Box sx={{ fontSize: "0.9em" }}>
					<AttributeSummary gains={row.original.attributes} />
				</Box>
			),
		}),
		columnHelper.accessor("description", {
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
							<WrappedRow>
								<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
									Previous:
								</Typography>
								{previousSkills.map((x, index) => (
									<SkillButton key={index} item={x} />
								))}
							</WrappedRow>
						)}
					</Stack>
				);
			},
		}),
		columnHelper.accessor("gains", {
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
									<ChaptersChip chapters={x.chapter} />
								</Stack>
							))}
					</Stack>
				);
			},
		}),
	]);
};
