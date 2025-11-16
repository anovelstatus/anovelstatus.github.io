// https://manikumar.in/blog/integrating-npm-packages-in-google-apps-script-guide/
import esbuild from "esbuild";
import "dotenv/config";

const banner = `
// Scroll all the way down to see the entry points you can debug with.
// The code here is compiled and deployed from https://github.com/anovelstatus/anovelstatus.github.io
/* eslint-disable no-undef */`;

await esbuild.build({
	entryPoints: ["src/index.ts", "src/appsscript.json"],
	bundle: true,
	outdir: "dist/",
	format: "esm",
	treeShaking: false,
	minifyWhitespace: false,
	minifyIdentifiers: false,
	banner: { js: banner },
	loader: { ".json": "copy" },
	define: {
		PATREON_KEY: `"${process.env["PATREON_KEY"] || "testing"}"`,
		SS_LINK: `"${process.env["SS_LINK"] || "testing"}"`,
	},
});
