import { useAttributes, useChapter, useLoreTopic, useRaceOnChapter } from "@/data/api";
import { Box, Input, Stack, Typography } from "@mui/material";
import { AttributeStatus } from "../AttributeStatus";
import { getCurrentBoost, useCalculatedStatus } from "../helpers";
import ChaptersChip from "@/components/chips/ChaptersChip";
import { useMemo, useState } from "react";
import { RichTextSpan } from "@/components/RichTextSpan";
import { maxBy } from "es-toolkit";

export function TribulationPanel() {
	const chapter = useChapter();
	const status = useCalculatedStatus(chapter);
	if (!status) return <></>;

	const lore = useLoreTopic("Tribulations", chapter);

	const { data: attributes } = useAttributes();
	const race = useRaceOnChapter(chapter);

	const [tempChanges, setTempChanges] = useState({} as HasSomeAttributes);

	const tempStatus = useMemo(() => {
		const temp = { ...status };
		for (const attribute of attributes || []) {
			if (!temp[attribute.name]) temp[attribute.name] = 0;

			const newValue =
				(temp[attribute.name] || 0) + (tempChanges[attribute.name] || 0) * (1 + getCurrentBoost(chapter, attribute));
			temp[attribute.name] = Math.round(newValue);
		}
		return temp;
	}, [status, attributes, tempChanges]);

	const additions = attributes.map((attribute) => (
		<TribulationAddition
			key={attribute.name}
			attribute={attribute}
			onChange={(name, value) => setTempChanges((prev) => ({ ...prev, [name]: value }))}
		/>
	));

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
			<Stack>{additions}</Stack>
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

type TribulationAdditionProps = {
	attribute: Attribute.Details;
	onChange?: (attribute: string, value: number) => void;
};

function TribulationAddition({ attribute, onChange }: TribulationAdditionProps) {
	const [value, setValue] = useState(0);
	return (
		<Box>
			<Typography component="span" id={`input-${attribute.name}`}>
				{attribute.name}
			</Typography>
			<Input
				value={value}
				size="small"
				onChange={(e) => {
					const newValue = Number(e.target.value);
					setValue(newValue);
					if (onChange) onChange(attribute.name, newValue);
				}}
				inputProps={{
					step: 1,
					min: 0,
					type: "number",
					"aria-labelledby": `input-${attribute.name}`,
					"aria-label": attribute.name,
				}}
				sx={{ marginLeft: 1 }}
			/>
		</Box>
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
