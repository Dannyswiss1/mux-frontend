import { useCallback, useState } from "react";
import type { WalletNetwork } from "@/types/wallet";

/**
 * Hook for managing network filter state
 *
 * Handles network switching behavior with the following features:
 * - Persists selected network in component state
 * - Validates network values and defaults to "all" if invalid
 * - Provides callbacks for network changes
 * - Supports filtering wallets by network
 *
 * @returns Object containing:
 *   - selectedNetwork: Current selected network ("all", "testnet", or "mainnet")
 *   - setSelectedNetwork: Function to update selected network
 *   - isNetworkSelected: Function to check if a network is selected
 *   - filterByNetwork: Function to filter wallets by selected network
 *
 * @example
 * const { selectedNetwork, setSelectedNetwork, filterByNetwork } = useNetworkFilter();
 * const filteredWallets = filterByNetwork(allWallets);
 */
export function useNetworkFilter() {
	const [selectedNetwork, setSelectedNetworkState] = useState<
		WalletNetwork | "all"
	>("all");

	/**
	 * Validates and sets the selected network
	 * Defaults to "all" if invalid value is provided
	 */
	const setSelectedNetwork = useCallback((network: WalletNetwork | "all") => {
		const validNetworks: (WalletNetwork | "all")[] = [
			"all",
			"testnet",
			"mainnet",
		];

		if (validNetworks.includes(network)) {
			setSelectedNetworkState(network);
		} else {
			// Gracefully handle invalid network values
			console.warn(`Invalid network value: ${network}. Defaulting to "all".`);
			setSelectedNetworkState("all");
		}
	}, []);

	/**
	 * Checks if a specific network is currently selected
	 */
	const isNetworkSelected = useCallback(
		(network: WalletNetwork | "all") => {
			return selectedNetwork === network;
		},
		[selectedNetwork],
	);

	/**
	 * Filters wallets based on selected network
	 * Returns all wallets if "all" is selected
	 */
	const filterByNetwork = useCallback(
		(wallets: Array<{ network: WalletNetwork }>) => {
			if (selectedNetwork === "all") {
				return wallets;
			}
			return wallets.filter((wallet) => wallet.network === selectedNetwork);
		},
		[selectedNetwork],
	);

	return {
		selectedNetwork,
		setSelectedNetwork,
		isNetworkSelected,
		filterByNetwork,
	};
}
