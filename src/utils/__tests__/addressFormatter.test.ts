import {
	compareAddresses,
	extractFullAddress,
	formatAddress,
	formatAddresses,
	formatChunked,
	formatFull,
	formatGrouped,
	formatMasked,
	formatShort,
	formatTruncated,
	getAvailableFormats,
	getFormatDescription,
	validateFormattingOptions,
} from "../addressFormatter";

describe("addressFormatter utilities", () => {
	const validAddress =
		"GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
	const validAddress2 =
		"GCFONE23AB7Y6C5YZOMKUKGETPIAJA752ZPMORQO5VKA6LHXHC7Y3YPE";
	const invalidAddress = "INVALID_ADDRESS";
	const truncatedAddress = "GBZXN7...MADI";

	describe("formatFull", () => {
		it("should return full address unchanged", () => {
			const result = formatFull(validAddress);
			expect(result).toBe(validAddress);
		});

		it("should return invalid address unchanged", () => {
			const result = formatFull(invalidAddress);
			expect(result).toBe(invalidAddress);
		});

		it("should handle empty string", () => {
			const result = formatFull("");
			expect(result).toBe("");
		});
	});

	describe("formatTruncated", () => {
		it("should truncate valid address to 6...4 pattern", () => {
			const result = formatTruncated(validAddress);
			expect(result).toBe("GBZXN7...MADI");
		});

		it("should truncate another valid address", () => {
			const result = formatTruncated(validAddress2);
			expect(result).toBe("GCFONE...YPE");
		});

		it("should return invalid address unchanged", () => {
			const result = formatTruncated(invalidAddress);
			expect(result).toBe(invalidAddress);
		});

		it("should have correct pattern", () => {
			const result = formatTruncated(validAddress);
			expect(result).toMatch(/^G[A-Z2-7]{5}\.\.\.[A-Z2-7]{4}$/);
		});
	});

	describe("formatShort", () => {
		it("should return first 12 characters", () => {
			const result = formatShort(validAddress);
			expect(result).toBe("GBZXN7PIRZGN");
			expect(result.length).toBe(12);
		});

		it("should return first 12 characters of another address", () => {
			const result = formatShort(validAddress2);
			expect(result).toBe("GCFONE23AB7Y");
			expect(result.length).toBe(12);
		});

		it("should return invalid address unchanged", () => {
			const result = formatShort(invalidAddress);
			expect(result).toBe(invalidAddress);
		});
	});

	describe("formatChunked", () => {
		it("should chunk address with default size (7)", () => {
			const result = formatChunked(validAddress);
			const chunks = result.split(" ");
			expect(chunks.length).toBeGreaterThan(1);
			expect(chunks[0].length).toBe(7);
		});

		it("should chunk address with custom size", () => {
			const result = formatChunked(validAddress, 5);
			const chunks = result.split(" ");
			expect(chunks[0].length).toBe(5);
		});

		it("should use custom separator", () => {
			const result = formatChunked(validAddress, 7, "-");
			expect(result).toContain("-");
			expect(result).not.toContain(" ");
		});

		it("should handle chunk size of 1", () => {
			const result = formatChunked(validAddress, 1);
			const chunks = result.split(" ");
			expect(chunks.length).toBe(validAddress.length);
		});

		it("should return invalid address unchanged", () => {
			const result = formatChunked(invalidAddress);
			expect(result).toBe(invalidAddress);
		});

		it("should return address unchanged for invalid chunk size", () => {
			const result = formatChunked(validAddress, 0);
			expect(result).toBe(validAddress);
		});
	});

	describe("formatMasked", () => {
		it("should mask middle characters with default settings", () => {
			const result = formatMasked(validAddress);
			expect(result).toContain("*");
			expect(result.startsWith("GBZXN7PIRZGN")).toBe(true);
			expect(result.endsWith("XFDNMADI")).toBe(true);
		});

		it("should use custom mask character", () => {
			const result = formatMasked(validAddress, "#");
			expect(result).toContain("#");
			expect(result).not.toContain("*");
		});

		it("should respect visible characters setting", () => {
			const result = formatMasked(validAddress, "*", 6);
			expect(result.startsWith("GBZXN7")).toBe(true);
			expect(result.endsWith("MADI")).toBe(true);
		});

		it("should return invalid address unchanged", () => {
			const result = formatMasked(invalidAddress);
			expect(result).toBe(invalidAddress);
		});

		it("should return address unchanged for invalid visible chars", () => {
			const result = formatMasked(validAddress, "*", 100);
			expect(result).toBe(validAddress);
		});
	});

	describe("formatGrouped", () => {
		it("should group address with default size (4)", () => {
			const result = formatGrouped(validAddress);
			const groups = result.split(" ");
			expect(groups.length).toBeGreaterThan(1);
			expect(groups[0].length).toBe(4);
		});

		it("should group address with custom size", () => {
			const result = formatGrouped(validAddress, 6);
			const groups = result.split(" ");
			expect(groups[0].length).toBe(6);
		});

		it("should use custom separator", () => {
			const result = formatGrouped(validAddress, 4, "-");
			expect(result).toContain("-");
			expect(result).not.toContain(" ");
		});

		it("should return invalid address unchanged", () => {
			const result = formatGrouped(invalidAddress);
			expect(result).toBe(invalidAddress);
		});

		it("should return address unchanged for invalid group size", () => {
			const result = formatGrouped(validAddress, 0);
			expect(result).toBe(validAddress);
		});
	});

	describe("formatAddress", () => {
		it("should format with full format", () => {
			const result = formatAddress(validAddress, { format: "full" });
			expect(result.isValid).toBe(true);
			expect(result.formatted).toBe(validAddress);
			expect(result.format).toBe("full");
			expect(result.error).toBeNull();
		});

		it("should format with truncated format", () => {
			const result = formatAddress(validAddress, { format: "truncated" });
			expect(result.isValid).toBe(true);
			expect(result.formatted).toBe("GBZXN7...MADI");
			expect(result.format).toBe("truncated");
		});

		it("should format with short format", () => {
			const result = formatAddress(validAddress, { format: "short" });
			expect(result.isValid).toBe(true);
			expect(result.formatted).toBe("GBZXN7PIRZGN");
			expect(result.format).toBe("short");
		});

		it("should format with chunked format", () => {
			const result = formatAddress(validAddress, { format: "chunked" });
			expect(result.isValid).toBe(true);
			expect(result.formatted).toContain(" ");
			expect(result.format).toBe("chunked");
		});

		it("should format with masked format", () => {
			const result = formatAddress(validAddress, { format: "masked" });
			expect(result.isValid).toBe(true);
			expect(result.formatted).toContain("*");
			expect(result.format).toBe("masked");
		});

		it("should format with grouped format", () => {
			const result = formatAddress(validAddress, { format: "grouped" });
			expect(result.isValid).toBe(true);
			expect(result.formatted).toContain(" ");
			expect(result.format).toBe("grouped");
		});

		it("should handle invalid address", () => {
			const result = formatAddress(invalidAddress);
			expect(result.isValid).toBe(false);
			expect(result.error).not.toBeNull();
			expect(result.formatted).toBe(invalidAddress);
		});

		it("should handle empty address", () => {
			const result = formatAddress("");
			expect(result.isValid).toBe(false);
			expect(result.error).not.toBeNull();
		});

		it("should handle null/undefined", () => {
			const result = formatAddress(null as any);
			expect(result.isValid).toBe(false);
			expect(result.error).not.toBeNull();
		});

		it("should sanitize address (trim and uppercase)", () => {
			const result = formatAddress("  " + validAddress.toLowerCase() + "  ");
			expect(result.isValid).toBe(true);
			expect(result.formatted).toBe(validAddress);
		});

		it("should use custom options", () => {
			const result = formatAddress(validAddress, {
				format: "chunked",
				chunkSize: 5,
				separator: "-",
			});
			expect(result.isValid).toBe(true);
			expect(result.formatted).toContain("-");
		});
	});

	describe("formatAddresses", () => {
		it("should format multiple addresses", () => {
			const addresses = [validAddress, validAddress2];
			const results = formatAddresses(addresses, { format: "truncated" });
			expect(results).toHaveLength(2);
			expect(results[0].isValid).toBe(true);
			expect(results[1].isValid).toBe(true);
		});

		it("should handle mixed valid and invalid addresses", () => {
			const addresses = [validAddress, invalidAddress];
			const results = formatAddresses(addresses);
			expect(results[0].isValid).toBe(true);
			expect(results[1].isValid).toBe(false);
		});

		it("should return empty array for non-array input", () => {
			const results = formatAddresses(null as any);
			expect(results).toEqual([]);
		});
	});

	describe("compareAddresses", () => {
		it("should return true for identical addresses", () => {
			expect(compareAddresses(validAddress, validAddress)).toBe(true);
		});

		it("should return true for same address in different formats", () => {
			expect(compareAddresses(validAddress, validAddress.toLowerCase())).toBe(
				true,
			);
		});

		it("should return true for same address with spaces", () => {
			expect(compareAddresses(validAddress, "  " + validAddress + "  ")).toBe(
				true,
			);
		});

		it("should return false for different addresses", () => {
			expect(compareAddresses(validAddress, validAddress2)).toBe(false);
		});

		it("should return false for invalid addresses", () => {
			expect(compareAddresses(invalidAddress, validAddress)).toBe(false);
		});

		it("should return false for empty addresses", () => {
			expect(compareAddresses("", validAddress)).toBe(false);
		});

		it("should return false for null/undefined", () => {
			expect(compareAddresses(null as any, validAddress)).toBe(false);
			expect(compareAddresses(validAddress, undefined as any)).toBe(false);
		});
	});

	describe("extractFullAddress", () => {
		it("should extract full address from full format", () => {
			const result = extractFullAddress(validAddress);
			expect(result).toBe(validAddress);
		});

		it("should extract full address from truncated format", () => {
			const result = extractFullAddress(truncatedAddress);
			expect(result).toBe(validAddress);
		});

		it("should extract full address from chunked format", () => {
			const chunked = formatChunked(validAddress);
			const result = extractFullAddress(chunked);
			expect(result).toBe(validAddress);
		});

		it("should extract full address from grouped format", () => {
			const grouped = formatGrouped(validAddress);
			const result = extractFullAddress(grouped);
			expect(result).toBe(validAddress);
		});

		it("should return null for invalid address", () => {
			const result = extractFullAddress(invalidAddress);
			expect(result).toBeNull();
		});

		it("should return null for empty string", () => {
			const result = extractFullAddress("");
			expect(result).toBeNull();
		});

		it("should return null for null/undefined", () => {
			expect(extractFullAddress(null as any)).toBeNull();
			expect(extractFullAddress(undefined as any)).toBeNull();
		});
	});

	describe("getFormatDescription", () => {
		it("should return description for full format", () => {
			const desc = getFormatDescription("full");
			expect(desc).toContain("Full");
		});

		it("should return description for truncated format", () => {
			const desc = getFormatDescription("truncated");
			expect(desc).toContain("Truncated");
		});

		it("should return description for all formats", () => {
			const formats = [
				"full",
				"truncated",
				"short",
				"chunked",
				"masked",
				"grouped",
			] as const;
			formats.forEach((format) => {
				const desc = getFormatDescription(format);
				expect(desc).toBeTruthy();
				expect(desc.length).toBeGreaterThan(0);
			});
		});
	});

	describe("getAvailableFormats", () => {
		it("should return array of available formats", () => {
			const formats = getAvailableFormats();
			expect(Array.isArray(formats)).toBe(true);
			expect(formats.length).toBeGreaterThan(0);
		});

		it("should include all expected formats", () => {
			const formats = getAvailableFormats();
			expect(formats).toContain("full");
			expect(formats).toContain("truncated");
			expect(formats).toContain("short");
			expect(formats).toContain("chunked");
			expect(formats).toContain("masked");
			expect(formats).toContain("grouped");
		});
	});

	describe("validateFormattingOptions", () => {
		it("should validate valid options", () => {
			const result = validateFormattingOptions({ chunkSize: 5 });
			expect(result.isValid).toBe(true);
			expect(result.error).toBeNull();
		});

		it("should reject invalid chunk size", () => {
			const result = validateFormattingOptions({ chunkSize: 0 });
			expect(result.isValid).toBe(false);
			expect(result.error).not.toBeNull();
		});

		it("should reject invalid group size", () => {
			const result = validateFormattingOptions({ groupSize: -1 });
			expect(result.isValid).toBe(false);
			expect(result.error).not.toBeNull();
		});

		it("should reject invalid separator type", () => {
			const result = validateFormattingOptions({ separator: 123 as any });
			expect(result.isValid).toBe(false);
			expect(result.error).not.toBeNull();
		});

		it("should reject invalid mask char type", () => {
			const result = validateFormattingOptions({ maskChar: 123 as any });
			expect(result.isValid).toBe(false);
			expect(result.error).not.toBeNull();
		});

		it("should validate empty options", () => {
			const result = validateFormattingOptions({});
			expect(result.isValid).toBe(true);
			expect(result.error).toBeNull();
		});
	});

	describe("edge cases", () => {
		it("should handle very long strings", () => {
			const longString = "G" + "A".repeat(1000);
			const result = formatAddress(longString);
			expect(result.isValid).toBe(false);
		});

		it("should handle addresses with special characters", () => {
			const specialAddress = validAddress.replace("G", "!") + "!";
			const result = formatAddress(specialAddress);
			expect(result.isValid).toBe(false);
		});

		it("should handle mixed case addresses", () => {
			const mixedCase =
				validAddress.slice(0, 10).toLowerCase() + validAddress.slice(10);
			const result = formatAddress(mixedCase);
			expect(result.isValid).toBe(true);
		});

		it("should handle addresses with leading/trailing whitespace", () => {
			const withWhitespace = "   " + validAddress + "   ";
			const result = formatAddress(withWhitespace);
			expect(result.isValid).toBe(true);
			expect(result.formatted).toBe(validAddress);
		});
	});

	describe("integration scenarios", () => {
		it("should handle complete formatting workflow", () => {
			// Format in different ways
			const full = formatAddress(validAddress, { format: "full" });
			const truncated = formatAddress(validAddress, { format: "truncated" });
			const chunked = formatAddress(validAddress, { format: "chunked" });

			// All should be valid
			expect(full.isValid).toBe(true);
			expect(truncated.isValid).toBe(true);
			expect(chunked.isValid).toBe(true);

			// Extract full address from each
			expect(extractFullAddress(full.formatted)).toBe(validAddress);
			expect(extractFullAddress(truncated.formatted)).toBe(validAddress);
			expect(extractFullAddress(chunked.formatted)).toBe(validAddress);

			// Compare all formats
			expect(compareAddresses(full.formatted, truncated.formatted)).toBe(true);
			expect(compareAddresses(truncated.formatted, chunked.formatted)).toBe(
				true,
			);
		});

		it("should handle batch formatting and comparison", () => {
			const addresses = [validAddress, validAddress2];
			const formatted = formatAddresses(addresses, { format: "truncated" });

			expect(formatted).toHaveLength(2);
			expect(formatted[0].isValid).toBe(true);
			expect(formatted[1].isValid).toBe(true);

			// Compare original and formatted
			expect(compareAddresses(addresses[0], formatted[0].formatted)).toBe(true);
			expect(compareAddresses(addresses[1], formatted[1].formatted)).toBe(true);
		});
	});
});
