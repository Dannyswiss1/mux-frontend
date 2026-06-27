/**
 * Generates explorer URLs for Stellar addresses based on network
 */

export type ExplorerType = "address" | "transaction" | "account";

interface ExplorerConfig {
	mainnet: string;
	testnet: string;
}

const explorerUrls: Record<ExplorerType, ExplorerConfig> = {
	address: {
		mainnet: "https://stellar.expert/explorer/public",
		testnet: "https://stellar.expert/explorer/testnet",
	},
	transaction: {
		mainnet: "https://stellar.expert/explorer/public/tx",
		testnet: "https://stellar.expert/explorer/testnet/tx",
	},
	account: {
		mainnet: "https://stellar.expert/explorer/public/account",
		testnet: "https://stellar.expert/explorer/testnet/account",
	},
};

/**
 * Generates a full explorer URL for a given address or transaction ID
 * @param identifier - The address or transaction ID
 * @param network - The network (mainnet or testnet)
 * @param type - The explorer type (address, transaction, or account)
 * @returns The full explorer URL
 */
export function getExplorerUrl(
	identifier: string,
	network: "mainnet" | "testnet",
	type: ExplorerType = "account",
): string {
	if (!identifier || !identifier.trim()) {
		throw new Error("Identifier cannot be empty");
	}

	const baseUrl = explorerUrls[type][network];
	return `${baseUrl}/${encodeURIComponent(identifier)}`;
}

/**
 * Validates if a string is a valid Stellar address
 * Stellar addresses start with 'G' and are 56 characters long
 */
export function isValidStellarAddress(address: string): boolean {
	if (!address || typeof address !== "string") return false;
	return /^G[A-Z2-7]{55}$/.test(address);
}

/**
 * Validates if a string is a valid Stellar transaction hash
 * Transaction hashes are 64 character hex strings
 */
export function isValidStellarTransaction(txHash: string): boolean {
	if (!txHash || typeof txHash !== "string") return false;
	return /^[a-f0-9]{64}$/i.test(txHash);
}
