import { Typography, Card, CardHeader, CardContent, Stack, Grid, Box } from "@mui/material";
import { useGroupedAttributes } from "@/data/api";

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
						<Card sx={{ height: "100%" }}>
							<CardHeader title={groupName} />
							<CardContent>
								<Stack spacing={2}>
									{groupAttributes.map((attribute) => (
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
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Stack>
	);
}
