import { describe, expect, it } from "vitest";
import { ApiClient } from "../client";

// minimal tests for header injection and error normalization
describe("ApiClient", () => {
	it("injects x-api-key header when provided", async () => {
		global.fetch = (async (input: RequestInfo, init?: RequestInit) => {
			// assert header present
			const headers = (init?.headers as Record<string, string>) || {};
			expect(headers["x-api-key"]).toBe("secret-key");
			return new Response(JSON.stringify({ ok: true }), {
				status: 200,
				statusText: "OK",
			});
		}) as any;

		const c = new ApiClient("https://example.test", "secret-key");
		const res = await c.get("/test");
		expect(res).toEqual({ ok: true });
	});

	it("normalizes non-OK responses into ApiError", async () => {
		global.fetch = (async () =>
			new Response(JSON.stringify({ error: "bad" }), {
				status: 400,
				statusText: "Bad",
			})) as any;
		const c = new ApiClient("https://example.test");
		await expect(c.get("/bad")).rejects.toMatchObject({
			status: 400,
			message: "Bad",
		});
	});
});
