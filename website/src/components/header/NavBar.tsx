import {
	AppBar,
	Box,
	Button,
	IconButton,
	LinearProgress,
	Menu,
	MenuItem,
	Stack,
	Toolbar,
	useTheme,
} from "@mui/material";
import { Event, Menu as MenuIcon } from "@mui/icons-material";
import ChapterPicker from "./ChapterPicker";
import { useIsFetching } from "@tanstack/react-query";
import { useState } from "react";
import ChapterTimeline from "./ChapterTimeline";
import { Link, useLocation, type RegisteredRouter, type ValidateToPath } from "@tanstack/react-router";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { UnlockButton } from "../UnlockButton";
import { useIsUnlocked } from "@/data/api";

type NavLink = {
	to: ValidateToPath<RegisteredRouter>;
	title: string;
	key: string;
};
const links: NavLink[] = [
	{ key: "home", to: "/", title: "Home" },
	{ key: "attributes", to: "/attributes", title: "Attributes" },
	{ key: "overview", to: "/cultivation", title: "Cultivation" },
	{ key: "body", to: "/body", title: "Body" },
	{ key: "skills", to: "/skills", title: "Skills" },
	{ key: "talents", to: "/talents", title: "Talents" },
	{ key: "titles", to: "/titles", title: "Titles" },
	{ key: "achievements", to: "/achievements", title: "Achievements" },
];

export default function NavBar() {
	const isFetching = useIsFetching();
	const unlocked = useIsUnlocked();
	const loadingBarHeight = "4px";
	const [showTimeline, setShowTimeline] = useState(false);

	const theme = useTheme();
	const location = useLocation();

	const compactMenu = (
		<PopupState variant="popover" popupId="nav-bar">
			{(popupState) => (
				<>
					<Button
						size="large"
						aria-label="navigation menu"
						aria-controls="menu-appbar"
						aria-haspopup="true"
						{...bindTrigger(popupState)}
						color="inherit"
						startIcon={<MenuIcon />}
						variant="text"
					>
						{links.find((x) => x.to === location.pathname)!.title as string}
					</Button>

					<Menu
						onClick={() => popupState.close()}
						{...bindMenu(popupState)}
						transformOrigin={{
							vertical: "top",
							horizontal: "right",
						}}
					>
						{links.map((link) => (
							<MenuItem key={link.key} component={Link} to={link.to} selected={location.pathname === link.to}>
								{link.title}
							</MenuItem>
						))}
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
					<Stack direction="row" sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
						{links.map((link) => (
							<Button
								variant="text"
								sx={{
									color: theme.palette.text.primary,
									"&.Mui-disabled": {
										color: theme.palette.text.primary,
										background: theme.palette.action.disabledBackground,
									},
								}}
								disabled={location.pathname === link.to}
								component={Link}
								key={link.key}
								to={link.to}
							>
								{link.title}
							</Button>
						))}
					</Stack>
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
				<Box sx={{ height: loadingBarHeight }} />
			)}
		</Box>
	);
}
