import { Typography } from "@mui/material";
import type { PropsWithChildren } from "react";

export type SectionProps = PropsWithChildren & {
	title: React.ReactNode;
};

/** Basic wrapper for content in a card */
export default function Section({ title, children }: SectionProps) {
	return (
		<>
			<Typography variant="h4">{title}</Typography>
			{children}
		</>
	);
}
