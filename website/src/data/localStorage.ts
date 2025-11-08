const STORAGE_KEYS = {
	patreonKey: "patreon-key",
};

export function getPatreonKey() {
	return localStorage.getItem(STORAGE_KEYS.patreonKey) || "";
}

export function setPatreonKey(key: string) {
	localStorage.setItem(STORAGE_KEYS.patreonKey, key);
}
