import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Link,
	TextField,
} from "@mui/material";
import { Lock } from "@mui/icons-material";
import PopupState, { bindDialog, bindTrigger } from "material-ui-popup-state";
import { useState } from "react";
import { setPatreonKey } from "@/data/localStorage";
import { useBasicInfo } from "@/data/api";

export function UnlockButton({ text = "Unlock Patreon" }: { text?: string }) {
	const { refetch: checkKey, isFetching } = useBasicInfo();
	const [input, setInput] = useState("");
	const handleSubmit = (_event: React.FormEvent<HTMLButtonElement>) => {
		setPatreonKey(input);
		checkKey();
	};

	return (
		<PopupState variant="dialog" popupId="unlock">
			{(popupState) => (
				<>
					{!isFetching && (
						<Button variant="contained" startIcon={<Lock />} {...bindTrigger(popupState)}>
							{text}
						</Button>
					)}
					{popupState.isOpen ? (
						<Dialog {...bindDialog(popupState)}>
							{" "}
							<DialogTitle>Unlock Patreon content</DialogTitle>
							<DialogContent>
								<DialogContentText>
									To view Patreon content, join the <Link href="https://discord.gg/HQDDnwpFmS">Discord</Link> and get
									the key from the Patreon-only channels. Then enter it here:
								</DialogContentText>
								<TextField
									autoFocus
									required
									margin="dense"
									id="name"
									name="key"
									label="Key"
									fullWidth
									variant="standard"
									value={input}
									onChange={(e) => setInput(e.target.value)}
								/>
							</DialogContent>
							<DialogActions>
								<Button onClick={popupState.close}>Cancel</Button>
								<Button
									onClick={(e) => {
										handleSubmit(e);
										popupState.close();
									}}
								>
									Unlock
								</Button>
							</DialogActions>
						</Dialog>
					) : null}
				</>
			)}
		</PopupState>
	);
}
