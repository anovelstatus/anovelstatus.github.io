export type RichTextSpanProps = {
	data: RichText[];
};

export function RichTextSpan({ data }: RichTextSpanProps) {
	// Add fallback option in case the API has cached a string version of the note instead of the rich text array
	if (typeof data === "string") {
		return <>{data}</>;
	}
	return (
		<>
			{(data || []).map((x, index) => {
				return (
					<span
						key={index}
						style={{
							color: x.fgColor == "#000000" ? undefined : x.fgColor,
							fontWeight: x.bold ? "bold" : "normal",
							fontStyle: x.italic ? "italic" : "normal",
							textDecoration: `${x.strikethrough ? "line-through " : ""}${x.underline ? "underline" : ""}`,
						}}
					>
						{x.text}
					</span>
				);
			})}
		</>
	);
}
