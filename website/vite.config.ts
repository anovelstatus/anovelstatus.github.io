/// <reference types="vitest/config" />

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [tanstackRouter({ autoCodeSplitting: false, enableRouteGeneration: false }), viteReact()],
	resolve: {
		tsconfigPaths: true,
	},
	build: {
		// https://rolldown.rs/reference/
		rolldownOptions: {
			output: {
				codeSplitting: {
					groups: [
						{ name: "mui", test: /@mui/ },
						{ name: "tanstack", test: /@tanstack/ },
						{ name: "vendor", test: /node_modules/ },
					],
				},
			},
		},
	},
	test: {},
});
