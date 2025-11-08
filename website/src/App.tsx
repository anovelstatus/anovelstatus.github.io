import { Outlet } from "@tanstack/react-router";
import { Container, Stack } from "@mui/material";
import { ChapterContext } from "@/providers";
import { useEffect, useState } from "react";
import NavBar from "@/components/header/NavBar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useIsUnlocked, useLatestChapter } from "@/data/api";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useQueryClient } from "@tanstack/react-query";

export default function App() {
	const [chapter, setChapter] = useState(1);
	const unlocked = useIsUnlocked();
	const latest = useLatestChapter();
	const client = useQueryClient();

	useEffect(() => {
		setChapter(latest);
	}, [latest]);

	useEffect(() => {
		client.cancelQueries();
		if (unlocked) setChapter(latest);
		client.refetchQueries({ queryKey: ["page"] });
	}, [unlocked]);

	return (
		<ChapterContext value={{ chapter, setChapter }}>
			<NavBar />
			<Stack spacing={2}>
				<Container maxWidth={false} sx={{ paddingBottom: 4 }}>
					<ErrorBoundary
						fallback={
							<p>
								Something went wrong loading this page. Please refresh to try again. If it continues, reach out on
								Discord.
							</p>
						}
					>
						<>
							<Outlet />
							<TanStackRouterDevtools />
						</>
					</ErrorBoundary>
				</Container>
			</Stack>
		</ChapterContext>
	);
}
