import { useAttributes, useChapter, useGroupedAttributes, useLoreTopic, useRaceOnChapter } from "@/data/api";
import { Box, Grid, Input, Stack, Typography } from "@mui/material";
import { AttributeStatus } from "../AttributeStatus";
import { getCurrentBoost, useCalculatedStatus } from "../helpers";
import ChaptersChip from "@/components/chips/ChaptersChip";
import { useMemo, useState } from "react";
import { RichTextSpan } from "@/components/RichTextSpan";
import { maxBy } from "es-toolkit";
import { AttributeGroupCard } from "../AttributeGroupCard";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";

export function TribulationPanel() {
	const chapter = useChapter();
	const status = useCalculatedStatus(chapter);

	const lore = useLoreTopic("Tribulations", chapter);

	const { data: attributes } = useAttributes();
	const race = useRaceOnChapter(chapter);

	const [tempChanges, setTempChanges] = useState({} as HasSomeAttributes);

	const tempStatus = useMemo(() => {
		if (!status) return undefined;
		const temp = { ...status };
		for (const attribute of attributes || []) {
			if (!temp[attribute.name]) temp[attribute.name] = 0;

			const newValue =
				(temp[attribute.name] || 0) + (tempChanges[attribute.name] || 0) * (1 + getCurrentBoost(chapter, attribute));
			temp[attribute.name] = Math.round(newValue);
		}
		return temp;
	}, [status, attributes, tempChanges]);

	if (race.name === "Unknown" || !status || !tempStatus)
		return <LoadingPlaceholder text="Loading race tier, skill levels, and titles..." />;

	const thresholds = getTresholds(tempStatus, race, attributes);

	return (
		<Stack spacing={2}>
			<Typography variant="body2" component="div">
				This displays a calculated status for <ChaptersChip chapters={[chapter]} /> based on total skill levels and
				title boosts. Then you can add any hypothetical gains to see if Priam would reach new Tribulation thresholds.
			</Typography>
			<RichTextSpan data={lore.description} />
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

function AttributeInputs({ onChange }: { onChange: (changes: HasSomeAttributes) => void }) {
	const groups = useGroupedAttributes();
	const [changes, setChanges] = useState({} as HasSomeAttributes);

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
											value={changes[attribute.name] || 0}
											size="small"
											onChange={(e) => {
												const newValue = Number(e.target.value);
												setChanges((prev) => {
													const newChanges = { ...prev, [attribute.name]: newValue };
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

function getTresholds(status: Status, race: Race, attributes: Attribute.Details[]) {
	// Assuming thresholds of 100 * race tier, when 1/3/6/12 attributes cross that threshold
	const relevantCounts = [1, 3, 6, 12];
	const stats = attributes.map((attribute) => status[attribute.name] || 0);
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
