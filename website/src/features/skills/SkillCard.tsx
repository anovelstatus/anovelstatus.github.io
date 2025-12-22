import { Card, CardHeader, CardContent, Box, Stack, Grid, Typography } from "@mui/material";
import { IdealChip, RarityChip } from "@/components/chips";
import { findByIds, sameId } from "@/data/helpers";
import { AttributeSummary } from "@/features/attributes";
import { useSkills } from "@/data/api";
import SkillButton from "./SkillButton";
import { getPrerequisiteList } from "./helpers";
import LoadingCard from "@/components/LoadingCard";

type SkillCardProps = { id: TieredId } & PropsWithStyle;

export default function SkillCard({ id, sx }: SkillCardProps) {
	if (!id) return <Box>Skill not found</Box>;

	const { data: skills } = useSkills();
	const skill = skills.find((x) => sameId(x, id));
	if (!skill) return <LoadingCard headerOnly sx={sx} />;

	const previousSkills = findByIds(skills, skill.previous);
	console.log(previousSkills);

	const prerequisiteList = getPrerequisiteList(skill);

	return (
		<Card sx={sx}>
			<CardHeader
				title={
					<Grid container spacing={1} alignItems="center">
						{skill.name} <RarityChip name={skill.tier} />
						<IdealChip skill={skill} />
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
				</Stack>
			</CardContent>
		</Card>
	);
}
