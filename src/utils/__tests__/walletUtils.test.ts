import { describe, expect, it } from "vitest";
import type { Wallet } from "@/types/wallet";
import { isWalletFunded } from "../walletUtils";

function makeWallet(overrides: Partial<Wallet> = {}): Wallet {
	return {
		id: "w-1",
		address: "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
		network: "mainnet",
		status: "active",
		createdAt: new Date("2024-01-15T10:30:00Z"),
		...overrides,
	};
}

describe("isWalletFunded", () => {
	it("returns true for a wallet with a positive balance", () => {
		const wallet = makeWallet({ balance: "1,250.50 XLM" });
		expect(isWalletFunded(wallet)).toBe(true);
	});

	it("returns false for a wallet with a zero balance", () => {
		const wallet = makeWallet({ balance: "0.00 XLM" });
		expect(isWalletFunded(wallet)).toBe(false);
	});

	it("returns false for a wallet with no balance field", () => {
		const wallet = makeWallet({});
		expect(isWalletFunded(wallet)).toBe(false);
	});

	it("returns false for null wallet", () => {
		expect(isWalletFunded(null)).toBe(false);
	});

	it("returns false for undefined wallet", () => {
		expect(isWalletFunded(undefined)).toBe(false);
	});

	it("returns true for a wallet with a small positive balance", () => {
		const wallet = makeWallet({ balance: "0.01 XLM" });
		expect(isWalletFunded(wallet)).toBe(true);
	});

	it("returns true for a wallet with a large balance", () => {
		const wallet = makeWallet({ balance: "10,000.00 XLM" });
		expect(isWalletFunded(wallet)).toBe(true);
	});

	it("returns false for a wallet with an empty balance string", () => {
		const wallet = makeWallet({ balance: "" });
		expect(isWalletFunded(wallet)).toBe(false);
	});
});
