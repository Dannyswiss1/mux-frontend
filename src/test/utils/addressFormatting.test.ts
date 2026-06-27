import { describe, expect, it } from "vitest";
import { truncateAddress } from "@/utils/addressFormatting";

describe("truncateAddress", () => {
	it("returns the address unchanged when it is 12 characters or fewer", () => {
		expect(truncateAddress("GBZXN7PIRZGN")).toBe("GBZXN7PIRZGN"); // exactly 12
		expect(truncateAddress("SHORT")).toBe("SHORT"); // < 12
		expect(truncateAddress("")).toBe(""); // empty string
	});

	it("truncates a long Stellar address to first-6 + '...' + last-4", () => {
		const address = "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
		expect(truncateAddress(address)).toBe("GBZXN7...MADI");
	});

	it("truncates a 13-character address (just over the threshold)", () => {
		// 13 chars: first 6 = "ABCDEF", last 4 = "MNOP"
		expect(truncateAddress("ABCDEFGHIJMNOP")).toBe("ABCDEF...MNOP");
	});

	it("handles addresses with exactly 13 characters", () => {
		const addr = "ABCDEFGHIJKLM"; // 13 chars
		expect(truncateAddress(addr)).toBe("ABCDEF...JKLM");
	});

	it("preserves the full address when length is exactly 12", () => {
		const addr = "123456789012"; // 12 chars
		expect(truncateAddress(addr)).toBe("123456789012");
	});

	it("works with all known mock wallet addresses", () => {
		const addresses = [
			"GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
			"GCFONE23AB7Y6C5YZOMKUKGETPIAJA752ZPMORQO5VKA6LHXHC7Y3YPE",
			"GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOBER7KKQOAVSMIA",
		];
		for (const addr of addresses) {
			const result = truncateAddress(addr);
			expect(result).toMatch(/^.{6}\.\.\..{4}$/);
		}
	});
});
