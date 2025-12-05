import { Card, CardHeader, CardContent, Stack, Grid, Typography } from "@mui/material";
import { ChaptersChip, RarityChip } from "@/components/chips";

type AchievementCardProps = { achievement: Achievement } & PropsWithStyle;

export default function AchievementCard({ achievement, sx }: AchievementCardProps) {
	return (
		<Card sx={sx}>
			<CardHeader
				title={
					<Grid container spacing={1} alignItems="center">
						<RarityChip name={achievement.tier} />
						<ChaptersChip chapters={[achievement.chapter]} />
					</Grid>
				}
			/>
			<CardContent>
				<Stack>
					<Typography variant="body2" whiteSpace="pre-line">
						{achievement.description}
					</Typography>
					<Typography variant="h6">Message</Typography>
					<Typography variant="body2" whiteSpace="pre-line">
						{achievement.message}
					</Typography>
					<Typography variant="body2" fontStyle="italic">
						Sent to {achievement.messageRecipients.join(", ")}
					</Typography>
					<Typography variant="h6">Rewards</Typography>
					<Typography variant="body2" whiteSpace="pre-line">
						{achievement.rewards}
					</Typography>
					{achievement.note && (
						<>
							<Typography variant="h6">Other notes:</Typography>
							<Typography variant="body2" whiteSpace="pre-line">
								{achievement.note}
							</Typography>
						</>
					)}
				</Stack>
			</CardContent>
		</Card>
	);
}
