import { describe, expect, it } from "vitest";
import { truncateAddress, validateStellarAddress } from "./addressFormatting";

// ─── truncateAddress ──────────────────────────────────────────────────────────

describe("truncateAddress", () => {
	it("returns the address unchanged when 12 chars or fewer", () => {
		expect(truncateAddress("GABC")).toBe("GABC");
		expect(truncateAddress("GABCDEFGHIJK")).toBe("GABCDEFGHIJK"); // exactly 12
	});

	it("truncates long addresses to first 6 + last 4 chars", () => {
		const addr = "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
		expect(truncateAddress(addr)).toBe("GBZXN7...MADI");
	});
});

// ─── validateStellarAddress ───────────────────────────────────────────────────

describe("validateStellarAddress", () => {
	const VALID_ADDRESS =
		"GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";

	it("accepts a valid 56-char G-address", () => {
		const result = validateStellarAddress(VALID_ADDRESS);
		expect(result.valid).toBe(true);
		expect(result.error).toBeUndefined();
	});

	it("trims surrounding whitespace before validating", () => {
		expect(validateStellarAddress(`  ${VALID_ADDRESS}  `).valid).toBe(true);
	});

	it("rejects an empty string", () => {
		const result = validateStellarAddress("");
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/required/i);
	});

	it("rejects a whitespace-only string", () => {
		const result = validateStellarAddress("   ");
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/required/i);
	});

	it("rejects an address that does not start with G", () => {
		const bad = VALID_ADDRESS.replace("G", "A");
		const result = validateStellarAddress(bad);
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/start with 'G'/i);
	});

	it("rejects an address shorter than 56 characters", () => {
		const result = validateStellarAddress("GABC");
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/56 characters/i);
	});

	it("rejects an address longer than 56 characters", () => {
		const result = validateStellarAddress(`${VALID_ADDRESS}X`);
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/56 characters/i);
	});

	it("rejects an address with invalid base32 characters", () => {
		// Replace last char with '0' which is not in Stellar's base32 alphabet
		const bad = `${VALID_ADDRESS.slice(0, 55)}0`;
		const result = validateStellarAddress(bad);
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/invalid characters/i);
	});

	it("rejects an address with lowercase letters", () => {
		const bad = VALID_ADDRESS.toLowerCase();
		const result = validateStellarAddress(bad);
		expect(result.valid).toBe(false);
	});
});
