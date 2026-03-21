import { Typography } from "@mui/material";

export type SectionProps = {
	title: React.ReactNode;
	contents: React.ReactNode;
};

/** Basic wrapper for content in a card */
export default function Section({ title, contents }: SectionProps) {
	return (
		<>
			<Typography variant="h4">{title}</Typography>
			{contents}
		</>
	);
}
