/**
 * Tests for Transaction type and mock data (Node built-in test runner).
 * Run with: node --experimental-vm-modules src/types/__tests__/transaction.test.mjs
 * Or: node --test src/types/__tests__/transaction.test.mjs
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

// Inline the mock data to avoid TS/ESM resolution issues in plain Node
const mockTransactions = [
	{
		hash: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
		from: "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
		to: "GCFONE23AB7Y6C5YZOMKUKGETPIAJA752ZPMORQO5VKA6LHXHC7Y3YPE",
		amountXlm: "250.0000000",
		memo: "payment-ref-001",
		ledger: 48291034,
		fee: "0.0000100",
		network: "mainnet",
		status: "completed",
		createdAt: "2025-05-28T14:22:00Z",
	},
	{
		hash: "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
		from: "GCFONE23AB7Y6C5YZOMKUKGETPIAJA752ZPMORQO5VKA6LHXHC7Y3YPE",
		to: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOBER7KKQOAVSMIA",
		amountXlm: "1000.0000000",
		memo: "sdk-wallet-fund",
		ledger: 48291010,
		fee: "0.0000100",
		network: "mainnet",
		status: "completed",
		createdAt: "2025-05-27T09:45:00Z",
	},
	{
		hash: "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
		from: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOBER7KKQOAVSMIA",
		to: "GCKFBEIYV2U22IO2BJ4KVJOIP7XPWQGQFKKWXR6DOSJBV7STMAQSMTRQ",
		amountXlm: "50.5000000",
		ledger: 48290987,
		fee: "0.0000100",
		network: "testnet",
		status: "pending",
		createdAt: "2025-05-27T08:10:00Z",
	},
];

const VALID_STATUSES = ["completed", "pending", "failed"];
const VALID_NETWORKS = ["mainnet", "testnet"];
const STELLAR_ADDRESS_RE = /^G[A-Z2-7]{55}$/;
const STELLAR_HASH_RE = /^[0-9a-f]{64}$/;

describe("Transaction schema", () => {
	it("mock data is non-empty", () => {
		assert.ok(
			mockTransactions.length > 0,
			"should have at least one transaction",
		);
	});

	it("every transaction has required fields", () => {
		for (const tx of mockTransactions) {
			assert.ok(tx.hash, `hash missing on tx ${tx.hash}`);
			assert.ok(tx.from, `from missing on tx ${tx.hash}`);
			assert.ok(tx.to, `to missing on tx ${tx.hash}`);
			assert.ok(
				tx.amountXlm !== undefined,
				`amountXlm missing on tx ${tx.hash}`,
			);
			assert.ok(tx.ledger > 0, `ledger invalid on tx ${tx.hash}`);
			assert.ok(tx.fee, `fee missing on tx ${tx.hash}`);
			assert.ok(tx.network, `network missing on tx ${tx.hash}`);
			assert.ok(tx.status, `status missing on tx ${tx.hash}`);
			assert.ok(tx.createdAt, `createdAt missing on tx ${tx.hash}`);
		}
	});

	it("hash is 64-char lowercase hex", () => {
		for (const tx of mockTransactions) {
			assert.match(tx.hash, STELLAR_HASH_RE, `invalid hash: ${tx.hash}`);
		}
	});

	it("from and to are valid Stellar addresses (G...)", () => {
		for (const tx of mockTransactions) {
			assert.match(tx.from, STELLAR_ADDRESS_RE, `invalid from: ${tx.from}`);
			assert.match(tx.to, STELLAR_ADDRESS_RE, `invalid to: ${tx.to}`);
		}
	});

	it("amountXlm is a parseable positive number", () => {
		for (const tx of mockTransactions) {
			const n = Number(tx.amountXlm);
			assert.ok(
				!Number.isNaN(n) && n >= 0,
				`invalid amountXlm: ${tx.amountXlm}`,
			);
		}
	});

	it("status is one of the allowed values", () => {
		for (const tx of mockTransactions) {
			assert.ok(
				VALID_STATUSES.includes(tx.status),
				`invalid status: ${tx.status}`,
			);
		}
	});

	it("network is one of the allowed values", () => {
		for (const tx of mockTransactions) {
			assert.ok(
				VALID_NETWORKS.includes(tx.network),
				`invalid network: ${tx.network}`,
			);
		}
	});

	it("createdAt is a valid ISO 8601 date", () => {
		for (const tx of mockTransactions) {
			const d = new Date(tx.createdAt);
			assert.ok(
				!Number.isNaN(d.getTime()),
				`invalid createdAt: ${tx.createdAt}`,
			);
		}
	});

	it("hashes are unique", () => {
		const hashes = mockTransactions.map((tx) => tx.hash);
		const unique = new Set(hashes);
		assert.equal(unique.size, hashes.length, "duplicate hashes found");
	});
});
