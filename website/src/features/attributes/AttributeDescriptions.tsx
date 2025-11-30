import { Typography, Stack, Grid, Box } from "@mui/material";
import { useGroupedAttributes } from "@/data/api";
import { AttributeGroupCard } from "./AttributeGroupCard";

export type AttributeDescriptionsProps = {
	name: string;
	getNotes: (attribute: Attribute.Details) => string[];
};

export function AttributeDescriptions({ name, getNotes }: AttributeDescriptionsProps) {
	const groups = useGroupedAttributes();

	return (
		<Stack spacing={1}>
			<Typography variant="h4" gutterBottom>
				{name}
			</Typography>
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
											<Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
												{attribute.name}
											</Typography>
											{getNotes(attribute).map((note, index) => (
												<Typography key={index} variant="body2" color="text.secondary">
													{note}
												</Typography>
											))}
										</Box>
									))}
								</Stack>
							)}
						/>
					</Grid>
				))}
			</Grid>
		</Stack>
	);
}
