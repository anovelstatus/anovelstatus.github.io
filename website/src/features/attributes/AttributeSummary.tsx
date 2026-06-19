import { useAttributes } from "@/data/api";
import { CircularProgress, Typography } from "@mui/material";
import { zip } from "es-toolkit";

type AttributeSummaryProps = {
	gains: number[];
};

/** Write out list of attributes provided by something */
export function AttributeSummary({ gains }: AttributeSummaryProps) {
	const { data: attributes, isLoading } = useAttributes();

	if (isLoading) return <CircularProgress size="16px" color="inherit" />;

	const data = zip(gains, attributes);

	return (
		<>
			{data
				.filter((x) => x[0])
				.map((x) => (
					<Typography variant="body2" key={x[1].name}>
						{`+${x[0]} ${x[1].name}`}
					</Typography>
				))}
		</>
	);
}
