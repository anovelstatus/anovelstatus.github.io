import { Typography, Box } from "@mui/material";
import { formatNumber } from "@/data/helpers";
import { getEvolvedName, getCurrentBoost } from "./helpers";
import { BoostList } from "./BoostList";
import { useState } from "react";
import { AttributeGrid } from "./AttributeGrid";

export function AttributeStatus({ status, previousStatus }: { status: Status; previousStatus?: Status }) {
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
			<AttributeGrid
				formatAttribute={(attribute) => {
					const evolvedName = getEvolvedName(attribute, status.chapter);
					return (
						<Box key={"status-" + attribute.name}>
							<Typography
								variant="body2"
								sx={{
									padding: 0.5,
									cursor: "pointer",
								}}
								onClick={() => toggleAttribute(attribute)}
							>
								<span style={{ fontWeight: "bold" }}>{evolvedName}</span>
								{getStatusLine(status, attribute, previousStatus)}
							</Typography>
							{selectedAttribute === attribute ? <BoostList attribute={attribute} /> : null}
						</Box>
					);
				}}
			/>
		</>
	);
}

function getStatusLine(status: Status, attribute: Attribute.Details, previousStatus?: Status): string {
	const baseValue = status.attributes[attribute.index]!;
	const improvement = previousStatus ? baseValue - previousStatus.attributes[attribute.index]! : 0;
	const improvementSuffix = improvement ? " (" + (improvement > 0 ? "+" : "") + improvement + ")" : "";
	const boost = getCurrentBoost(status.chapter, attribute);
	const boostSuffix = boost === 0 ? "" : ` (${Math.round(boost * 100)}%)`;
	return `: ${formatNumber(baseValue)}${improvementSuffix}${boostSuffix}`;
}
