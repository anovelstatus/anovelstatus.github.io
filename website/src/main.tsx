import "./global.d.ts";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, createHashHistory, RouterProvider } from "@tanstack/react-router";
import { queryClient, routeTree, theme } from "@/setup";

// Create a new router instance
const router = createRouter({
	routeTree,
	basepath: "/",
	// must use hash history for GitHub Pages compatibility
	history: createHashHistory(),
	defaultPreload: "intent",
	context: {
		queryClient: queryClient,
	},
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const container = document.getElementById("root")!;
if (!container.innerHTML) {
	const root = ReactDOM.createRoot(container);
	root.render(
		<StrictMode>
			<ThemeProvider theme={theme}>
				<CssBaseline enableColorScheme />
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</ThemeProvider>
		</StrictMode>,
	);
}
