/** A Stellar wallet tracked on the platform. */
export interface Wallet {
	/** Unique internal identifier for this wallet record. */
	id: string;
	/** Full 56-character Stellar public key (G-address). */
	address: string;
	/** Optional user-defined display name (max 30 chars). */
	label?: string;
	/** The Stellar network this wallet belongs to. */
	network: "testnet" | "mainnet";
	/** Lifecycle status of the wallet. `pending` until confirmed on-chain. */
	status: "active" | "pending" | "inactive";
	/** When the wallet was registered on this platform. */
	createdAt: Date;
	/** Formatted XLM balance string, e.g. `"1,250.50 XLM"`. Absent when not yet fetched. */
	balance?: string;
	/** Timestamp of the most recent on-chain activity, if known. */
	lastActivity?: Date;
}

export type WalletNetwork = Wallet["network"];
export type WalletStatus = Wallet["status"];

/** Props for the `WalletTable` component. */
export interface WalletTableProps {
	/** The wallets to display. An empty array renders the empty-state message. */
	wallets: Wallet[];
	/**
	 * Called when the user clicks "Add Wallet". Omit to hide the button entirely.
	 */
	onAddWallet?: () => void;
	/**
	 * Called after a wallet address is successfully copied to the clipboard.
	 * Receives the full 56-character address that was copied.
	 */
	onCopySuccess?: (address: string) => void;
	/**
	 * Called when the clipboard write fails.
	 * Receives a human-readable error message.
	 */
	onCopyError?: (error: string) => void;
}
