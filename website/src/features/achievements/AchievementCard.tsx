import { Card, CardHeader, CardContent, Stack, Grid, Typography } from "@mui/material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import { hasNote, RichTextSpan } from "@/components/RichTextSpan";

type AchievementCardProps = { achievement: Achievement } & PropsWithStyle;

export default function AchievementCard({ achievement, sx }: AchievementCardProps) {
	return (
		<Card sx={sx}>
			<CardHeader
				title={
					<Grid container spacing={1} sx={{ alignItems: "center" }}>
						<RarityChip name={achievement.tier} />
						<ChaptersChip chapters={[achievement.chapter]} />
					</Grid>
				}
			/>
			<CardContent>
				<Stack>
					<RichTextSpan data={achievement.description} />
					<Typography variant="h6">Message</Typography>
					<RichTextSpan data={achievement.message} />
					<Typography variant="body2" sx={{ fontStyle: "italic" }}>
						Sent to {achievement.messageRecipients.join(", ")}
					</Typography>
					<Typography variant="h6">Rewards</Typography>
					<RichTextSpan data={achievement.rewards} />
					{hasNote(achievement.note) && (
						<>
							<Typography variant="h6">Other notes:</Typography>
							<RichTextSpan data={achievement.note} />
						</>
					)}
				</Stack>
			</CardContent>
		</Card>
	);
}
