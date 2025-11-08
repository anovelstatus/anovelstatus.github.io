import { useAttributes } from "@/data/api";
import { CircularProgress, Typography } from "@mui/material";

type AttributeSummaryProps = {
	item: HasSomeAttributes;
};

/** Write out list of attributes provided by something */
export function AttributeSummary({ item }: AttributeSummaryProps) {
	const { data: attributes, isFetching } = useAttributes();
	const summary = attributes.filter((x) => item[x.name]).map((x) => `${x.abbreviation}: ${item[x.name]}`);
	return isFetching ? (
		<CircularProgress size="16px" color="inherit" />
	) : (
		<>
			{summary.map((x, index) => (
				<Typography variant="body2" key={index}>
					{x}
				</Typography>
			))}
		</>
	);
}
