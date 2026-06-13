import { useAttributes, useChapter, useGroupedAttributes, useRaceOnChapter } from "@/data/api";
import { Box, Grid, Input, Stack, Typography } from "@mui/material";
import { AttributeStatus } from "@/features/attributes/AttributeStatus";
import { getCurrentBoost, useCalculatedStatus } from "@/features/attributes/helpers";
import ChaptersChip from "@/components/chips/ChaptersChip";
import { useMemo, useState } from "react";
import { maxBy } from "es-toolkit";
import { AttributeGroupCard } from "@/features/attributes/AttributeGroupCard";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { LoreSection } from "@/components/LoreSection";

export function TribulationPanel() {
	const chapter = useChapter();
	const status = useCalculatedStatus(chapter);

	const { data: attributes } = useAttributes();
	const race = useRaceOnChapter(chapter);

	const [tempChanges, setTempChanges] = useState([] as number[]);

	const tempStatus = useMemo(() => {
		if (!status) return undefined;
		const adjusted: number[] = [];
		for (const attribute of attributes) {
			adjusted[attribute.index] = Math.round(
				status.attributes[attribute.index]! +
					(tempChanges[attribute.index] || 0) * (1 + getCurrentBoost(chapter, attribute)),
			);
		}
		return { ...status, attributes: adjusted };
	}, [status, attributes, tempChanges]);

	if (!race || !status || !tempStatus)
		return <LoadingPlaceholder text="Loading race tier, skill levels, and titles..." />;

	const thresholds = getTresholds(tempStatus, race);

	return (
		<Stack spacing={2}>
			<Typography variant="body2" component="div">
				This displays a calculated status for <ChaptersChip chapters={[chapter]} /> based on total skill levels and
				title boosts. Then you can add any hypothetical gains to see if Priam would reach new Tribulation thresholds.
			</Typography>
			<LoreSection topic="Tribulations" />
			<AttributeStatus status={tempStatus} previousStatus={status} />
			<Typography variant="h4">Additions</Typography>
			<Typography variant="body2" component="div" sx={{ fontStyle: "italic" }}>
				Title boosts will be added for you. Just add what is gained directly from a skill level or other source.
			</Typography>
			<AttributeInputs onChange={(changes) => setTempChanges(changes)} />
			<Typography variant="h4">Thresholds ({thresholds.length})</Typography>
			<Stack spacing={1}>
				{thresholds.map((x) => (
					<Typography key={x.threshold + "-" + x.count}>
						{x.count} attributes above {x.threshold}
					</Typography>
				))}
			</Stack>
		</Stack>
	);
}

function AttributeInputs({ onChange }: { onChange: (changes: number[]) => void }) {
	const groups = useGroupedAttributes();
	const [changes, setChanges] = useState([] as number[]);

	return (
		<Grid container spacing={1}>
			{groups.map(([groupName, groupAttributes]) => (
				<Grid key={groupName} size={{ xs: 12, md: 6, lg: 4 }}>
					<AttributeGroupCard
						groupName={groupName}
						attributes={groupAttributes}
						formatAttributes={(attributes) => (
							<Stack spacing={2}>
								{attributes.map((attribute) => (
									<Box key={attribute.name}>
										<Typography variant="body2" component="span">
											{attribute.name}:
										</Typography>
										<Input
											value={changes[attribute.index] || 0}
											size="small"
											onChange={(e) => {
												const newValue = Number(e.target.value);
												setChanges((prev) => {
													const newChanges = [...prev];
													newChanges[attribute.index] = newValue;
													onChange(newChanges);
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
											sx={{ marginLeft: 1, width: "6ch" }}
										/>
									</Box>
								))}
							</Stack>
						)}
					/>
				</Grid>
			))}
		</Grid>
	);
}

function getTresholds(status: Status, race: Race) {
	// Assuming thresholds of 100 * race tier, when 1/3/6/12 attributes cross that threshold
	const relevantCounts = [1, 3, 6, 12];
	const stats = status.attributes;
	const max = maxBy(stats, (x) => x) ?? 0;
	const tier = 100 * (race.tier + 1);
	const data = [];
	for (let i = tier; i <= max; i += tier) {
		const count = stats.filter((x) => x >= i).length;
		for (const relevantCount of relevantCounts) {
			if (count >= relevantCount) {
				data.push({ threshold: i, count: relevantCount });
			}
		}
	}
	return data;
}
