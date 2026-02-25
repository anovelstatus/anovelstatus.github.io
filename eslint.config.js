import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "eslint-plugin-react";
import pluginRouter from "@tanstack/eslint-plugin-router";
import eslintConfigPrettier from "eslint-config-prettier/flat";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files: ["**/*.{ts,tsx}"],
	},
	{
		ignores: ["./website/dist/**/*", "node_modules/**/*"],
	},
	{
		settings: {
			react: {
				version: "19",
			},
		},
		linterOptions: {
			noInlineConfig: false,
			reportUnusedDisableDirectives: "error",
		},
	},
	js.configs.recommended,
	...ts.configs.recommended,
	react.configs.flat.recommended,
	react.configs.flat["jsx-runtime"],
	...pluginRouter.configs["flat/recommended"],
	eslintConfigPrettier,
	{
		rules: {
			// suppress for now
			// "comma-dangle": ["error", "only-multiline"],
			// "semi": ["error", "always"],
			"@typescript-eslint/no-unused-vars": ["off"],
			"react/no-unescaped-entities": ["off"],
		},
	},
];
