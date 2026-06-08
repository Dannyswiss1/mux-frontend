import {
	expandTruncatedAddress,
	getAddressToCopy,
	getAddressValidationError,
	isSafeToCopy,
	isTruncatedAddress,
	isValidStellarAddress,
	sanitizeAddress,
	validateAddressForCopy,
} from "../addressValidation";

describe("addressValidation utilities", () => {
	const validAddress =
		"GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
	const validAddress2 =
		"GCFONE23AB7Y6C5YZOMKUKGETPIAJA752ZPMORQO5VKA6LHXHC7Y3YPE";
	const truncatedAddress = "GBZXN7...MADI";
	const truncatedAddress2 = "GCFONE...YPE";
	const invalidAddress = "INVALID_ADDRESS";

	describe("isValidStellarAddress", () => {
		it("should validate correct Stellar address", () => {
			expect(isValidStellarAddress(validAddress)).toBe(true);
		});

		it("should validate another correct Stellar address", () => {
			expect(isValidStellarAddress(validAddress2)).toBe(true);
		});

		it("should reject address not starting with G", () => {
			const address =
				"ABZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
			expect(isValidStellarAddress(address)).toBe(false);
		});

		it("should reject address with wrong length", () => {
			const address = "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMAD";
			expect(isValidStellarAddress(address)).toBe(false);
		});

		it("should reject address with invalid characters", () => {
			const address =
				"GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMAD!";
			expect(isValidStellarAddress(address)).toBe(false);
		});

		it("should reject empty string", () => {
			expect(isValidStellarAddress("")).toBe(false);
		});

		it("should reject null/undefined", () => {
			expect(isValidStellarAddress(null as any)).toBe(false);
			expect(isValidStellarAddress(undefined as any)).toBe(false);
		});

		it("should reject non-string values", () => {
			expect(isValidStellarAddress(123 as any)).toBe(false);
			expect(isValidStellarAddress({} as any)).toBe(false);
		});

		it("should reject lowercase addresses", () => {
			const address = validAddress.toLowerCase();
			expect(isValidStellarAddress(address)).toBe(false);
		});
	});

	describe("isTruncatedAddress", () => {
		it("should recognize valid truncated address", () => {
			expect(isTruncatedAddress(truncatedAddress)).toBe(true);
		});

		it("should recognize another valid truncated address", () => {
			expect(isTruncatedAddress(truncatedAddress2)).toBe(true);
		});

		it("should reject full address", () => {
			expect(isTruncatedAddress(validAddress)).toBe(false);
		});

		it("should reject invalid truncated format (missing dots)", () => {
			expect(isTruncatedAddress("GBZXN7MADI")).toBe(false);
		});

		it("should reject invalid truncated format (wrong prefix length)", () => {
			expect(isTruncatedAddress("GBZXN...MADI")).toBe(false);
		});

		it("should reject invalid truncated format (wrong suffix length)", () => {
			expect(isTruncatedAddress("GBZXN7...MAD")).toBe(false);
		});

		it("should reject invalid truncated format (invalid characters)", () => {
			expect(isTruncatedAddress("GBZXN7...MAD!")).toBe(false);
		});

		it("should reject empty string", () => {
			expect(isTruncatedAddress("")).toBe(false);
		});

		it("should reject null/undefined", () => {
			expect(isTruncatedAddress(null as any)).toBe(false);
			expect(isTruncatedAddress(undefined as any)).toBe(false);
		});
	});

	describe("expandTruncatedAddress", () => {
		it("should expand valid truncated address", () => {
			const result = expandTruncatedAddress(truncatedAddress, validAddress);
			expect(result).toBe(validAddress);
		});

		it("should expand another valid truncated address", () => {
			const result = expandTruncatedAddress(truncatedAddress2, validAddress2);
			expect(result).toBe(validAddress2);
		});

		it("should return null for invalid truncated format", () => {
			const result = expandTruncatedAddress("INVALID", validAddress);
			expect(result).toBeNull();
		});

		it("should return null for invalid full address", () => {
			const result = expandTruncatedAddress(truncatedAddress, "INVALID");
			expect(result).toBeNull();
		});

		it("should return null if truncated doesn't match full address", () => {
			const result = expandTruncatedAddress(truncatedAddress, validAddress2);
			expect(result).toBeNull();
		});

		it("should return null for empty truncated address", () => {
			const result = expandTruncatedAddress("", validAddress);
			expect(result).toBeNull();
		});

		it("should return null for empty full address", () => {
			const result = expandTruncatedAddress(truncatedAddress, "");
			expect(result).toBeNull();
		});
	});

	describe("validateAddressForCopy", () => {
		it("should validate full address", () => {
			const result = validateAddressForCopy(validAddress);
			expect(result.isValid).toBe(true);
			expect(result.format).toBe("full");
			expect(result.error).toBeNull();
			expect(result.fullAddress).toBe(validAddress);
		});

		it("should validate truncated address with full address", () => {
			const result = validateAddressForCopy(truncatedAddress, validAddress);
			expect(result.isValid).toBe(true);
			expect(result.format).toBe("truncated");
			expect(result.error).toBeNull();
			expect(result.fullAddress).toBe(validAddress);
		});

		it("should reject truncated address without full address", () => {
			const result = validateAddressForCopy(truncatedAddress);
			expect(result.isValid).toBe(false);
			expect(result.format).toBe("truncated");
			expect(result.error).not.toBeNull();
			expect(result.fullAddress).toBeNull();
		});

		it("should reject mismatched truncated and full address", () => {
			const result = validateAddressForCopy(truncatedAddress, validAddress2);
			expect(result.isValid).toBe(false);
			expect(result.format).toBe("truncated");
			expect(result.error).not.toBeNull();
			expect(result.fullAddress).toBeNull();
		});

		it("should reject invalid address", () => {
			const result = validateAddressForCopy(invalidAddress);
			expect(result.isValid).toBe(false);
			expect(result.format).toBeNull();
			expect(result.error).not.toBeNull();
			expect(result.fullAddress).toBeNull();
		});

		it("should reject empty address", () => {
			const result = validateAddressForCopy("");
			expect(result.isValid).toBe(false);
			expect(result.format).toBeNull();
			expect(result.error).not.toBeNull();
			expect(result.fullAddress).toBeNull();
		});
	});

	describe("getAddressValidationError", () => {
		it("should return null for valid address", () => {
			const result = validateAddressForCopy(validAddress);
			const error = getAddressValidationError(result);
			expect(error).toBeNull();
		});

		it("should return error message for invalid address", () => {
			const result = validateAddressForCopy(invalidAddress);
			const error = getAddressValidationError(result);
			expect(error).not.toBeNull();
			expect(typeof error).toBe("string");
		});

		it("should return error message for truncated without full", () => {
			const result = validateAddressForCopy(truncatedAddress);
			const error = getAddressValidationError(result);
			expect(error).not.toBeNull();
			expect(error).toContain("Truncated address requires full address");
		});

		it("should return error message for mismatched addresses", () => {
			const result = validateAddressForCopy(truncatedAddress, validAddress2);
			const error = getAddressValidationError(result);
			expect(error).not.toBeNull();
			expect(error).toContain("does not match");
		});
	});

	describe("sanitizeAddress", () => {
		it("should trim whitespace", () => {
			const result = sanitizeAddress("  " + validAddress + "  ");
			expect(result).toBe(validAddress);
		});

		it("should convert to uppercase", () => {
			const result = sanitizeAddress(validAddress.toLowerCase());
			expect(result).toBe(validAddress);
		});

		it("should handle empty string", () => {
			const result = sanitizeAddress("");
			expect(result).toBe("");
		});

		it("should handle null/undefined", () => {
			expect(sanitizeAddress(null as any)).toBe("");
			expect(sanitizeAddress(undefined as any)).toBe("");
		});

		it("should trim and uppercase together", () => {
			const result = sanitizeAddress("  " + validAddress.toLowerCase() + "  ");
			expect(result).toBe(validAddress);
		});
	});

	describe("isSafeToCopy", () => {
		it("should return true for valid full address", () => {
			expect(isSafeToCopy(validAddress)).toBe(true);
		});

		it("should return true for valid truncated address with full", () => {
			expect(isSafeToCopy(truncatedAddress, validAddress)).toBe(true);
		});

		it("should return false for invalid address", () => {
			expect(isSafeToCopy(invalidAddress)).toBe(false);
		});

		it("should return false for truncated without full", () => {
			expect(isSafeToCopy(truncatedAddress)).toBe(false);
		});

		it("should return false for mismatched addresses", () => {
			expect(isSafeToCopy(truncatedAddress, validAddress2)).toBe(false);
		});

		it("should return false for empty address", () => {
			expect(isSafeToCopy("")).toBe(false);
		});
	});

	describe("getAddressToCopy", () => {
		it("should return full address for valid full address", () => {
			const result = getAddressToCopy(validAddress);
			expect(result).toBe(validAddress);
		});

		it("should return full address for valid truncated address", () => {
			const result = getAddressToCopy(truncatedAddress, validAddress);
			expect(result).toBe(validAddress);
		});

		it("should return null for invalid address", () => {
			const result = getAddressToCopy(invalidAddress);
			expect(result).toBeNull();
		});

		it("should return null for truncated without full", () => {
			const result = getAddressToCopy(truncatedAddress);
			expect(result).toBeNull();
		});

		it("should return null for mismatched addresses", () => {
			const result = getAddressToCopy(truncatedAddress, validAddress2);
			expect(result).toBeNull();
		});

		it("should return null for empty address", () => {
			const result = getAddressToCopy("");
			expect(result).toBeNull();
		});
	});

	describe("edge cases", () => {
		it("should handle addresses with special characters", () => {
			const result = validateAddressForCopy("GBZXN7!@#$%^&*()");
			expect(result.isValid).toBe(false);
		});

		it("should handle very long strings", () => {
			const longString = "G" + "A".repeat(1000);
			const result = validateAddressForCopy(longString);
			expect(result.isValid).toBe(false);
		});

		it("should handle mixed case addresses", () => {
			const mixedCase =
				"GbZxN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
			const result = validateAddressForCopy(mixedCase);
			expect(result.isValid).toBe(false);
		});

		it("should handle addresses with spaces", () => {
			const withSpaces =
				"GBZXN7 PIRZGNMHGA7 MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
			const result = validateAddressForCopy(withSpaces);
			expect(result.isValid).toBe(false);
		});

		it("should handle truncated addresses with spaces", () => {
			const withSpaces = "GBZXN7 ... MADI";
			const result = isTruncatedAddress(withSpaces);
			expect(result).toBe(false);
		});
	});

	describe("integration scenarios", () => {
		it("should handle copy workflow for full address", () => {
			const address = validAddress;
			const isSafe = isSafeToCopy(address);
			expect(isSafe).toBe(true);

			const toCopy = getAddressToCopy(address);
			expect(toCopy).toBe(validAddress);
		});

		it("should handle copy workflow for truncated address", () => {
			const truncated = truncatedAddress;
			const full = validAddress;

			const isSafe = isSafeToCopy(truncated, full);
			expect(isSafe).toBe(true);

			const toCopy = getAddressToCopy(truncated, full);
			expect(toCopy).toBe(validAddress);
		});

		it("should handle copy workflow for invalid address", () => {
			const address = invalidAddress;
			const isSafe = isSafeToCopy(address);
			expect(isSafe).toBe(false);

			const toCopy = getAddressToCopy(address);
			expect(toCopy).toBeNull();

			const result = validateAddressForCopy(address);
			const error = getAddressValidationError(result);
			expect(error).not.toBeNull();
		});
	});
});
