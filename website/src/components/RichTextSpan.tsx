import { Typography, type TypographyProps } from "@mui/material";

type RichTextSpanProps = {
	data: string | RichTextSpans;
} & TypographyProps;

/** The cell often returns an array of 1 span with empty text, so check for non-empty text */
export function hasNote(data: string | RichTextSpans): boolean {
	if (!data) return false;
	if (typeof data === "string") return data.length > 0;
	return data.some((x) => x.t.length > 0);
}

export function RichTextSpan({ data, sx, ...props }: RichTextSpanProps) {
	// Support plain text, but also support text formatting details from the spreasdheet
	let text = data;
	if (typeof text === "string") {
		text = [{ t: text }];
	}
	if (!text || text.length === 0) return null;
	return (
		<Typography component="span" variant="body2" sx={{ whiteSpace: "pre-line", ...sx }} {...props}>
			{text.map((x, index) => (
				<FormattedSpan key={index} {...x} />
			))}
		</Typography>
	);
}

function FormattedSpan(data: RichText) {
	return (
		<span
			style={{
				// Black shouldn't be in the JSON, but override it just in case
				color: data.c == "#000000" ? undefined : data.c,
				fontWeight: data.b ? "bold" : "normal",
				fontStyle: data.i ? "italic" : "normal",
				textDecoration: `${data.s ? "line-through " : ""}${data.u ? "underline" : ""}`,
			}}
		>
			{data.t}
		</span>
	);
}
