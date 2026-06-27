export type TransactionStatus = "completed" | "pending" | "failed";
export type TransactionNetwork = "testnet" | "mainnet";

export interface Transaction {
	/** Stellar transaction hash (64-char hex) */
	hash: string;
	/** Source Stellar account address (G...) */
	from: string;
	/** Destination Stellar account address (G...) */
	to: string;
	/** Amount in XLM (stroops / 1e7) */
	amountXlm: string;
	/** Optional transaction memo */
	memo?: string;
	/** Stellar ledger sequence number */
	ledger: number;
	/** Transaction fee in XLM */
	fee: string;
	network: TransactionNetwork;
	status: TransactionStatus;
	createdAt: string; // ISO 8601
}
