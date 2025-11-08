import { Box, Input, Typography } from "@mui/material";
import { useContext } from "react";
import { ChapterContext } from "@/providers/ChapterContext";
import { useLatestChapter } from "@/data/api";

export default function ChapterPicker() {
	const { chapter, setChapter } = useContext(ChapterContext);
	const latestChapter = useLatestChapter();

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChapter(event.target.value === "" ? 0 : Number(event.target.value));
	};

	const handleBlur = () => {
		if (chapter < 0) {
			setChapter(0);
		} else if (chapter > latestChapter) {
			setChapter(latestChapter);
		}
	};

	return (
		<Box>
			<Typography component="span" id="input-manual">
				Chapter
			</Typography>
			<Input
				value={chapter}
				size="small"
				onChange={handleInputChange}
				onBlur={handleBlur}
				inputProps={{
					step: 1,
					min: 0,
					max: latestChapter,
					type: "number",
					"aria-labelledby": "input-manual",
					"aria-label": "chapter",
				}}
				sx={{ marginLeft: 1 }}
			/>
		</Box>
	);
}
