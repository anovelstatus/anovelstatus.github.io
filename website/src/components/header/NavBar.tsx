import { AppBar, Box, Button, IconButton, LinearProgress, Menu, Toolbar } from "@mui/material";
import { Event, Menu as MenuIcon } from "@mui/icons-material";
import RouterButton from "@/components/header/RouterButton";
import ChapterPicker from "./ChapterPicker";
import { useIsFetching } from "@tanstack/react-query";
import { useState } from "react";
import ChapterTimeline from "./ChapterTimeline";
import { useLocation } from "@tanstack/react-router";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { UnlockButton } from "../UnlockButton";
import { useIsUnlocked } from "@/data/api";

export default function NavBar() {
	const isFetching = useIsFetching();
	const unlocked = useIsUnlocked();
	const loadingBarHeight = "4px";
	const [showTimeline, setShowTimeline] = useState(false);

	const location = useLocation();

	const pages = [
		<RouterButton key="home" to="/" title="Home" />,
		<RouterButton key="attributes" to="/attributes" title="Attributes" />,
		<RouterButton key="overview" to="/cultivation" title="Cultivation" />,
		<RouterButton key="skills" to="/skills" title="Skills" />,
		<RouterButton key="talents" to="/talents" title="Talents" />,
		<RouterButton key="titles" to="/titles" title="Titles" />,
	];

	const compactMenu = (
		<PopupState variant="popover" popupId="nav-bar-">
			{(popupState) => (
				<>
					<Button
						size="large"
						aria-label="account of current user"
						aria-controls="menu-appbar"
						aria-haspopup="true"
						{...bindTrigger(popupState)}
						color="inherit"
						startIcon={<MenuIcon />}
					>
						{pages.find((x) => x.props.to === location.pathname)!.props.title as string}
					</Button>

					<Menu
						{...bindMenu(popupState)}
						transformOrigin={{
							vertical: "top",
							horizontal: "right",
						}}
					>
						{pages}
					</Menu>
				</>
			)}
		</PopupState>
	);

	return (
		<Box sx={{ paddingBottom: "20px", flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar variant="dense" disableGutters>
					<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>{compactMenu}</Box>
					<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>{pages}</Box>
					<Box sx={{ flexGrow: 1 }} />
					<ChapterPicker />
					<IconButton id="show-timeline" onClick={() => setShowTimeline(!showTimeline)}>
						<Event />
					</IconButton>
					{!unlocked && <UnlockButton />}
				</Toolbar>
				{showTimeline ? <ChapterTimeline /> : null}
			</AppBar>
			{isFetching ? (
				<LinearProgress color="inherit" sx={{ height: loadingBarHeight }} />
			) : (
				<Box height={loadingBarHeight} />
			)}
		</Box>
	);
}
