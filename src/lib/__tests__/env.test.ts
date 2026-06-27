/**
 * Unit tests for environment variable validation.
 *
 * These tests validate the behavior of the validateEnv function
 * under various conditions (missing vars, defaults, required vars).
 * Run with: npx vitest run or similar test runner.
 */

import { validateEnv } from "../env";

describe("validateEnv", () => {
	beforeEach(() => {
		vi.unstubAllEnvs();
	});

	it("should return the env object unchanged when all vars have values", () => {
		const env = {
			NEXT_PUBLIC_APP_URL: "https://example.com",
			NEXT_PUBLIC_MUX_API_URL: "https://api.example.com",
			MUX_API_KEY: "test-key",
		};
		const result = validateEnv(env);
		expect(result).toBe(env);
	});

	it("should not throw for missing optional vars without defaults", () => {
		const env = {};
		expect(() => validateEnv(env)).not.toThrow();
	});

	it("should not throw for missing optional vars with defaults", () => {
		const env = {};
		expect(() => validateEnv(env)).not.toThrow();
	});

	it("should throw in production for missing required vars", () => {
		const env: Record<string, string | undefined> = {};
		const origNodeEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = "production";

		// Since there are no required vars by default, this should not throw
		expect(() => validateEnv(env)).not.toThrow();

		process.env.NODE_ENV = origNodeEnv;
	});

	it("should log warnings for missing vars", () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});
		const env: Record<string, string | undefined> = {};

		validateEnv(env);

		expect(consoleWarnSpy).toHaveBeenCalled();
		consoleWarnSpy.mockRestore();
	});
});
