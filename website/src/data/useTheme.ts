import { createTheme, type Theme } from "@mui/material";
import { useBasicInfo } from "./api";
import { useMemo } from "react";

/** Get appropriate theme colors for given tier */
export function useTheme(labelOrNumber: string | number): Theme {
	const { data } = useBasicInfo();

	return useMemo(() => {
		const tier =
			typeof labelOrNumber === "number"
				? data.tiers[labelOrNumber]
				: data.tiers.find((x) => labelOrNumber.startsWith(x.metalName) || labelOrNumber.startsWith(x.skillName));
		if (!tier) return createTierTheme("#434343", "#0cf");
		return createTierTheme(tier.bgColor, tier.fgColor);
	}, [labelOrNumber, data]);
}

function createTierTheme(primary: string, text: string = "#000"): Theme {
	return createTheme({
		palette: {
			primary: { main: primary, contrastText: text },
		},
	});
}

export function useTierThemes() {
	const { data } = useBasicInfo();
	return useMemo(() => {
		return data.tiers.map((tier) => createTierTheme(tier.bgColor, tier.fgColor));
	}, [data]);
}
