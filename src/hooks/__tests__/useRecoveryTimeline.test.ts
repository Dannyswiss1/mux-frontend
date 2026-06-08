import { act, renderHook } from "@testing-library/react";
import {
	mockRecoveryTimelineCompleted,
	mockRecoveryTimelineFailed,
	mockRecoveryTimelineInProgress,
} from "@/mock-data/recovery";
import { useRecoveryTimeline } from "../useRecoveryTimeline";

describe("useRecoveryTimeline", () => {
	describe("Initial state", () => {
		it("should initialize with provided timeline", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			expect(result.current.timeline).toEqual(mockRecoveryTimelineCompleted);
		});

		it("should initialize with no selected event", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			expect(result.current.selectedEvent).toBeNull();
		});

		it("should provide all required functions", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			expect(typeof result.current.updateTimeline).toBe("function");
			expect(typeof result.current.selectEvent).toBe("function");
			expect(typeof result.current.getEventsByStatus).toBe("function");
			expect(typeof result.current.formatDuration).toBe("function");
		});
	});

	describe("Event selection", () => {
		it("should select an event by id", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			act(() => {
				result.current.selectEvent("event-001");
			});

			expect(result.current.selectedEvent?.id).toBe("event-001");
		});

		it("should deselect event when null is passed", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			act(() => {
				result.current.selectEvent("event-001");
			});

			expect(result.current.selectedEvent).not.toBeNull();

			act(() => {
				result.current.selectEvent(null);
			});

			expect(result.current.selectedEvent).toBeNull();
		});

		it("should return null for non-existent event id", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			act(() => {
				result.current.selectEvent("non-existent-id");
			});

			expect(result.current.selectedEvent).toBeNull();
		});
	});

	describe("Event filtering", () => {
		it("should filter events by completed status", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			const completed = result.current.getEventsByStatus("completed");

			expect(completed.length).toBeGreaterThan(0);
			expect(completed.every((e) => e.status === "completed")).toBe(true);
		});

		it("should filter events by in_progress status", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineInProgress),
			);

			const inProgress = result.current.getEventsByStatus("in_progress");

			expect(inProgress.length).toBeGreaterThan(0);
			expect(inProgress.every((e) => e.status === "in_progress")).toBe(true);
		});

		it("should filter events by failed status", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineFailed),
			);

			const failed = result.current.getEventsByStatus("failed");

			expect(failed.length).toBeGreaterThan(0);
			expect(failed.every((e) => e.status === "failed")).toBe(true);
		});

		it("should return empty array for status with no events", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			const pending = result.current.getEventsByStatus("pending");

			expect(pending).toEqual([]);
		});
	});

	describe("Computed properties", () => {
		it("should calculate correct progress percentage", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			expect(result.current.progressPercentage).toBe(100);
		});

		it("should calculate progress for in-progress timeline", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineInProgress),
			);

			const percentage = result.current.progressPercentage;
			expect(percentage).toBeGreaterThan(0);
			expect(percentage).toBeLessThan(100);
		});

		it("should identify complete timeline", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			expect(result.current.isComplete).toBe(true);
		});

		it("should identify incomplete timeline", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineInProgress),
			);

			expect(result.current.isComplete).toBe(false);
		});

		it("should detect errors in timeline", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineFailed),
			);

			expect(result.current.hasErrors).toBe(true);
		});

		it("should not detect errors in successful timeline", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			expect(result.current.hasErrors).toBe(false);
		});

		it("should identify current event", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineInProgress),
			);

			expect(result.current.currentEvent).not.toBeNull();
			expect(result.current.currentEvent?.status).toBe("in_progress");
		});
	});

	describe("Duration calculations", () => {
		it("should calculate duration between two events", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			const duration = result.current.getEventDuration(0, 1);

			expect(duration).not.toBeNull();
			expect(duration).toBeGreaterThan(0);
		});

		it("should return null for invalid indices", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			expect(result.current.getEventDuration(-1, 1)).toBeNull();
			expect(result.current.getEventDuration(0, 100)).toBeNull();
		});

		it("should format duration correctly", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			expect(result.current.formatDuration(1000)).toBe("1s");
			expect(result.current.formatDuration(60000)).toBe("1m 0s");
			expect(result.current.formatDuration(3600000)).toBe("1h 0m");
		});

		it("should format complex durations", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			expect(result.current.formatDuration(125000)).toBe("2m 5s");
			expect(result.current.formatDuration(3725000)).toBe("1h 2m");
		});
	});

	describe("Timeline updates", () => {
		it("should update timeline with valid data", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			act(() => {
				result.current.updateTimeline(mockRecoveryTimelineInProgress);
			});

			expect(result.current.timeline).toEqual(mockRecoveryTimelineInProgress);
		});

		it("should not update timeline with invalid data", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			const originalTimeline = result.current.timeline;

			act(() => {
				// @ts-ignore - Testing invalid input
				result.current.updateTimeline(null);
			});

			expect(result.current.timeline).toEqual(originalTimeline);
		});

		it("should validate timeline before updating", () => {
			const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			act(() => {
				// @ts-ignore - Testing invalid input
				result.current.updateTimeline({ id: "test" });
			});

			expect(consoleSpy).toHaveBeenCalled();

			consoleSpy.mockRestore();
		});
	});

	describe("Event grouping", () => {
		it("should group completed events", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			expect(result.current.completedEvents.length).toBeGreaterThan(0);
		});

		it("should group in-progress events", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineInProgress),
			);

			expect(result.current.inProgressEvents.length).toBeGreaterThan(0);
		});

		it("should group failed events", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineFailed),
			);

			expect(result.current.failedEvents.length).toBeGreaterThan(0);
		});

		it("should group pending events", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineInProgress),
			);

			expect(result.current.pendingEvents.length).toBeGreaterThanOrEqual(0);
		});
	});

	describe("Edge cases", () => {
		it("should handle timeline with single event", () => {
			const singleEventTimeline = {
				...mockRecoveryTimelineCompleted,
				events: [mockRecoveryTimelineCompleted.events[0]],
			};

			const { result } = renderHook(() =>
				useRecoveryTimeline(singleEventTimeline),
			);

			expect(result.current.progressPercentage).toBe(100);
		});

		it("should handle rapid event selections", () => {
			const { result } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			act(() => {
				result.current.selectEvent("event-001");
				result.current.selectEvent("event-002");
				result.current.selectEvent("event-003");
				result.current.selectEvent(null);
			});

			expect(result.current.selectedEvent).toBeNull();
		});

		it("should maintain state across re-renders", () => {
			const { result, rerender } = renderHook(() =>
				useRecoveryTimeline(mockRecoveryTimelineCompleted),
			);

			act(() => {
				result.current.selectEvent("event-001");
			});

			rerender();

			expect(result.current.selectedEvent?.id).toBe("event-001");
		});
	});
});
