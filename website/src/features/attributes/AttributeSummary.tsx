import { useAttributes } from "@/data/api";
import { CircularProgress, Typography } from "@mui/material";

type AttributeSummaryProps = {
	item: HasSomeAttributes;
};

/** Write out list of attributes provided by something */
export function AttributeSummary({ item }: AttributeSummaryProps) {
	const { data: allAttributes, isFetching } = useAttributes();

	if (isFetching) return <CircularProgress size="16px" color="inherit" />;

	const attributes = allAttributes.filter((x) => item[x.name]);
	return (
		<>
			{attributes.map((x, index) => (
				<Typography variant="body2" key={index}>
					{`${x.abbreviation}: ${item[x.name]}`}
				</Typography>
			))}
		</>
	);
}
