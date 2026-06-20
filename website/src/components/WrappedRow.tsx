import type { PropsWithStyle } from "@/types";
import { Stack } from "@mui/material";
import type { PropsWithChildren } from "react";

export function WrappedRow({ children, sx }: PropsWithChildren & PropsWithStyle) {
	return (
		<Stack direction="row" sx={{ flexWrap: "wrap", alignItems: "center", ...sx }}>
			{children}
		</Stack>
	);
}
