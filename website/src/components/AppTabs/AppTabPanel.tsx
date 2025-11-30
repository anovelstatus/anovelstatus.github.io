import { Box } from "@mui/material";
import type { PropsWithChildren } from "react";

export type TabPanelProps = PropsWithChildren<{
	index: number;
	selectedIndex: number;
}> &
	PropsWithStyle;

export function AppTabPanel({ children, selectedIndex, index, sx, ...other }: TabPanelProps) {
	return (
		<div
			role="tabpanel"
			hidden={selectedIndex !== index}
			id={`app-tabpanel-${index}`}
			aria-labelledby={`app-tab-${index}`}
			{...other}
		>
			{selectedIndex === index && <Box sx={{ ...sx }}>{children}</Box>}
		</div>
	);
}
