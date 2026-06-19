import { useAttributes, useChapter } from "@/data/api";
import { Input, Stack, Typography } from "@mui/material";
import { getCurrentBoost, useCalculatedStatus, useTribulationThresholds } from "@/features/attributes/helpers";
import ChaptersChip from "@/components/chips/ChaptersChip";
import { useMemo, useState } from "react";
import { sumBy } from "es-toolkit";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { LoreSection } from "@/components/LoreSection";
import { AttributeGrid } from "../AttributeGrid";
import { formatNumber } from "@/data/helpers";
import { useRaceOnChapter } from "@/features/body/helpers";

export function TribulationPanel() {
	const chapter = useChapter();
	const status = useCalculatedStatus(chapter);

	const { data: attributes } = useAttributes();
	const race = useRaceOnChapter(chapter);

	const [changes, setChanges] = useState([] as number[]);

	const tempStatus = useMemo(() => {
		if (!status) return undefined;
		const adjusted: number[] = [];
		for (const attribute of attributes) {
			adjusted[attribute.index] = Math.round(
				status.attributes[attribute.index]! +
					(changes[attribute.index] || 0) * (1 + getCurrentBoost(chapter, attribute)),
			);
		}
		return { ...status, attributes: adjusted };
	}, [status, attributes, changes]);

	const thresholds = useTribulationThresholds(tempStatus, race);

	if (!race || !status || !tempStatus)
		return <LoadingPlaceholder text="Loading race tier, skill levels, and titles..." />;

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
					const existing = status.attributes[attribute.index]!;
					const boost = getCurrentBoost(status.chapter, attribute);
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
			<Typography variant="h4">Thresholds Passed ({sumBy(thresholds, (x) => x.counts.length)})</Typography>
			<Stack spacing={1}>
				{thresholds.map((x) => (
					<Typography key={"threshold-" + x.threshold}>
						{x.counts.join(", ")} attributes above {x.threshold}
					</Typography>
				))}
			</Stack>
		</Stack>
	);
}
