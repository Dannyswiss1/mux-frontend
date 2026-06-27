import { beforeEach, describe, expect, it } from "vitest";
import { getApiKeys, revokeApiKey } from "@/mock-data/api-keys";

describe("mock api keys persistence", () => {
	beforeEach(() => {
		// reset in-memory/localStorage by clearing the key if present
		try {
			if (typeof window !== "undefined" && window.localStorage) {
				window.localStorage.removeItem("mockApiKeys");
			}
		} catch {
			// ignore
		}
	});

	it("returns an array of api keys", () => {
		const keys = getApiKeys();
		expect(Array.isArray(keys)).toBe(true);
		expect(keys.length).toBeGreaterThan(0);
	});

	it("revokes an api key by id and persists status", () => {
		const keys = getApiKeys();
		const target = keys[0];
		expect(target.status).toBe("Active");
		const updated = revokeApiKey(target.id);
		expect(updated).not.toBeNull();
		expect(updated?.status).toBe("Revoked");

		const after = getApiKeys().find((k) => k.id === target.id);
		expect(after?.status).toBe("Revoked");
	});
});
