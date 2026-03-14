export type RichTextSpanProps = {
	data: RichText[];
};

export function RichTextSpan({ data }: RichTextSpanProps) {
	return (
		<>
			{data.map((x, index) => {
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
