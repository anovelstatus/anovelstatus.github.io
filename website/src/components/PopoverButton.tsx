import { Popover } from "@mui/material";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import type { ReactElement } from "react";

export type PopoverButtonProps = {
	id: string;
	trigger: ReactElement;
	popover: () => ReactElement;
};

export function PopoverButton({ id, trigger, popover }: PopoverButtonProps) {
	return (
		<PopupState variant="popover" popupId={id}>
			{(popupState) => (
				<>
					{<span {...bindTrigger(popupState)}>{trigger}</span>}
					{popupState.isOpen ? <Popover {...bindPopover(popupState)}>{popover()}</Popover> : null}
				</>
			)}
		</PopupState>
	);
}
