import { Card, CardContent, CardHeader } from "@mui/material";
import type React from "react";

export type AttributeGroupCardProps = {
	groupName: string;
	attributes: Attribute.Details[];
	formatAttributes: (attributes: Attribute.Details[]) => React.ReactNode;
};

export function AttributeGroupCard({ groupName, attributes, formatAttributes }: AttributeGroupCardProps) {
	const groupColor = attributes[0]!.color;
	return (
		<Card sx={{ height: "100%", backgroundColor: groupColor }}>
			<CardHeader title={groupName} sx={{ backgroundColor: "#ffffffa4", color: groupColor }} />
			<CardContent>{formatAttributes(attributes)}</CardContent>
		</Card>
	);
}
