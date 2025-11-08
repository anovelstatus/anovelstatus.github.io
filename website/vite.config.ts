/// <reference types="vitest/config" />

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [tanstackRouter({ autoCodeSplitting: false, enableRouteGeneration: false }), viteReact(), tsConfigPaths()],
	build: {
		// https://rollupjs.org/configuration-options/
		rollupOptions: {
			output: {
				manualChunks: function manualChunks(id) {
					if (id.includes("@mui")) {
						return "mui";
					}
					if (id.includes("@tanstack")) {
						return "tanstack";
					}
					if (id.includes("node_modules")) {
						return "vendor";
					}
					return;
				},
			},
		},
	},
	test: {},
});
