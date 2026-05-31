import { CircularProgress, Stack } from "@mui/material";

type LoadingPlaceholderProps = {
	text?: string;
};

export default function LoadingPlaceholder({ text }: LoadingPlaceholderProps) {
	return (
		<Stack direction="row" sx={{ alignItems: "center" }}>
			<CircularProgress size="20px" color="inherit" />
			<span>{text ?? "Loading..."}</span>
		</Stack>
	);
}
