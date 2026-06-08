import {
	FRIENDBOT_DOCS_URL,
	FRIENDBOT_URL,
	getFriendbotUrl,
	isFriendbotEligible,
	isValidAddressForFriendbot,
} from "../friendbot";

describe("friendbot utilities", () => {
	describe("isFriendbotEligible", () => {
		it("should return true for testnet", () => {
			expect(isFriendbotEligible("testnet")).toBe(true);
		});

		it("should return false for mainnet", () => {
			expect(isFriendbotEligible("mainnet")).toBe(false);
		});
	});

	describe("isValidAddressForFriendbot", () => {
		it("should validate correct Stellar address", () => {
			const address =
				"GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
			expect(isValidAddressForFriendbot(address)).toBe(true);
		});

		it("should validate another correct Stellar address", () => {
			const address =
				"GCFONE23AB7Y6C5YZOMKUKGETPIAJA752ZPMORQO5VKA6LHXHC7Y3YPE";
			expect(isValidAddressForFriendbot(address)).toBe(true);
		});

		it("should reject address not starting with G", () => {
			const address =
				"ABZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
			expect(isValidAddressForFriendbot(address)).toBe(false);
		});

		it("should reject address with wrong length", () => {
			const address = "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMAD";
			expect(isValidAddressForFriendbot(address)).toBe(false);
		});

		it("should reject empty string", () => {
			expect(isValidAddressForFriendbot("")).toBe(false);
		});

		it("should reject null/undefined", () => {
			expect(isValidAddressForFriendbot(null as any)).toBe(false);
			expect(isValidAddressForFriendbot(undefined as any)).toBe(false);
		});

		it("should reject non-string values", () => {
			expect(isValidAddressForFriendbot(123 as any)).toBe(false);
			expect(isValidAddressForFriendbot({} as any)).toBe(false);
		});
	});

	describe("getFriendbotUrl", () => {
		it("should generate correct Friendbot URL", () => {
			const address =
				"GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
			const url = getFriendbotUrl(address);
			expect(url).toContain(FRIENDBOT_URL);
			expect(url).toContain(`addr=${address}`);
		});

		it("should URL encode special characters in address", () => {
			const address = "test@example.com";
			const url = getFriendbotUrl(address);
			expect(url).toContain(encodeURIComponent(address));
		});

		it("should throw error for empty address", () => {
			expect(() => getFriendbotUrl("")).toThrow("Address cannot be empty");
		});

		it("should throw error for whitespace-only address", () => {
			expect(() => getFriendbotUrl("   ")).toThrow("Address cannot be empty");
		});

		it("should include addr parameter in query string", () => {
			const address =
				"GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
			const url = getFriendbotUrl(address);
			const urlObj = new URL(url);
			expect(urlObj.searchParams.get("addr")).toBe(address);
		});
	});

	describe("constants", () => {
		it("should have valid FRIENDBOT_URL", () => {
			expect(FRIENDBOT_URL).toBe("https://friendbot.stellar.org/");
		});

		it("should have valid FRIENDBOT_DOCS_URL", () => {
			expect(FRIENDBOT_DOCS_URL).toContain("developers.stellar.org");
			expect(FRIENDBOT_DOCS_URL).toContain("testnet");
		});
	});
});
