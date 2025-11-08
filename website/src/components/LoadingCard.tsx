import { Card, CardHeader, CardContent, Skeleton, CircularProgress, Stack } from "@mui/material";

export default function LoadingCard({ headerOnly = false }: { headerOnly?: boolean }) {
	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center">
						<CircularProgress size="20px" color="inherit" />
						<span>Loading...</span>
					</Stack>
				}
			/>
			{headerOnly ? null : (
				<CardContent>{<Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />}</CardContent>
			)}
		</Card>
	);
}
