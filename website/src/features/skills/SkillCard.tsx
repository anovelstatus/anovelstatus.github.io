import { Card, CardHeader, CardContent, Box, Stack, Grid, Typography } from "@mui/material";
import { RarityChip } from "@/components/chips";
import { findByIds, sameId } from "@/data/helpers";
import { AttributeSummary } from "@/features/attributes";
import { useSkills } from "@/data/api";
import SkillButton from "./SkillButton";

type SkillCardProps = { id: TieredId } & PropsWithStyle;

export default function SkillCard({ id, sx }: SkillCardProps) {
	if (!id) return <Box>Skill not found</Box>;

	const { data: skills } = useSkills();
	const skill = skills.find((x) => sameId(x, id));
	if (!skill) return <Box>Skill not found</Box>;

	const previousSkills = findByIds(skills, skill.previous);
	console.log(previousSkills);

	return (
		<Card sx={sx}>
			<CardHeader
				title={
					<Grid container spacing={1} alignItems="center">
						{skill.name} <RarityChip name={skill.tier} />
					</Grid>
				}
			/>
			<CardContent>
				<Stack>
					<Typography>Description Under Construction 🚧</Typography>
					<AttributeSummary item={skill} />
					{previousSkills.length > 0 ? (
						<>
							<Box sx={{ marginTop: "20px" }}>Previous/Merged Skill(s):</Box>
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
