// https://manikumar.in/blog/integrating-npm-packages-in-google-apps-script-guide/
import { build } from "rolldown";
import { copyFile } from "node:fs/promises";

// The first comment limits the script's authorization to only the current document
// The second comment disables lint errors when I look at the compiled code locally.
const banner = `
/** @OnlyCurrentDoc */
/* eslint-disable no-undef */
`;

await build({
	input: ["src/index.ts"],
	output: {
		dir: "dist/",
		format: "esm",
		banner,
		minify: false,
	},
	treeshake: false,
});

await copyFile("src/sidebar.html", "dist/sidebar.html");
await copyFile("src/appsscript.json", "dist/appsscript.json");
