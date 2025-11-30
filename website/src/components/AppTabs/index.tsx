import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState, type SyntheticEvent } from "react";
import { AppTabPanel } from "./AppTabPanel";

export type AppTabsProps = {
	title: string;
	labels: React.ReactNode[];
	panels: React.ReactNode[];
	panelProps?: PropsWithStyle;
};

export default function AppTabs({ title, labels, panels, panelProps }: AppTabsProps) {
	const [tabIndex, setTabIndex] = useState(0);

	const handleChange = (_: SyntheticEvent, newValue: number) => {
		setTabIndex(newValue);
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 2 }}>
				<Tabs value={tabIndex} onChange={handleChange} aria-label={`${title} tabs`}>
					{labels.map((label, index) => (
						<Tab key={index} label={label} {...a11yProps(index)} />
					))}
				</Tabs>
			</Box>
			{panels.map((panel, index) => (
				<AppTabPanel key={index} selectedIndex={tabIndex} index={index} {...panelProps}>
					{panel}
				</AppTabPanel>
			))}
		</Box>
	);
}

function a11yProps(index: number) {
	return {
		id: `app-tab-${index}`,
		"aria-controls": `app-tabpanel-${index}`,
	};
}
