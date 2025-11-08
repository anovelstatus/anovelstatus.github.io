import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
import { Button, Menu, Box, ListSubheader, MenuItem, Typography } from "@mui/material";
import { ChaptersChip } from "@/components/chips";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

type ShortcutMenuProps = {
	groups: Map<string, Shortcut[]>;
	label: string;
	onClick: (chapter: number) => void;
};

export function ShortcutMenu({ groups, label, onClick }: ShortcutMenuProps) {
	return (
		<PopupState variant="popover" popupId={"timeline-" + label}>
			{(popupState) => (
				<>
					<Button
						id="basic-button"
						variant="outlined"
						endIcon={popupState.isOpen ? <ArrowDropUp /> : <ArrowDropDown />}
						{...bindTrigger(popupState)}
					>
						{label}
					</Button>
					<Menu id="grouped-menu" {...bindMenu(popupState)}>
						{Array.from(groups).map((group) => (
							<Box key={group[0]}>
								{group[0] ? <ListSubheader>{group[0]}</ListSubheader> : undefined}
								{group[1].map((x, index) => (
									<MenuItem key={index} onClick={() => onClick(x.chapter)}>
										<Typography marginRight={1}>{x.label}</Typography>
										<ChaptersChip chapters={[x.chapter]} />
									</MenuItem>
								))}
							</Box>
						))}
					</Menu>
				</>
			)}
		</PopupState>
	);
}
