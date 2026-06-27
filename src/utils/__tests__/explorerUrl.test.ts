import {
	getExplorerUrl,
	isValidStellarAddress,
	isValidStellarTransaction,
} from "../explorerUrl";

describe("explorerUrl utilities", () => {
	describe("getExplorerUrl", () => {
		it("should generate correct mainnet account URL", () => {
			const address =
				"GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
			const url = getExplorerUrl(address, "mainnet", "account");
			expect(url).toBe(
				"https://stellar.expert/explorer/public/account/GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
			);
		});

		it("should generate correct testnet account URL", () => {
			const address =
				"GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
			const url = getExplorerUrl(address, "testnet", "account");
			expect(url).toBe(
				"https://stellar.expert/explorer/testnet/account/GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
			);
		});

		it("should generate correct transaction URL", () => {
			const txHash =
				"a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1";
			const url = getExplorerUrl(txHash, "mainnet", "transaction");
			expect(url).toContain("/tx/");
			expect(url).toContain(txHash);
		});

		it("should default to account type", () => {
			const address =
				"GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
			const url = getExplorerUrl(address, "mainnet");
			expect(url).toContain("/account/");
		});

		it("should URL encode special characters", () => {
			const identifier = "test@example.com";
			const url = getExplorerUrl(identifier, "mainnet");
			expect(url).toContain(encodeURIComponent(identifier));
		});

		it("should throw error for empty identifier", () => {
			expect(() => getExplorerUrl("", "mainnet")).toThrow(
				"Identifier cannot be empty",
			);
		});

		it("should throw error for whitespace-only identifier", () => {
			expect(() => getExplorerUrl("   ", "mainnet")).toThrow(
				"Identifier cannot be empty",
			);
		});
	});

	describe("isValidStellarAddress", () => {
		it("should validate correct Stellar address", () => {
			const address =
				"GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
			expect(isValidStellarAddress(address)).toBe(true);
		});

		it("should validate another correct Stellar address", () => {
			const address =
				"GCFONE23AB7Y6C5YZOMKUKGETPIAJA752ZPMORQO5VKA6LHXHC7Y3YPE";
			expect(isValidStellarAddress(address)).toBe(true);
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
	});

	describe("isValidStellarTransaction", () => {
		it("should validate correct transaction hash", () => {
			const txHash =
				"a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1";
			expect(isValidStellarTransaction(txHash)).toBe(true);
		});

		it("should validate uppercase transaction hash", () => {
			const txHash =
				"A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1";
			expect(isValidStellarTransaction(txHash)).toBe(true);
		});

		it("should reject transaction hash with wrong length", () => {
			const txHash =
				"a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6";
			expect(isValidStellarTransaction(txHash)).toBe(false);
		});

		it("should reject transaction hash with non-hex characters", () => {
			const txHash =
				"g1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1";
			expect(isValidStellarTransaction(txHash)).toBe(false);
		});

		it("should reject empty string", () => {
			expect(isValidStellarTransaction("")).toBe(false);
		});

		it("should reject null/undefined", () => {
			expect(isValidStellarTransaction(null as any)).toBe(false);
			expect(isValidStellarTransaction(undefined as any)).toBe(false);
		});
	});
});
