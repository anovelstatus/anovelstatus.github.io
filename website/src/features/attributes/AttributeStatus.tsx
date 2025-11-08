import { Typography, Card, CardHeader, CardContent, Stack, Grid, Box } from "@mui/material";
import { useChapter, useGroupedAttributes, useStatuses } from "@/data/api";
import { ChaptersChip } from "@/components/chips";
import { formatNumber } from "@/data/helpers";
import { getEvolvedName, getCurrentBoost, getStatus } from "./helpers";
import { BoostList } from "./BoostList";
import { useState } from "react";

export function AttributeStatus() {
	const chapter = useChapter();

	const groups = useGroupedAttributes();
	const { data: statuses } = useStatuses();
	const status = getStatus(statuses, chapter);
	const [selectedAttribute, setSelectedAttribute] = useState<Attribute.Details | undefined>(undefined);

	if (!status) return <></>;

	const previousStatus = getStatus(statuses, chapter - 1);

	return (
		<Stack spacing={1}>
			<Typography variant="h3" gutterBottom>
				Priam's Status <ChaptersChip chapters={[chapter]} />
			</Typography>
			<Typography variant="body2">Click an attribute to view details on where the % boost comes from.</Typography>
			<Grid container spacing={1}>
				{groups.map(([groupName, groupAttributes]) => {
					return (
						<Grid key={groupName} size={{ xs: 12, md: 6, lg: 4 }}>
							<Card sx={{ height: "100%" }}>
								<CardHeader title={groupName} />
								<CardContent>
									{groupAttributes.map((attribute) => (
										<Box
											key={attribute.name}
											sx={{
												backgroundColor: selectedAttribute === attribute ? "action.selected" : "inherit",
											}}
										>
											<Typography
												variant="body2"
												sx={{
													padding: 0.5,
													cursor: "pointer",
												}}
												onClick={() => setSelectedAttribute(attribute)}
											>
												{getStatusLine(status, attribute, previousStatus)}
											</Typography>
											{selectedAttribute === attribute ? <BoostList attribute={attribute} /> : null}
										</Box>
									))}
								</CardContent>
							</Card>
						</Grid>
					);
				})}
			</Grid>
		</Stack>
	);
}

function getStatusLine(status: Status, attribute: Attribute.Details, previousStatus?: Status): string {
	const baseValue = status[attribute.name]!;
	const evolvedName = getEvolvedName(attribute, status);
	const improvement = previousStatus ? baseValue - previousStatus[attribute.name]! : 0;
	const improvementSuffix = improvement ? " (" + (improvement > 0 ? "+" : "") + improvement + ")" : "";
	return `${evolvedName}: ${formatNumber(baseValue)}` + improvementSuffix + getCurrentBoost(status.chapter, attribute);
}
