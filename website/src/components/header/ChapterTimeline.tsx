import { Button, CircularProgress, Container, Grid, Slider, Stack } from "@mui/material";
import { useContext, useMemo } from "react";
import { ChapterContext } from "@/providers/ChapterContext";
import { useLatestChapter, useShortcuts } from "@/data/api";
import { ShortcutMenu } from "./ShortcutMenu";
import { mapMapValues } from "@/data/helpers";

export default function ChapterTimeline() {
	const { chapter, setChapter } = useContext(ChapterContext);
	const latestChapter = useLatestChapter();
	const { data: shortcuts, isFetching } = useShortcuts();

	const groupedShortcuts = useMemo(() => {
		const menus = Map.groupBy(shortcuts, (x) => x.menu || "");
		const topLevel = menus.get("") || [];
		menus.delete("");

		const groupedMenus = mapMapValues(menus, (x) => Map.groupBy(x, (y) => y.group || ""));
		return { main: topLevel, menus: Array.from(groupedMenus) };
	}, [shortcuts]);

	const handleSliderChange = (_event: Event, newValue: number | number[]) => {
		setChapter(newValue as number);
	};

	return (
		<Container maxWidth={false} sx={{ paddingBottom: 2 }}>
			<Stack>
				<Slider
					aria-label="Chapter"
					defaultValue={latestChapter}
					shiftStep={1}
					step={1}
					max={latestChapter}
					valueLabelDisplay="off"
					aria-labelledby="input-manual"
					track={false}
					value={chapter}
					onChange={handleSliderChange}
				/>
				{isFetching ? (
					<Stack direction="row" justifyContent="center" alignItems="center" width="100%">
						<CircularProgress size="16px" color="inherit" />
						<span>Loading shortcuts...</span>
					</Stack>
				) : (
					<Grid container spacing={1}>
						{groupedShortcuts.main.map((x) => (
							<Button variant="outlined" key={x.chapter} onClick={() => setChapter(x.chapter)}>
								{x.label}
							</Button>
						))}
						{groupedShortcuts.menus.map((menu) => (
							<ShortcutMenu key={menu[0]} label={menu[0]} groups={menu[1]} onClick={setChapter} />
						))}
					</Grid>
				)}
			</Stack>
		</Container>
	);
}
