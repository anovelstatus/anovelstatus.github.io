// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../shared/types.d.ts" />

declare type PropsWithStyle = {
	sx?: SxProps<Theme>;
};

interface ImportMetaEnv {
	/** URL to deployed Apps Script web app, loaded from environment variable */
	readonly VITE_API_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
