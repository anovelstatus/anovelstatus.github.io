import { useAttributes } from "@/data/api";
import { CircularProgress, Typography } from "@mui/material";

type AttributeSummaryProps = {
	gains: number[];
};

/** Write out list of attributes provided by something */
export function AttributeSummary({ gains }: AttributeSummaryProps) {
	const { data: allAttributes, isFetching } = useAttributes();

	if (isFetching) return <CircularProgress size="16px" color="inherit" />;

	const data = gains.map((gain, index) => ({ gain, index })).filter((x) => x.gain);

	return (
		<>
			{data.map((x) => (
				<Typography variant="body2" key={x.index}>
					{`+${x.gain} ${allAttributes[x.index]!.name}`}
				</Typography>
			))}
		</>
	);
}
