import { Typography, Grid, Box } from "@mui/material";
import { useGroupedAttributes } from "@/data/api";
import { formatNumber } from "@/data/helpers";
import { getEvolvedName, getCurrentBoost } from "./helpers";
import { BoostList } from "./BoostList";
import { useState } from "react";
import { AttributeGroupCard } from "./AttributeGroupCard";

export function AttributeStatus({ status, previousStatus }: { status: Status; previousStatus?: Status }) {
	const groups = useGroupedAttributes();
	const [selectedAttribute, setSelectedAttribute] = useState<Attribute.Details | undefined>(undefined);

	const toggleAttribute = (attribute: Attribute.Details) => {
		if (selectedAttribute === attribute) {
			setSelectedAttribute(undefined);
		} else {
			setSelectedAttribute(attribute);
		}
	};

	return (
		<>
			<Typography variant="body2">Click an attribute to view details on where the % boost comes from.</Typography>
			<Grid container spacing={1}>
				{groups.map(([groupName, groupAttributes]) => {
					return (
						<Grid key={groupName} size={{ xs: 12, md: 6, lg: 4 }}>
							<AttributeGroupCard
								groupName={groupName}
								attributes={groupAttributes}
								formatAttributes={(attributes) =>
									attributes.map((attribute) => (
										<Box
											key={attribute.name}
											sx={{
												backgroundColor: selectedAttribute === attribute ? "action.selected" : "none",
											}}
										>
											<Typography
												variant="body2"
												sx={{
													padding: 0.5,
													cursor: "pointer",
												}}
												onClick={() => toggleAttribute(attribute)}
											>
												{getStatusLine(status, attribute, previousStatus)}
											</Typography>
											{selectedAttribute === attribute ? <BoostList attribute={attribute} /> : null}
										</Box>
									))
								}
							/>
						</Grid>
					);
				})}
			</Grid>
		</>
	);
}

function getStatusLine(status: Status, attribute: Attribute.Details, previousStatus?: Status): string {
	const baseValue = status[attribute.name]!;
	const evolvedName = getEvolvedName(attribute, status);
	const improvement = previousStatus ? baseValue - previousStatus[attribute.name]! : 0;
	const improvementSuffix = improvement ? " (" + (improvement > 0 ? "+" : "") + improvement + ")" : "";
	const boost = getCurrentBoost(status.chapter, attribute);
	const boostSuffix = boost === 0 ? "" : ` (${Math.round(boost * 100)}%)`;

	return `${evolvedName}: ${formatNumber(baseValue)}${improvementSuffix}${boostSuffix}`;
}
