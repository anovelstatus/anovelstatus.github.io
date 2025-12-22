import { Card, CardHeader, CardContent, Skeleton, CircularProgress, Stack } from "@mui/material";

type LoadingCardProps = {
	headerOnly?: boolean;
} & PropsWithStyle;

export default function LoadingCard({ headerOnly = false, sx }: LoadingCardProps) {
	return (
		<Card sx={sx}>
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
