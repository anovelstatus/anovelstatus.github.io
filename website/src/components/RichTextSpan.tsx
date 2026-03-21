import { Typography, type TypographyProps } from "@mui/material";

export type RichTextSpanProps = {
	data: string | RichText[];
} & TypographyProps;

/** The cell often returns an array of 1 span with empty text, so check for non-empty text */
export function hasNote(data: string | RichText[]): boolean {
	if (typeof data === "string") return data.length > 0;
	return (data || []).some((x) => x.text.length > 0);
}

export function RichTextSpan({ data, ...props }: RichTextSpanProps) {
	// Support plain text, but also support text formatting details from the spreasdheet
	const contents =
		typeof data === "string" ? (
			data
		) : (
			<>
				{(data || []).map((x, index) => (
					<FormattedSpan key={index} {...x} />
				))}
			</>
		);
	return (
		<Typography component="span" variant="body2" whiteSpace="pre-line" {...props}>
			{contents}
		</Typography>
	);
}

function FormattedSpan(data: RichText) {
	return (
		<span
			style={{
				color: data.fgColor == "#000000" ? undefined : data.fgColor,
				fontWeight: data.bold ? "bold" : "normal",
				fontStyle: data.italic ? "italic" : "normal",
				textDecoration: `${data.strikethrough ? "line-through " : ""}${data.underline ? "underline" : ""}`,
			}}
		>
			{data.text}
		</span>
	);
}
