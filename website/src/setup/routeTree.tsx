import { createRootRoute, createRoute, Navigate } from "@tanstack/react-router";
import * as Pages from "@/pages";

const rootRoute = createRootRoute({
	component: Pages.App,
});

const getParentRoute = () => rootRoute;

// Set up every page
const routes = [
	createRoute({ getParentRoute, path: "/", component: Pages.IndexPage }),
	createRoute({ getParentRoute, path: "/achievements", component: Pages.AchievementPage }),
	createRoute({ getParentRoute, path: "/attributes", component: Pages.AttributePage }),
	createRoute({ getParentRoute, path: "/body", component: Pages.BodyPage }),
	createRoute({ getParentRoute, path: "/mind", component: Pages.MindPage }),
	createRoute({ getParentRoute, path: "/search", component: Pages.SearchPage }),
	createRoute({ getParentRoute, path: "/skills", component: Pages.SkillPage }),
	createRoute({ getParentRoute, path: "/soul", component: Pages.SoulPage }),
	createRoute({ getParentRoute, path: "/talents", component: Pages.TalentPage }),
	createRoute({ getParentRoute, path: "/titles", component: Pages.TitlePage }),
	// Add redirect for any deprecated routes, in case anyone gets stuck
	createRoute({ getParentRoute, path: "/cultivation", component: () => <Navigate to="/" /> }),
];

export const routeTree = rootRoute.addChildren(routes);
