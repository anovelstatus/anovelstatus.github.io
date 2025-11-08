import { createHashHistory, createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import * as Pages from "@/pages";
import App from "@/App";

const rootRoute = createRootRoute({
	component: App,
});

const routes = [
	createRoute({ getParentRoute: () => rootRoute, path: "/", component: Pages.IndexPage }),
	createRoute({ getParentRoute: () => rootRoute, path: "/attributes", component: Pages.AttributePage }),
	createRoute({ getParentRoute: () => rootRoute, path: "/cultivation", component: Pages.CultivationPage }),
	createRoute({ getParentRoute: () => rootRoute, path: "/skills", component: Pages.SkillPage }),
	createRoute({ getParentRoute: () => rootRoute, path: "/talents", component: Pages.TalentPage }),
	createRoute({ getParentRoute: () => rootRoute, path: "/titles", component: Pages.TitlePage }),
];

const routeTree = rootRoute.addChildren(routes);

// Create a new router instance
// must use hash history for GitHub Pages compatibility
const router = createRouter({ routeTree, basepath: "/", history: createHashHistory() });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export function AppRouterProvider() {
	return <RouterProvider router={router} />;
}
