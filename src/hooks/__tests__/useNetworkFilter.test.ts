import { act, renderHook } from "@testing-library/react";
import type { Wallet } from "@/types/wallet";
import { useNetworkFilter } from "../useNetworkFilter";

describe("useNetworkFilter", () => {
	describe("Initial state", () => {
		it("should initialize with 'all' network selected", () => {
			const { result } = renderHook(() => useNetworkFilter());
			expect(result.current.selectedNetwork).toBe("all");
		});

		it("should provide all required functions", () => {
			const { result } = renderHook(() => useNetworkFilter());
			expect(typeof result.current.setSelectedNetwork).toBe("function");
			expect(typeof result.current.isNetworkSelected).toBe("function");
			expect(typeof result.current.filterByNetwork).toBe("function");
		});
	});

	describe("Network selection", () => {
		it("should update selectedNetwork to testnet", () => {
			const { result } = renderHook(() => useNetworkFilter());

			act(() => {
				result.current.setSelectedNetwork("testnet");
			});

			expect(result.current.selectedNetwork).toBe("testnet");
		});

		it("should update selectedNetwork to mainnet", () => {
			const { result } = renderHook(() => useNetworkFilter());

			act(() => {
				result.current.setSelectedNetwork("mainnet");
			});

			expect(result.current.selectedNetwork).toBe("mainnet");
		});

		it("should update selectedNetwork back to all", () => {
			const { result } = renderHook(() => useNetworkFilter());

			act(() => {
				result.current.setSelectedNetwork("testnet");
			});

			expect(result.current.selectedNetwork).toBe("testnet");

			act(() => {
				result.current.setSelectedNetwork("all");
			});

			expect(result.current.selectedNetwork).toBe("all");
		});

		it("should handle rapid network switches", () => {
			const { result } = renderHook(() => useNetworkFilter());

			act(() => {
				result.current.setSelectedNetwork("testnet");
				result.current.setSelectedNetwork("mainnet");
				result.current.setSelectedNetwork("testnet");
				result.current.setSelectedNetwork("all");
			});

			expect(result.current.selectedNetwork).toBe("all");
		});
	});

	describe("Invalid network handling", () => {
		it("should default to 'all' for invalid network value", () => {
			const { result } = renderHook(() => useNetworkFilter());

			act(() => {
				// @ts-ignore - Testing invalid input
				result.current.setSelectedNetwork("invalid-network");
			});

			expect(result.current.selectedNetwork).toBe("all");
		});

		it("should default to 'all' for null value", () => {
			const { result } = renderHook(() => useNetworkFilter());

			act(() => {
				// @ts-ignore - Testing invalid input
				result.current.setSelectedNetwork(null);
			});

			expect(result.current.selectedNetwork).toBe("all");
		});

		it("should default to 'all' for undefined value", () => {
			const { result } = renderHook(() => useNetworkFilter());

			act(() => {
				// @ts-ignore - Testing invalid input
				result.current.setSelectedNetwork(undefined);
			});

			expect(result.current.selectedNetwork).toBe("all");
		});

		it("should log warning for invalid network", () => {
			const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
			const { result } = renderHook(() => useNetworkFilter());

			act(() => {
				// @ts-ignore - Testing invalid input
				result.current.setSelectedNetwork("invalid");
			});

			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining("Invalid network value"),
			);

			consoleSpy.mockRestore();
		});
	});

	describe("isNetworkSelected", () => {
		it("should return true for selected network", () => {
			const { result } = renderHook(() => useNetworkFilter());

			act(() => {
				result.current.setSelectedNetwork("testnet");
			});

			expect(result.current.isNetworkSelected("testnet")).toBe(true);
		});

		it("should return false for unselected network", () => {
			const { result } = renderHook(() => useNetworkFilter());

			act(() => {
				result.current.setSelectedNetwork("testnet");
			});

			expect(result.current.isNetworkSelected("mainnet")).toBe(false);
		});

		it("should return true for 'all' when selected", () => {
			const { result } = renderHook(() => useNetworkFilter());

			expect(result.current.isNetworkSelected("all")).toBe(true);
		});

		it("should update correctly after network change", () => {
			const { result } = renderHook(() => useNetworkFilter());

			act(() => {
				result.current.setSelectedNetwork("mainnet");
			});

			expect(result.current.isNetworkSelected("mainnet")).toBe(true);
			expect(result.current.isNetworkSelected("testnet")).toBe(false);
			expect(result.current.isNetworkSelected("all")).toBe(false);
		});
	});

	describe("filterByNetwork", () => {
		const mockWallets: Wallet[] = [
			{
				id: "wallet-1",
				address: "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
				network: "mainnet",
				status: "active",
				createdAt: new Date(),
			},
			{
				id: "wallet-2",
				address: "GCFONE23AB7Y6C5YZOMKUKGETPIAJA752ZPMORQO5VKA6LHXHC7Y3YPE",
				network: "testnet",
				status: "active",
				createdAt: new Date(),
			},
			{
				id: "wallet-3",
				address: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOBER7KKQOAVSMIA",
				network: "mainnet",
				status: "pending",
				createdAt: new Date(),
			},
			{
				id: "wallet-4",
				address: "GCKFBEIYV2U22IO2BJ4KVJOIP7XPWQGQFKKWXR6DOSJBV7STMAQSMTRQ",
				network: "testnet",
				status: "inactive",
				createdAt: new Date(),
			},
		];

		it("should return all wallets when 'all' is selected", () => {
			const { result } = renderHook(() => useNetworkFilter());

			const filtered = result.current.filterByNetwork(mockWallets);

			expect(filtered).toHaveLength(4);
			expect(filtered).toEqual(mockWallets);
		});

		it("should return only mainnet wallets when mainnet is selected", () => {
			const { result } = renderHook(() => useNetworkFilter());

			act(() => {
				result.current.setSelectedNetwork("mainnet");
			});

			const filtered = result.current.filterByNetwork(mockWallets);

			expect(filtered).toHaveLength(2);
			expect(filtered.every((w) => w.network === "mainnet")).toBe(true);
		});

		it("should return only testnet wallets when testnet is selected", () => {
			const { result } = renderHook(() => useNetworkFilter());

			act(() => {
				result.current.setSelectedNetwork("testnet");
			});

			const filtered = result.current.filterByNetwork(mockWallets);

			expect(filtered).toHaveLength(2);
			expect(filtered.every((w) => w.network === "testnet")).toBe(true);
		});

		it("should return empty array when no wallets match filter", () => {
			const { result } = renderHook(() => useNetworkFilter());

			act(() => {
				result.current.setSelectedNetwork("mainnet");
			});

			const filtered = result.current.filterByNetwork([
				{
					id: "wallet-1",
					address: "GCFONE23AB7Y6C5YZOMKUKGETPIAJA752ZPMORQO5VKA6LHXHC7Y3YPE",
					network: "testnet",
					status: "active",
					createdAt: new Date(),
				},
			]);

			expect(filtered).toHaveLength(0);
		});

		it("should handle empty wallet array", () => {
			const { result } = renderHook(() => useNetworkFilter());

			act(() => {
				result.current.setSelectedNetwork("mainnet");
			});

			const filtered = result.current.filterByNetwork([]);

			expect(filtered).toHaveLength(0);
		});

		it("should update filter results after network change", () => {
			const { result } = renderHook(() => useNetworkFilter());

			let filtered = result.current.filterByNetwork(mockWallets);
			expect(filtered).toHaveLength(4);

			act(() => {
				result.current.setSelectedNetwork("mainnet");
			});

			filtered = result.current.filterByNetwork(mockWallets);
			expect(filtered).toHaveLength(2);

			act(() => {
				result.current.setSelectedNetwork("testnet");
			});

			filtered = result.current.filterByNetwork(mockWallets);
			expect(filtered).toHaveLength(2);

			act(() => {
				result.current.setSelectedNetwork("all");
			});

			filtered = result.current.filterByNetwork(mockWallets);
			expect(filtered).toHaveLength(4);
		});
	});

	describe("State persistence across renders", () => {
		it("should maintain selected network across multiple renders", () => {
			const { result, rerender } = renderHook(() => useNetworkFilter());

			act(() => {
				result.current.setSelectedNetwork("testnet");
			});

			expect(result.current.selectedNetwork).toBe("testnet");

			rerender();

			expect(result.current.selectedNetwork).toBe("testnet");
		});

		it("should maintain filter results across renders", () => {
			const mockWallets: Wallet[] = [
				{
					id: "wallet-1",
					address: "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
					network: "mainnet",
					status: "active",
					createdAt: new Date(),
				},
				{
					id: "wallet-2",
					address: "GCFONE23AB7Y6C5YZOMKUKGETPIAJA752ZPMORQO5VKA6LHXHC7Y3YPE",
					network: "testnet",
					status: "active",
					createdAt: new Date(),
				},
			];

			const { result, rerender } = renderHook(() => useNetworkFilter());

			act(() => {
				result.current.setSelectedNetwork("mainnet");
			});

			let filtered = result.current.filterByNetwork(mockWallets);
			expect(filtered).toHaveLength(1);

			rerender();

			filtered = result.current.filterByNetwork(mockWallets);
			expect(filtered).toHaveLength(1);
		});
	});

	describe("Edge cases", () => {
		it("should handle switching between same network multiple times", () => {
			const { result } = renderHook(() => useNetworkFilter());

			act(() => {
				result.current.setSelectedNetwork("mainnet");
				result.current.setSelectedNetwork("mainnet");
				result.current.setSelectedNetwork("mainnet");
			});

			expect(result.current.selectedNetwork).toBe("mainnet");
		});

		it("should handle filtering with wallets containing only one network", () => {
			const { result } = renderHook(() => useNetworkFilter());

			const mainnetOnlyWallets: Wallet[] = [
				{
					id: "wallet-1",
					address: "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
					network: "mainnet",
					status: "active",
					createdAt: new Date(),
				},
			];

			act(() => {
				result.current.setSelectedNetwork("testnet");
			});

			const filtered = result.current.filterByNetwork(mainnetOnlyWallets);
			expect(filtered).toHaveLength(0);
		});

		it("should handle large wallet arrays efficiently", () => {
			const { result } = renderHook(() => useNetworkFilter());

			const largeWalletArray: Wallet[] = Array.from(
				{ length: 1000 },
				(_, i) => ({
					id: `wallet-${i}`,
					address: `GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI${i}`,
					network: i % 2 === 0 ? "mainnet" : "testnet",
					status: "active",
					createdAt: new Date(),
				}),
			);

			act(() => {
				result.current.setSelectedNetwork("mainnet");
			});

			const filtered = result.current.filterByNetwork(largeWalletArray);
			expect(filtered).toHaveLength(500);
		});
	});
});
