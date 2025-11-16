// https://manikumar.in/blog/integrating-npm-packages-in-google-apps-script-guide/
import esbuild from "esbuild";

// The first comment limits the script's authorization to only the current document
// The second comment disables ESLint errors when I looked at the compiled code locally.
const banner = `
/** @OnlyCurrentDoc */
/* eslint-disable no-undef */
`;

await esbuild.build({
	entryPoints: ["src/index.ts", "src/sidebar.html", "src/appsscript.json"],
	bundle: true,
	outdir: "dist/",
	format: "esm",
	treeShaking: false,
	minifyWhitespace: false,
	minifyIdentifiers: false,
	banner: { js: banner },
	loader: { ".html": "copy", ".json": "copy" },
});
