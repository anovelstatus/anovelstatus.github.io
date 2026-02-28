import { Card, CardHeader, CardContent, Box, Stack, Grid, Typography, Chip } from "@mui/material";
import { ChaptersChip, IdealChip, RarityChip } from "@/components/chips";
import { findByIds, getCurrentLevel, sameId } from "@/data/helpers";
import { AttributeSummary } from "@/features/attributes";
import { useChapter, useSkills, useSkillTiers } from "@/data/api";
import SkillButton from "./SkillButton";
import { getMaxLevel, getPrerequisiteList, getProgressGradient } from "./helpers";
import LoadingCard from "@/components/LoadingCard";

type SkillCardProps = { id: TieredId } & PropsWithStyle;

export default function SkillCard({ id, sx }: SkillCardProps) {
	const skillTiers = useSkillTiers();
	const chapter = useChapter();

	if (!id) return <Box>Skill not found</Box>;

	const { data: skills } = useSkills();
	const skill = skills.find((x) => sameId(x, id));
	if (!skill) return <LoadingCard headerOnly sx={sx} />;

	const previousSkills = findByIds(skills, skill.previous);
	console.log(previousSkills);

	const prerequisiteList = getPrerequisiteList(skill);

	const max = getMaxLevel(skill, skillTiers);
	const level = getCurrentLevel(skill, chapter);
	const levelText = `Lvl ${level} / ${max}`;
	const gradient = getProgressGradient(((1.0 * level) / max) * 100, "#333333");

	return (
		<Card sx={sx}>
			<CardHeader
				sx={{ background: gradient }}
				title={
					<Grid container spacing={1} alignItems="center">
						{skill.name} <RarityChip name={skill.tier} />
						<IdealChip skill={skill} />
						<Chip size="small" label={levelText} />
					</Grid>
				}
			/>
			<CardContent>
				<Stack>
					<Typography>{skill.description}</Typography>
					<AttributeSummary item={skill} />
					{prerequisiteList.length > 0 && (
						<>
							<Typography variant="h6" sx={{ marginTop: "20px" }}>
								Ideal Prerequisites:
							</Typography>
							{prerequisiteList}
						</>
					)}
					{previousSkills.length > 0 ? (
						<>
							<Typography variant="h6" sx={{ marginTop: "20px" }}>
								Previous/Merged Skill(s):
							</Typography>
							<Stack spacing={1}>
								{previousSkills.map((x, index) => {
									return <SkillButton key={index} skill={x} />;
								})}
							</Stack>
						</>
					) : null}
					<Typography variant="h6" sx={{ marginTop: "20px" }}>
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
