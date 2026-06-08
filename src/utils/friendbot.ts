/**
 * Friendbot utilities for Stellar testnet
 * Friendbot is a testnet faucet that funds new accounts with test XLM
 */

export const FRIENDBOT_URL = "https://friendbot.stellar.org/";
export const FRIENDBOT_DOCS_URL =
	"https://developers.stellar.org/docs/learn/fundamentals/testnet";

/**
 * Generates a Friendbot funding URL for a given Stellar address
 * @param address - The Stellar address to fund
 * @returns The Friendbot URL with the address parameter
 */
export function getFriendbotUrl(address: string): string {
	if (!address || !address.trim()) {
		throw new Error("Address cannot be empty");
	}

	const url = new URL(FRIENDBOT_URL);
	url.searchParams.set("addr", address);
	return url.toString();
}

/**
 * Checks if an address is eligible for Friendbot funding
 * Friendbot can only fund addresses on testnet
 * @param network - The network (mainnet or testnet)
 * @returns true if the address can be funded by Friendbot
 */
export function isFriendbotEligible(network: "mainnet" | "testnet"): boolean {
	return network === "testnet";
}

/**
 * Validates if a Stellar address is valid for Friendbot
 * Stellar addresses start with 'G' and are 56 characters long
 */
export function isValidAddressForFriendbot(address: string): boolean {
	if (!address || typeof address !== "string") return false;
	return /^G[A-Z2-7]{55}$/.test(address);
}
