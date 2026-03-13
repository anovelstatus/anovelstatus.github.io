// https://manikumar.in/blog/integrating-npm-packages-in-google-apps-script-guide/
import { build } from "rolldown";
import { replacePlugin } from "rolldown/plugins";
import "dotenv/config";
import { copyFile } from "node:fs/promises";

await build({
	input: ["src/index.ts"],
	output: {
		dir: "dist/",
		format: "esm",
		banner: `
// Scroll all the way down to see the entry points you can debug with.
// The code here is compiled and deployed from https://github.com/anovelstatus/anovelstatus.github.io
/* eslint-disable no-undef */`,
		minify: false,
	},
	treeshake: false,
	plugins: [
		replacePlugin(
			{
				PATREON_KEY: `"${process.env["PATREON_KEY"] || "testing"}"`,
				SS_LINK: `"${process.env["SS_LINK"] || "testing"}"`,
			},
			{ preventAssignment: true },
		),
	],
});

await copyFile("src/appsscript.json", "dist/appsscript.json");
