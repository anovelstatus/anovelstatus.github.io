import { createTheme, type Theme } from "@mui/material";
import { useBasicInfo } from "./api";

/** Get appropriate theme colors for given tier */
export function useTheme(label: string): Theme {
	const { data } = useBasicInfo();
	const tier = data.tiers.find((x) => label.startsWith(x.metalName) || label.startsWith(x.skillName));

	if (!tier) return createTierTheme("#434343", "#0cf");
	return createTierTheme(tier.bgColor, tier.fgColor);
}

function createTierTheme(primary: string, text: string = "#000"): Theme {
	return createTheme({
		palette: {
			primary: { main: primary, contrastText: text },
		},
	});
}
