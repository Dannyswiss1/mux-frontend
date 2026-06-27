import type { Wallet } from "@/types/wallet";

/**
 * Determines whether a wallet is funded (has a positive balance).
 *
 * A wallet is considered funded when:
 * - It has a balance string that contains a numeric value greater than zero.
 * - The balance is not null/undefined.
 *
 * @param wallet - The wallet to check.
 * @returns `true` if the wallet has a positive balance, `false` otherwise.
 */
export function isWalletFunded(wallet: Wallet | null | undefined): boolean {
	if (!wallet?.balance) return false;

	// Balance is formatted like "1,250.50 XLM" or "0.00 XLM"
	// Extract the numeric part before the currency
	const numericPart = wallet.balance.replace(/[^0-9.,]/g, "").replace(/,/g, "");
	const amount = Number.parseFloat(numericPart);

	return !Number.isNaN(amount) && amount > 0;
}
