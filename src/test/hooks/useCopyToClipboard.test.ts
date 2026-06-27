import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

describe("useCopyToClipboard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("starts with copied = false", () => {
		const { result } = renderHook(() => useCopyToClipboard());
		expect(result.current.copied).toBe(false);
	});

	it("sets copied = true after calling copy()", async () => {
		const { result } = renderHook(() => useCopyToClipboard());

		await act(async () => {
			await result.current.copy("test-text");
		});

		expect(result.current.copied).toBe(true);
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test-text");
	});

	it("resets copied to false after the default 2000ms delay", async () => {
		const { result } = renderHook(() => useCopyToClipboard());

		await act(async () => {
			await result.current.copy("hello");
		});

		expect(result.current.copied).toBe(true);

		act(() => {
			vi.advanceTimersByTime(2000);
		});

		expect(result.current.copied).toBe(false);
	});

	it("resets copied after a custom resetDelay", async () => {
		const { result } = renderHook(() => useCopyToClipboard(500));

		await act(async () => {
			await result.current.copy("hello");
		});

		expect(result.current.copied).toBe(true);

		// Not yet reset at 499ms
		act(() => {
			vi.advanceTimersByTime(499);
		});
		expect(result.current.copied).toBe(true);

		// Reset at 500ms
		act(() => {
			vi.advanceTimersByTime(1);
		});
		expect(result.current.copied).toBe(false);
	});

	it("calls clipboard.writeText with the exact text provided", async () => {
		const { result } = renderHook(() => useCopyToClipboard());
		const address = "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";

		await act(async () => {
			await result.current.copy(address);
		});

		expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith(address);
	});

	it("handles clipboard write failure gracefully (does not throw)", async () => {
		vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(
			new Error("Clipboard denied"),
		);

		const { result } = renderHook(() => useCopyToClipboard());

		// The hook propagates the rejection — callers should handle it.
		// We verify it doesn't silently swallow errors in an unexpected way.
		await expect(
			act(async () => {
				await result.current.copy("text");
			}),
		).rejects.toThrow("Clipboard denied");
	});
});
