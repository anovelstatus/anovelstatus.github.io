import { Stack, Grid, Card, CardContent, CardHeader } from "@mui/material";
import { useGroupedAttributes } from "@/data/api";
import type React from "react";

type AttributeGridProps = {
	formatAttribute: (attribute: Attribute.Details) => React.ReactNode;
};
type AttributeGroupCardProps = {
	groupName: string;
	attributes: Attribute.Details[];
	formatAttributes: (attributes: Attribute.Details[]) => React.ReactNode;
};

export function AttributeGrid({ formatAttribute }: AttributeGridProps) {
	const groups = useGroupedAttributes();

	return (
		<Stack spacing={1}>
			<Grid container spacing={1}>
				{groups.map(([groupName, groupAttributes]) => (
					<Grid key={groupName} size={{ xs: 12, md: 6, lg: 4 }}>
						<AttributeGroupCard
							groupName={groupName}
							attributes={groupAttributes}
							formatAttributes={(attributes) => (
								<Stack spacing={1}>{attributes.map((attribute) => formatAttribute(attribute))}</Stack>
							)}
						/>
					</Grid>
				))}
			</Grid>
		</Stack>
	);
}

function AttributeGroupCard({ groupName, attributes, formatAttributes }: AttributeGroupCardProps) {
	const groupColor = attributes[0]!.color;
	return (
		<Card sx={{ height: "100%", backgroundColor: groupColor }}>
			<CardHeader title={groupName} sx={{ backgroundColor: "#ffffffc0", color: groupColor }} />
			<CardContent>{formatAttributes(attributes)}</CardContent>
		</Card>
	);
}
