import { useBasicAttributes } from "@/data/api";
import { CircularProgress, Typography } from "@mui/material";

type AttributeSummaryProps = {
	gains: number[];
};

/** Write out list of attributes provided by something */
export function AttributeSummary({ gains }: AttributeSummaryProps) {
	const { data: allAttributes, isFetching } = useBasicAttributes();

	if (isFetching) return <CircularProgress size="16px" color="inherit" />;

	return (
		<>
			{gains.map((x, index) => (
				<Typography variant="body2" key={index}>
					{`+${x} ${allAttributes[index]!.name}`}
				</Typography>
			))}
		</>
	);
}
