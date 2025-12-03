import { Card, CardHeader, CardContent, CardActions, Stack } from "@mui/material";
import { ChaptersChip } from "@/components/chips";
import { useChapter } from "@/data/api";
import TieredButton from "@/components/TieredButton";
import { TitleCard } from "../titles";
import { PopoverButton } from "@/components/PopoverButton";
import { toIdString } from "@/data/helpers";

type BloodlineProps = { bloodline: Bloodline };
type BloodlinesProps = { bloodlines: Bloodline[] };

function BloodlineCard({ bloodline }: BloodlineProps) {
	const currentStatus = bloodline.updates.at(-1)!;
	const purity = typeof currentStatus.purity === "number" ? currentStatus.purity * 100 + "%" : currentStatus.purity;

	return (
		<Card variant="outlined">
			<CardHeader
				title={
					<Stack direction="row" alignItems="center">
						{bloodline.name}
						<ChaptersChip chapters={[currentStatus.chapter]} />
					</Stack>
				}
			/>
			<CardContent>
				{purity}, {currentStatus.status}
			</CardContent>
			<CardActions>
				<PopoverButton
					id={toIdString(bloodline.title)}
					trigger={<TieredButton item={bloodline.title} variant="outlined" />}
					popover={() => <TitleCard id={bloodline.title} sx={{ maxWidth: 500 }} />}
				/>
			</CardActions>
		</Card>
	);
}

export default function BloodlinesCard({ bloodlines }: BloodlinesProps) {
	const chapter = useChapter();

	const filteredBloodlines: Bloodline[] = bloodlines
		.map((x) => {
			return {
				...x,
				updates: x.updates.filter((y) => y.chapter < chapter),
			};
		})
		.filter((x) => x.updates.length > 0);
	const cards = filteredBloodlines.map((bloodline, index) => <BloodlineCard bloodline={bloodline} key={index} />);

	return (
		<Card>
			<CardHeader title="Bloodlines" />
			<CardContent>{cards}</CardContent>
		</Card>
	);
}
