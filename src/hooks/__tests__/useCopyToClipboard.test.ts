import { act, renderHook, waitFor } from "@testing-library/react";
import { useCopyToClipboard } from "../useCopyToClipboard";

// Mock the clipboard API
Object.assign(navigator, {
	clipboard: {
		writeText: jest.fn(),
	},
});

// Mock address validation
jest.mock("@/utils/addressValidation", () => ({
	isSafeToCopy: jest.fn((text, fullAddress) => {
		// Valid Stellar address format
		if (/^G[A-Z2-7]{55}$/.test(text)) return true;
		// Truncated format with full address
		if (/^G[A-Z2-7]{5}\.\.\.[A-Z2-7]{4}$/.test(text) && fullAddress) {
			return /^G[A-Z2-7]{55}$/.test(fullAddress);
		}
		return false;
	}),
	getAddressToCopy: jest.fn((text, fullAddress) => {
		if (/^G[A-Z2-7]{55}$/.test(text)) return text;
		if (/^G[A-Z2-7]{5}\.\.\.[A-Z2-7]{4}$/.test(text) && fullAddress) {
			return /^G[A-Z2-7]{55}$/.test(fullAddress) ? fullAddress : null;
		}
		return null;
	}),
}));

describe("useCopyToClipboard hook", () => {
	const validAddress =
		"GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
	const truncatedAddress = "GBZXN7...MADI";
	const invalidAddress = "INVALID_ADDRESS";
	const regularText = "Hello World";

	beforeEach(() => {
		jest.clearAllMocks();
		(navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);
	});

	describe("basic functionality", () => {
		it("should copy regular text", async () => {
			const { result } = renderHook(() => useCopyToClipboard());

			await act(async () => {
				await result.current.copy(regularText);
			});

			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(regularText);
			expect(result.current.copied).toBe(true);
			expect(result.current.error).toBeNull();
		});

		it("should copy valid Stellar address", async () => {
			const { result } = renderHook(() => useCopyToClipboard());

			await act(async () => {
				await result.current.copy(validAddress, validAddress);
			});

			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(validAddress);
			expect(result.current.copied).toBe(true);
			expect(result.current.error).toBeNull();
		});

		it("should reject invalid address", async () => {
			const { result } = renderHook(() => useCopyToClipboard());

			await act(async () => {
				await result.current.copy(invalidAddress);
			});

			expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
			expect(result.current.copied).toBe(false);
			expect(result.current.error).not.toBeNull();
		});
	});

	describe("address validation", () => {
		it("should validate full address before copying", async () => {
			const { result } = renderHook(() => useCopyToClipboard());

			await act(async () => {
				await result.current.copy(validAddress, validAddress);
			});

			expect(result.current.error).toBeNull();
			expect(result.current.copied).toBe(true);
		});

		it("should reject invalid address format", async () => {
			const { result } = renderHook(() => useCopyToClipboard());

			await act(async () => {
				await result.current.copy(invalidAddress);
			});

			expect(result.current.error).toBe("Invalid address format");
			expect(result.current.copied).toBe(false);
		});

		it("should handle truncated address with full address", async () => {
			const { result } = renderHook(() => useCopyToClipboard());

			await act(async () => {
				await result.current.copy(truncatedAddress, validAddress);
			});

			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(validAddress);
			expect(result.current.error).toBeNull();
			expect(result.current.copied).toBe(true);
		});

		it("should reject truncated address without full address", async () => {
			const { result } = renderHook(() => useCopyToClipboard());

			await act(async () => {
				await result.current.copy(truncatedAddress);
			});

			expect(result.current.error).not.toBeNull();
			expect(result.current.copied).toBe(false);
		});
	});

	describe("error handling", () => {
		it("should handle clipboard API errors", async () => {
			(navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(
				new Error("Clipboard error"),
			);

			const { result } = renderHook(() => useCopyToClipboard());

			await act(async () => {
				await result.current.copy(regularText);
			});

			expect(result.current.error).toBe("Clipboard error");
			expect(result.current.copied).toBe(false);
		});

		it("should clear previous error on successful copy", async () => {
			const { result } = renderHook(() => useCopyToClipboard());

			// First, trigger an error
			await act(async () => {
				await result.current.copy(invalidAddress);
			});

			expect(result.current.error).not.toBeNull();

			// Then, copy valid text
			await act(async () => {
				await result.current.copy(regularText);
			});

			expect(result.current.error).toBeNull();
			expect(result.current.copied).toBe(true);
		});

		it("should handle generic errors", async () => {
			(navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(
				"Unknown error",
			);

			const { result } = renderHook(() => useCopyToClipboard());

			await act(async () => {
				await result.current.copy(regularText);
			});

			expect(result.current.error).toBe("Failed to copy to clipboard");
		});
	});

	describe("state management", () => {
		it("should reset copied state after delay", async () => {
			jest.useFakeTimers();
			const { result } = renderHook(() => useCopyToClipboard(1000));

			await act(async () => {
				await result.current.copy(regularText);
			});

			expect(result.current.copied).toBe(true);

			act(() => {
				jest.advanceTimersByTime(1000);
			});

			expect(result.current.copied).toBe(false);

			jest.useRealTimers();
		});

		it("should use custom reset delay", async () => {
			jest.useFakeTimers();
			const { result } = renderHook(() => useCopyToClipboard(500));

			await act(async () => {
				await result.current.copy(regularText);
			});

			expect(result.current.copied).toBe(true);

			act(() => {
				jest.advanceTimersByTime(500);
			});

			expect(result.current.copied).toBe(false);

			jest.useRealTimers();
		});

		it("should maintain error state until next copy attempt", async () => {
			const { result } = renderHook(() => useCopyToClipboard());

			await act(async () => {
				await result.current.copy(invalidAddress);
			});

			expect(result.current.error).not.toBeNull();

			// Error should persist
			expect(result.current.error).not.toBeNull();
		});
	});

	describe("integration scenarios", () => {
		it("should handle copy workflow for valid address", async () => {
			const { result } = renderHook(() => useCopyToClipboard());

			// Initial state
			expect(result.current.copied).toBe(false);
			expect(result.current.error).toBeNull();

			// Copy address
			await act(async () => {
				await result.current.copy(validAddress, validAddress);
			});

			// Success state
			expect(result.current.copied).toBe(true);
			expect(result.current.error).toBeNull();
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(validAddress);
		});

		it("should handle copy workflow for invalid address", async () => {
			const { result } = renderHook(() => useCopyToClipboard());

			// Initial state
			expect(result.current.copied).toBe(false);
			expect(result.current.error).toBeNull();

			// Try to copy invalid address
			await act(async () => {
				await result.current.copy(invalidAddress);
			});

			// Error state
			expect(result.current.copied).toBe(false);
			expect(result.current.error).not.toBeNull();
			expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
		});

		it("should handle multiple copy attempts", async () => {
			const { result } = renderHook(() => useCopyToClipboard());

			// First copy
			await act(async () => {
				await result.current.copy(regularText);
			});

			expect(result.current.copied).toBe(true);
			expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);

			// Second copy
			await act(async () => {
				await result.current.copy(validAddress, validAddress);
			});

			expect(result.current.copied).toBe(true);
			expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(2);
		});
	});

	describe("edge cases", () => {
		it("should handle empty string", async () => {
			const { result } = renderHook(() => useCopyToClipboard());

			await act(async () => {
				await result.current.copy("");
			});

			expect(navigator.clipboard.writeText).toHaveBeenCalledWith("");
			expect(result.current.copied).toBe(true);
		});

		it("should handle very long text", async () => {
			const longText = "A".repeat(10000);
			const { result } = renderHook(() => useCopyToClipboard());

			await act(async () => {
				await result.current.copy(longText);
			});

			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(longText);
			expect(result.current.copied).toBe(true);
		});

		it("should handle special characters in non-address text", async () => {
			const specialText = "!@#$%^&*()_+-=[]{}|;:',.<>?/";
			const { result } = renderHook(() => useCopyToClipboard());

			await act(async () => {
				await result.current.copy(specialText);
			});

			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(specialText);
			expect(result.current.copied).toBe(true);
		});
	});
});
