import { Card, CardHeader, CardContent, Box, Stack, Typography, Chip } from "@mui/material";
import { ChaptersChip, IdealChip, RarityChip } from "@/components/chips";
import { findByIds, sameId } from "@/data/helpers";
import { AttributeSummary } from "@/features/attributes";
import { useChapter, useSkills, useSkillTiers } from "@/data/api";
import SkillButton from "./SkillButton";
import { getLevelOnChapter, getMaxLevel, getProgressGradient } from "./helpers";
import LoadingCard from "@/components/LoadingCard";
import { RichTextSpan } from "@/components/RichTextSpan";
import { PrerequisiteList } from "./PrerequisiteList";

type SkillCardProps = { id: TieredId } & PropsWithStyle;

export default function SkillCard({ id, sx }: SkillCardProps) {
	const skillTiers = useSkillTiers();
	const chapter = useChapter();

	if (!id) return <Box>Skill not found</Box>;

	const { data: skills } = useSkills();
	const skill = skills.find((x) => sameId(x, id));
	if (!skill) return <LoadingCard headerOnly sx={sx} />;

	const previousSkills = findByIds(skills, skill.previous);

	const max = getMaxLevel(skill, skillTiers);
	const level = getLevelOnChapter(skill, chapter);
	const levelText = `Lvl ${level} / ${max}`;
	const gradient = getProgressGradient(((1.0 * level) / max) * 100, "#333333");

	return (
		<Card sx={sx}>
			<CardHeader
				sx={{ background: gradient }}
				title={
					<Stack direction="row" sx={{ flexWrap: "wrap", alignItems: "center" }}>
						{skill.name} <RarityChip name={skill.tier} />
						<IdealChip skill={skill} />
						<Chip size="small" label={levelText} />
					</Stack>
				}
			/>
			<CardContent>
				<Stack>
					<RichTextSpan data={skill.description} />
					<AttributeSummary gains={skill.attributes} />
					<PrerequisiteList skill={skill} headerSx={{ marginTop: "20px", fontWeight: "bold" }} />
					{previousSkills.length > 0 && (
						<Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", alignItems: "center" }}>
							<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
								Previous:
							</Typography>
							{previousSkills.map((x, index) => {
								return <SkillButton key={index} item={x} />;
							})}
						</Stack>
					)}
					<Typography variant="subtitle1" sx={{ marginTop: "20px", fontWeight: "bold" }}>
						Levels Gained:
					</Typography>
					{skill.gains
						.filter((x) => x.chapter <= chapter)
						.map((x, index) => (
							<Stack direction="row" key={index}>
								<Typography variant="body2">{x.note}</Typography>
								<ChaptersChip chapters={[x.chapter]} />
							</Stack>
						))}
				</Stack>
			</CardContent>
		</Card>
	);
}
