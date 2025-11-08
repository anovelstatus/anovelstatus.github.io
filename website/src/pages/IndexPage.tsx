import { UnlockButton } from "@/components/UnlockButton";
import { useBasicInfo } from "@/data/api";
import { Link, List, ListItem, Stack, Typography } from "@mui/material";

export function IndexPage() {
	const { data } = useBasicInfo();
	const links = [
		{ name: "A Novel Concept's Discord Server", url: "https://discord.gg/HQDDnwpFmS" },
		{
			name: "Character Status & Lore Spreadsheet (Public)",
			url: "https://docs.google.com/spreadsheets/d/1C2dH1EO8VYD3qhDcFYfF10NotmwpoYgXu-KYbhhlqzA/edit?gid=1074517387#gid=1074517387",
		},
	];
	if (data.patreonSheetLink)
		links.push({ name: "Character Status & Lore Spreadsheet (Patreon)", url: data.patreonSheetLink });

	return (
		<Stack spacing={2}>
			<Typography variant="h4">Welcome to Priam's Character Status</Typography>
			<Typography>
				This is a hub for all things related to A Novel Concept, a web serial by Priam. You can find it on{" "}
				<Link href="https://www.royalroad.com/fiction/66455">Royal Road</Link>, and read more chapters on{" "}
				<Link href="https://www.patreon.com/ANovelConcept">Patreon</Link>.
			</Typography>
			<Typography>
				Click one of the tabs above to view different parts of Priam's Status. Click the icon next to the chapter
				selector for quick links to key chapters.
			</Typography>
			<Typography variant="h6">For more information, check out these links:</Typography>
			<List>
				{links.map((link) => (
					<ListItem key={link.name}>
						<Link href={link.url} target="_blank" rel="noopener noreferrer">
							{link.name}
						</Link>
					</ListItem>
				))}
				{!data.patreonSheetLink && (
					<ListItem>
						<UnlockButton text="Unlock Patreon Content" />
					</ListItem>
				)}
			</List>
			<Typography variant="h6">Planned Enhancements</Typography>
			<ol>
				<li>Tool to simulate Tribulation thresholds with different Race Tiers, title boosts, and attribute totals</li>
				<li>Character and Faction listings, with POV chapter details</li>
				<li>Details about everyone's favorite tree and its surroundings</li>
				<li>Finish the Cultivation page, especially Concepts</li>
				<li>Achievements and Quests</li>
				<li>Probably Reunion, Colosseum, and other Event-specific tabs</li>
				<li>More search options on Skills, Talents, and Titles</li>
				<li>Merit Trees</li>
				<li>More lore and worldbuilding details</li>
				<li>
					<i>Some</i> of the ideas you suggest in Discord
				</li>
				<li>...and more that I can't mention without spoilers</li>
			</ol>
		</Stack>
	);
}
