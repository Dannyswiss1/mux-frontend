import { mockRecoveryTimelineCompleted } from "@/mock-data/recovery";
import {
	fetchRecoveryEvents,
	fetchRecoveryStatus,
	pollRecoveryStatus,
	type RecoveryStatusResponse,
} from "../recoveryApi";

// Mock fetch
global.fetch = jest.fn();

describe("Recovery API Service", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	describe("fetchRecoveryStatus", () => {
		it("should fetch recovery status successfully", async () => {
			const mockResponse = {
				...mockRecoveryTimelineCompleted,
				startedAt: mockRecoveryTimelineCompleted.startedAt.toISOString(),
				completedAt: mockRecoveryTimelineCompleted.completedAt?.toISOString(),
				events: mockRecoveryTimelineCompleted.events.map((e) => ({
					...e,
					timestamp: e.timestamp.toISOString(),
				})),
			};

			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			});

			const result = await fetchRecoveryStatus("wallet-123");

			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
			expect(result.data?.id).toBe(mockRecoveryTimelineCompleted.id);
		});

		it("should return error for invalid wallet ID", async () => {
			const result = await fetchRecoveryStatus("");

			expect(result.success).toBe(false);
			expect(result.error).toBeDefined();
		});

		it("should handle network errors with retry", async () => {
			(global.fetch as jest.Mock).mockRejectedValueOnce(
				new Error("Network error"),
			);
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					...mockRecoveryTimelineCompleted,
					startedAt: mockRecoveryTimelineCompleted.startedAt.toISOString(),
					events: mockRecoveryTimelineCompleted.events.map((e) => ({
						...e,
						timestamp: e.timestamp.toISOString(),
					})),
				}),
			});

			const result = await fetchRecoveryStatus("wallet-123", {
				retryAttempts: 2,
				retryDelay: 100,
			});

			expect(result.success).toBe(true);
			expect(global.fetch).toHaveBeenCalledTimes(2);
		});

		it("should handle HTTP errors", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: false,
				status: 404,
				json: async () => ({ message: "Not found" }),
			});

			const result = await fetchRecoveryStatus("wallet-123");

			expect(result.success).toBe(false);
			expect(result.error).toContain("404");
		});

		it("should handle timeout errors", async () => {
			(global.fetch as jest.Mock).mockRejectedValueOnce(new Error("timeout"));
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					...mockRecoveryTimelineCompleted,
					startedAt: mockRecoveryTimelineCompleted.startedAt.toISOString(),
					events: mockRecoveryTimelineCompleted.events.map((e) => ({
						...e,
						timestamp: e.timestamp.toISOString(),
					})),
				}),
			});

			const result = await fetchRecoveryStatus("wallet-123", {
				retryAttempts: 2,
				retryDelay: 100,
			});

			expect(result.success).toBe(true);
		});

		it("should validate response data", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ invalid: "data" }),
			});

			const result = await fetchRecoveryStatus("wallet-123");

			expect(result.success).toBe(false);
			expect(result.error).toContain("Invalid");
		});

		it("should parse date strings correctly", async () => {
			const mockResponse = {
				...mockRecoveryTimelineCompleted,
				startedAt: "2025-01-20T10:00:00Z",
				completedAt: "2025-01-20T10:35:00Z",
				events: mockRecoveryTimelineCompleted.events.map((e) => ({
					...e,
					timestamp: e.timestamp.toISOString(),
				})),
			};

			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			});

			const result = await fetchRecoveryStatus("wallet-123");

			expect(result.success).toBe(true);
			expect(result.data?.startedAt).toBeInstanceOf(Date);
			expect(result.data?.completedAt).toBeInstanceOf(Date);
		});

		it("should include timestamp in response", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					...mockRecoveryTimelineCompleted,
					startedAt: mockRecoveryTimelineCompleted.startedAt.toISOString(),
					events: mockRecoveryTimelineCompleted.events.map((e) => ({
						...e,
						timestamp: e.timestamp.toISOString(),
					})),
				}),
			});

			const result = await fetchRecoveryStatus("wallet-123");

			expect(result.timestamp).toBeDefined();
			expect(typeof result.timestamp).toBe("number");
		});
	});

	describe("fetchRecoveryEvents", () => {
		it("should fetch recovery events successfully", async () => {
			const mockEvents = mockRecoveryTimelineCompleted.events.map((e) => ({
				...e,
				timestamp: e.timestamp.toISOString(),
			}));

			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => mockEvents,
			});

			const result = await fetchRecoveryEvents("recovery-123");

			expect(result.success).toBe(true);
			expect(result.data).toHaveLength(mockEvents.length);
		});

		it("should return error for invalid recovery ID", async () => {
			const result = await fetchRecoveryEvents("");

			expect(result.success).toBe(false);
			expect(result.error).toBeDefined();
		});

		it("should handle HTTP errors", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: false,
				status: 500,
				json: async () => ({ message: "Server error" }),
			});

			const result = await fetchRecoveryEvents("recovery-123");

			expect(result.success).toBe(false);
			expect(result.error).toBeDefined();
		});

		it("should validate events array", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ invalid: "data" }),
			});

			const result = await fetchRecoveryEvents("recovery-123");

			expect(result.success).toBe(false);
			expect(result.error).toContain("Invalid");
		});

		it("should parse event timestamps", async () => {
			const mockEvents = [
				{
					id: "event-1",
					type: "initiated",
					status: "completed",
					title: "Test",
					description: "Test",
					timestamp: "2025-01-20T10:00:00Z",
				},
			];

			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => mockEvents,
			});

			const result = await fetchRecoveryEvents("recovery-123");

			expect(result.success).toBe(true);
			expect(result.data?.[0].timestamp).toBeInstanceOf(Date);
		});
	});

	describe("pollRecoveryStatus", () => {
		it("should poll recovery status at intervals", async () => {
			const mockResponse = {
				...mockRecoveryTimelineCompleted,
				startedAt: mockRecoveryTimelineCompleted.startedAt.toISOString(),
				events: mockRecoveryTimelineCompleted.events.map((e) => ({
					...e,
					timestamp: e.timestamp.toISOString(),
				})),
			};

			(global.fetch as jest.Mock).mockResolvedValue({
				ok: true,
				json: async () => mockResponse,
			});

			const onUpdate = jest.fn();
			const stop = pollRecoveryStatus("wallet-123", 1000, 5000, onUpdate);

			// Initial call
			expect(onUpdate).toHaveBeenCalledTimes(1);

			// Advance time
			jest.advanceTimersByTime(1000);
			expect(onUpdate).toHaveBeenCalledTimes(2);

			// Stop polling
			stop();
			jest.advanceTimersByTime(1000);
			expect(onUpdate).toHaveBeenCalledTimes(2); // No additional calls
		});

		it("should stop polling when recovery is completed", async () => {
			const completedResponse = {
				...mockRecoveryTimelineCompleted,
				status: "completed",
				startedAt: mockRecoveryTimelineCompleted.startedAt.toISOString(),
				events: mockRecoveryTimelineCompleted.events.map((e) => ({
					...e,
					timestamp: e.timestamp.toISOString(),
				})),
			};

			(global.fetch as jest.Mock).mockResolvedValue({
				ok: true,
				json: async () => completedResponse,
			});

			const onUpdate = jest.fn();
			pollRecoveryStatus("wallet-123", 1000, 5000, onUpdate);

			expect(onUpdate).toHaveBeenCalledTimes(1);

			jest.advanceTimersByTime(1000);
			// Should not poll again since status is completed
			expect(onUpdate).toHaveBeenCalledTimes(1);
		});

		it("should stop polling when recovery fails", async () => {
			const failedResponse = {
				...mockRecoveryTimelineCompleted,
				status: "failed",
				startedAt: mockRecoveryTimelineCompleted.startedAt.toISOString(),
				events: mockRecoveryTimelineCompleted.events.map((e) => ({
					...e,
					timestamp: e.timestamp.toISOString(),
				})),
			};

			(global.fetch as jest.Mock).mockResolvedValue({
				ok: true,
				json: async () => failedResponse,
			});

			const onUpdate = jest.fn();
			pollRecoveryStatus("wallet-123", 1000, 5000, onUpdate);

			expect(onUpdate).toHaveBeenCalledTimes(1);

			jest.advanceTimersByTime(1000);
			// Should not poll again since status is failed
			expect(onUpdate).toHaveBeenCalledTimes(1);
		});

		it("should respect max polling duration", async () => {
			const inProgressResponse = {
				...mockRecoveryTimelineCompleted,
				status: "in_progress",
				startedAt: mockRecoveryTimelineCompleted.startedAt.toISOString(),
				events: mockRecoveryTimelineCompleted.events.map((e) => ({
					...e,
					timestamp: e.timestamp.toISOString(),
				})),
			};

			(global.fetch as jest.Mock).mockResolvedValue({
				ok: true,
				json: async () => inProgressResponse,
			});

			const onUpdate = jest.fn();
			pollRecoveryStatus("wallet-123", 1000, 3000, onUpdate);

			// Initial call
			expect(onUpdate).toHaveBeenCalledTimes(1);

			// Advance to 1 second
			jest.advanceTimersByTime(1000);
			expect(onUpdate).toHaveBeenCalledTimes(2);

			// Advance to 2 seconds
			jest.advanceTimersByTime(1000);
			expect(onUpdate).toHaveBeenCalledTimes(3);

			// Advance to 3 seconds (max duration reached)
			jest.advanceTimersByTime(1000);
			expect(onUpdate).toHaveBeenCalledTimes(3); // No additional calls
		});

		it("should handle polling errors", async () => {
			(global.fetch as jest.Mock).mockResolvedValue({
				ok: false,
				status: 500,
				json: async () => ({ message: "Server error" }),
			});

			const onUpdate = jest.fn();
			pollRecoveryStatus("wallet-123", 1000, 5000, onUpdate);

			expect(onUpdate).toHaveBeenCalledTimes(1);
			expect(onUpdate).toHaveBeenCalledWith(
				expect.objectContaining({
					success: false,
				}),
			);
		});
	});

	describe("Error handling", () => {
		it("should handle fetch errors gracefully", async () => {
			(global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

			const result = await fetchRecoveryStatus("wallet-123", {
				retryAttempts: 1,
			});

			expect(result.success).toBe(false);
			expect(result.error).toBeDefined();
		});

		it("should handle malformed JSON responses", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => {
					throw new Error("Invalid JSON");
				},
			});

			const result = await fetchRecoveryStatus("wallet-123");

			expect(result.success).toBe(false);
		});

		it("should handle missing required fields", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					id: "recovery-123",
					// Missing required fields
				}),
			});

			const result = await fetchRecoveryStatus("wallet-123");

			expect(result.success).toBe(false);
			expect(result.error).toContain("Invalid");
		});
	});

	describe("Configuration", () => {
		it("should use custom base URL", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					...mockRecoveryTimelineCompleted,
					startedAt: mockRecoveryTimelineCompleted.startedAt.toISOString(),
					events: mockRecoveryTimelineCompleted.events.map((e) => ({
						...e,
						timestamp: e.timestamp.toISOString(),
					})),
				}),
			});

			await fetchRecoveryStatus("wallet-123", {
				baseUrl: "https://api.example.com",
			});

			expect(global.fetch).toHaveBeenCalledWith(
				expect.stringContaining("https://api.example.com"),
				expect.any(Object),
			);
		});

		it("should use custom timeout", async () => {
			(global.fetch as jest.Mock).mockImplementationOnce(
				() =>
					new Promise((resolve) => {
						setTimeout(
							() =>
								resolve({
									ok: true,
									json: async () => ({
										...mockRecoveryTimelineCompleted,
										startedAt:
											mockRecoveryTimelineCompleted.startedAt.toISOString(),
										events: mockRecoveryTimelineCompleted.events.map((e) => ({
											...e,
											timestamp: e.timestamp.toISOString(),
										})),
									}),
								}),
							100,
						);
					}),
			);

			const result = await fetchRecoveryStatus("wallet-123", {
				timeout: 200,
			});

			expect(result.success).toBe(true);
		});

		it("should use custom retry attempts", async () => {
			(global.fetch as jest.Mock)
				.mockRejectedValueOnce(new Error("Error 1"))
				.mockRejectedValueOnce(new Error("Error 2"))
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({
						...mockRecoveryTimelineCompleted,
						startedAt: mockRecoveryTimelineCompleted.startedAt.toISOString(),
						events: mockRecoveryTimelineCompleted.events.map((e) => ({
							...e,
							timestamp: e.timestamp.toISOString(),
						})),
					}),
				});

			const result = await fetchRecoveryStatus("wallet-123", {
				retryAttempts: 3,
				retryDelay: 100,
			});

			expect(result.success).toBe(true);
			expect(global.fetch).toHaveBeenCalledTimes(3);
		});
	});
});
