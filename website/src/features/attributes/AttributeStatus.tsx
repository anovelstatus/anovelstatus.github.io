import { Typography, Box } from "@mui/material";
import { formatNumber } from "@/data/helpers";
import { getEvolvedName, getCurrentBoost } from "./helpers";
import { BoostList } from "./BoostList";
import { useState } from "react";
import { AttributeGrid } from "./AttributeGrid";

type AttributeStatusProps = {
	chapter: number;
	status: number[];
	previousStatus: number[] | undefined;
};

export function AttributeStatus({ chapter, status, previousStatus }: AttributeStatusProps) {
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
					const evolvedName = getEvolvedName(attribute, chapter);
					return (
						<Box key={attribute.name}>
							<Typography
								variant="body2"
								sx={{
									padding: 0.5,
									cursor: "pointer",
								}}
								onClick={() => toggleAttribute(attribute)}
							>
								<span style={{ fontWeight: "bold" }}>{evolvedName}</span>
								{getStatusLine(chapter, status, attribute, previousStatus)}
							</Typography>
							{selectedAttribute === attribute ? <BoostList attribute={attribute} /> : null}
						</Box>
					);
				}}
			/>
		</>
	);
}

function getStatusLine(
	chapter: number,
	status: number[],
	attribute: Attribute.Details,
	previousStatus?: number[],
): string {
	const baseValue = status[attribute.index]!;
	const improvement = previousStatus ? baseValue - previousStatus[attribute.index]! : 0;
	const improvementSuffix = improvement ? " (" + (improvement > 0 ? "+" : "") + improvement + ")" : "";
	const boost = getCurrentBoost(chapter, attribute);
	const boostSuffix = boost === 0 ? "" : ` (${Math.round(boost * 100)}%)`;
	return `: ${formatNumber(baseValue)}${improvementSuffix}${boostSuffix}`;
}
