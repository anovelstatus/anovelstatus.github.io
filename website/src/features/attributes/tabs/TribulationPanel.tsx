import { useAttributes, useChapter, useStatuses } from "@/data/api";
import { Grid, Input, Stack, Typography } from "@mui/material";
import {
	getAllCurrentBoosts,
	getLatestStatus,
	useCalculatedStatus,
	useTribulationThresholds,
} from "@/features/attributes/helpers";
import ChaptersChip from "@/components/chips/ChaptersChip";
import { useMemo, useState } from "react";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { LoreSection } from "@/components/LoreSection";
import { AttributeGrid } from "@/features/attributes/AttributeGrid";
import { formatNumber } from "@/data/helpers";
import { useRaceOnChapter } from "@/features/body/helpers";
import { ThresholdCard } from "../tribulation/ThresholdCard";
import { adjustStatus } from "../tribulation/helpers";

export function TribulationPanel() {
	const chapter = useChapter();
	const { data: statuses } = useStatuses();
	const officialStatus = getLatestStatus(statuses, chapter);
	const status = useCalculatedStatus(chapter);

	const { data: attributes } = useAttributes();
	const race = useRaceOnChapter(chapter);

	const [changes, setChanges] = useState([] as number[]);

	const allBoosts = useMemo(() => getAllCurrentBoosts(chapter, attributes), [chapter, attributes]);

	const tempStatus = adjustStatus(status, attributes, changes, allBoosts);

	const officialThresholds = useTribulationThresholds(officialStatus?.attributes, race);
	const baseThresholds = useTribulationThresholds(status, race);
	const thresholds = useTribulationThresholds(tempStatus, race);

	if (!race || !status) return <LoadingPlaceholder text="Loading race tier, skill levels, and titles..." />;

	return (
		<Stack spacing={2}>
			<Typography variant="body2" component="div">
				This displays a calculated status for <ChaptersChip chapters={[chapter]} /> based on total skill levels and
				title boosts. Then you can add any hypothetical gains to see if Priam would reach new Tribulation thresholds.
			</Typography>
			<Typography variant="body2" component="div" sx={{ fontStyle: "italic" }}>
				Title boosts will be added for you. Just add what is gained directly from a skill level or other source.
			</Typography>
			<LoreSection topic="Tribulations" />
			<AttributeGrid
				formatAttribute={(attribute) => {
					const existing = status[attribute.index]!;
					const boost = allBoosts[attribute.index]!;
					const boostSuffix = boost === 0 ? "" : `+ ${Math.round(boost * 100)}%)`;
					const total = Math.round(existing + (changes[attribute.index] ?? 0) * (1 + boost));
					return (
						<Stack key={"tribulation-simulator-" + attribute.name}>
							<Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
								{attribute.name}
							</Typography>
							<Typography variant="body2" component="div">
								{formatNumber(existing)}
								{" + " + (boost > 0 ? "(" : "")}
								<Input
									id={attribute.name + "-addition"}
									value={changes[attribute.index] || 0}
									size="small"
									onChange={(e) => {
										const newValue = Number(e.target.value);
										setChanges((prev) => {
											const newChanges = [...prev];
											newChanges[attribute.index] = newValue;
											return newChanges;
										});
									}}
									inputProps={{
										step: 1,
										min: 0,
										type: "number",
										"aria-labelledby": `input-${attribute.name}`,
										"aria-label": attribute.name,
									}}
									sx={{ marginLeft: "4px", width: "6ch" }}
								/>
								{boostSuffix}
								{" = "}
								{formatNumber(total)}
							</Typography>
						</Stack>
					);
				}}
			/>

			<Grid container spacing={2}>
				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<ThresholdCard title="With your additions" thresholds={thresholds} />
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<ThresholdCard title={`Expected, from Ch ${chapter}`} thresholds={baseThresholds} />
				</Grid>
				{officialStatus && (
					<Grid size={{ xs: 12, sm: 6, md: 4 }}>
						<ThresholdCard title={`Officially, from Ch ${officialStatus.chapter}`} thresholds={officialThresholds} />
					</Grid>
				)}
			</Grid>
		</Stack>
	);
}
