import { Typography, Card, CardHeader, CardContent, Stack, Grid, Box } from "@mui/material";
import { useGroupedAttributes } from "@/data/api";

export type AttributeDescriptionsProps = {
	name: string;
	getNote: (attribute: Attribute.Details) => React.ReactNode;
};

export function AttributeDescriptions({ name, getNote }: AttributeDescriptionsProps) {
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
											<Typography variant="body2" color="text.secondary">
												{getNote(attribute)}
											</Typography>
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
