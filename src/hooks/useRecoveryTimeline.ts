import { useCallback, useMemo, useState } from "react";
import type {
	RecoveryEventStatus,
	RecoveryTimeline,
	RecoveryTimelineEvent,
} from "@/types/recovery";

/**
 * Hook for managing recovery timeline state and operations
 *
 * Features:
 * - Manages recovery timeline data
 * - Filters events by status
 * - Calculates timeline statistics
 * - Handles event selection
 * - Validates timeline data
 *
 * @param initialTimeline - Initial recovery timeline data
 * @returns Object containing timeline state and utility functions
 *
 * @example
 * const { timeline, selectedEvent, selectEvent, getEventsByStatus } = useRecoveryTimeline(mockTimeline);
 */
export function useRecoveryTimeline(initialTimeline: RecoveryTimeline) {
	const [timeline, setTimeline] = useState<RecoveryTimeline>(initialTimeline);
	const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

	/**
	 * Validates timeline data and handles invalid states gracefully
	 */
	const validateTimeline = useCallback((tl: RecoveryTimeline): boolean => {
		if (!tl || !tl.id || !tl.walletId) {
			console.warn("Invalid timeline: missing required fields");
			return false;
		}

		if (!Array.isArray(tl.events) || tl.events.length === 0) {
			console.warn("Invalid timeline: no events");
			return false;
		}

		return true;
	}, []);

	/**
	 * Updates the timeline with new data
	 */
	const updateTimeline = useCallback(
		(newTimeline: RecoveryTimeline) => {
			if (validateTimeline(newTimeline)) {
				setTimeline(newTimeline);
			}
		},
		[validateTimeline],
	);

	/**
	 * Selects an event from the timeline
	 */
	const selectEvent = useCallback((eventId: string | null) => {
		setSelectedEventId(eventId);
	}, []);

	/**
	 * Gets the currently selected event
	 */
	const selectedEvent = useMemo(() => {
		if (!selectedEventId) return null;
		return timeline.events.find((e) => e.id === selectedEventId) || null;
	}, [selectedEventId, timeline.events]);

	/**
	 * Filters events by status
	 */
	const getEventsByStatus = useCallback(
		(status: RecoveryEventStatus) => {
			return timeline.events.filter((event) => event.status === status);
		},
		[timeline.events],
	);

	/**
	 * Gets all completed events
	 */
	const completedEvents = useMemo(
		() => getEventsByStatus("completed"),
		[getEventsByStatus],
	);

	/**
	 * Gets all in-progress events
	 */
	const inProgressEvents = useMemo(
		() => getEventsByStatus("in_progress"),
		[getEventsByStatus],
	);

	/**
	 * Gets all failed events
	 */
	const failedEvents = useMemo(
		() => getEventsByStatus("failed"),
		[getEventsByStatus],
	);

	/**
	 * Gets all pending events
	 */
	const pendingEvents = useMemo(
		() => getEventsByStatus("pending"),
		[getEventsByStatus],
	);

	/**
	 * Calculates timeline progress percentage
	 */
	const progressPercentage = useMemo(() => {
		const totalEvents = timeline.events.length;
		if (totalEvents === 0) return 0;

		const completedCount = completedEvents.length;
		return Math.round((completedCount / totalEvents) * 100);
	}, [timeline.events.length, completedEvents.length]);

	/**
	 * Checks if timeline is complete
	 */
	const isComplete = useMemo(() => {
		return timeline.status === "completed" && failedEvents.length === 0;
	}, [timeline.status, failedEvents.length]);

	/**
	 * Checks if timeline has errors
	 */
	const hasErrors = useMemo(() => {
		return failedEvents.length > 0 || timeline.status === "failed";
	}, [failedEvents.length, timeline.status]);

	/**
	 * Gets the first incomplete event
	 */
	const currentEvent = useMemo(() => {
		return inProgressEvents[0] || pendingEvents[0] || failedEvents[0] || null;
	}, [inProgressEvents, pendingEvents, failedEvents]);

	/**
	 * Calculates duration between two events
	 */
	const getEventDuration = useCallback(
		(fromIndex: number, toIndex: number): number | null => {
			if (
				fromIndex < 0 ||
				toIndex < 0 ||
				fromIndex >= timeline.events.length ||
				toIndex >= timeline.events.length
			) {
				return null;
			}

			const fromEvent = timeline.events[fromIndex];
			const toEvent = timeline.events[toIndex];

			if (!fromEvent || !toEvent) return null;

			return toEvent.timestamp.getTime() - fromEvent.timestamp.getTime();
		},
		[timeline.events],
	);

	/**
	 * Formats duration in human-readable format
	 */
	const formatDuration = useCallback((milliseconds: number): string => {
		const seconds = Math.floor(milliseconds / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		if (hours > 0) {
			return `${hours}h ${minutes % 60}m`;
		}
		if (minutes > 0) {
			return `${minutes}m ${seconds % 60}s`;
		}
		return `${seconds}s`;
	}, []);

	return {
		timeline,
		updateTimeline,
		selectedEvent,
		selectEvent,
		getEventsByStatus,
		completedEvents,
		inProgressEvents,
		failedEvents,
		pendingEvents,
		progressPercentage,
		isComplete,
		hasErrors,
		currentEvent,
		getEventDuration,
		formatDuration,
		validateTimeline,
	};
}
