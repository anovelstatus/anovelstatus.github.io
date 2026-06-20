import { Stack } from "@mui/material";
import type { PropsWithChildren } from "react";

export function WrappedRow({ children }: PropsWithChildren) {
	return (
		<Stack direction="row" sx={{ flexWrap: "wrap", alignItems: "center" }}>
			{children}
		</Stack>
	);
}
