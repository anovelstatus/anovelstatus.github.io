import type { PropsWithStyle } from "@/types";
import { Stack, type StackProps } from "@mui/material";
import type { PropsWithChildren } from "react";

export function WrappedRow({ children, sx, ...props }: PropsWithChildren & PropsWithStyle & StackProps) {
	return (
		<Stack direction="row" sx={{ flexWrap: "wrap", alignItems: "center", ...sx }} {...props}>
			{children}
		</Stack>
	);
}
