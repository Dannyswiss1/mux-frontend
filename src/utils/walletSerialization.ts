import type { Wallet } from "@/types/wallet";

type WalletApiShape = Omit<Wallet, "createdAt" | "lastActivity"> & {
	createdAt: Date | string;
	lastActivity?: Date | string | null;
};

function toDate(value: Date | string | null | undefined): Date | undefined {
	if (!value) return undefined;
	if (value instanceof Date) return value;

	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function normalizeWallet(wallet: WalletApiShape): Wallet {
	const createdAt = toDate(wallet.createdAt);

	return {
		...wallet,
		createdAt: createdAt ?? new Date(0),
		lastActivity: toDate(wallet.lastActivity),
	};
}

export function normalizeWallets(wallets: WalletApiShape[]): Wallet[] {
	return wallets.map(normalizeWallet);
}
