import type { RecoveryTimeline, RecoveryTimelineEvent } from "@/types/recovery";

/**
 * Mock recovery timeline events for demonstration
 */
export const mockRecoveryEvents: RecoveryTimelineEvent[] = [
	{
		id: "event-001",
		type: "initiated",
		status: "completed",
		title: "Recovery Initiated",
		description: "Wallet recovery process started",
		timestamp: new Date("2025-01-20T10:00:00Z"),
		details: "User initiated recovery from device loss",
	},
	{
		id: "event-002",
		type: "detection",
		status: "completed",
		title: "Issue Detection",
		description: "System detected wallet access issue",
		timestamp: new Date("2025-01-20T10:05:00Z"),
		details: "Detected unauthorized access attempt on wallet",
	},
	{
		id: "event-003",
		type: "verification",
		status: "completed",
		title: "Identity Verification",
		description: "User identity verified successfully",
		timestamp: new Date("2025-01-20T10:15:00Z"),
		details: "Multi-factor authentication completed",
	},
	{
		id: "event-004",
		type: "processing",
		status: "completed",
		title: "Recovery Processing",
		description: "Wallet recovery in progress",
		timestamp: new Date("2025-01-20T10:25:00Z"),
		details: "Restoring wallet keys and data",
	},
	{
		id: "event-005",
		type: "completion",
		status: "completed",
		title: "Recovery Completed",
		description: "Wallet successfully recovered",
		timestamp: new Date("2025-01-20T10:35:00Z"),
		details: "Wallet is now fully accessible and operational",
	},
];

/**
 * Mock recovery timeline with in-progress status
 */
export const mockRecoveryTimelineInProgress: RecoveryTimeline = {
	id: "recovery-001",
	walletId: "wallet-001",
	startedAt: new Date("2025-01-20T10:00:00Z"),
	status: "in_progress",
	events: [
		{
			id: "event-001",
			type: "initiated",
			status: "completed",
			title: "Recovery Initiated",
			description: "Wallet recovery process started",
			timestamp: new Date("2025-01-20T10:00:00Z"),
			details: "User initiated recovery from device loss",
		},
		{
			id: "event-002",
			type: "detection",
			status: "completed",
			title: "Issue Detection",
			description: "System detected wallet access issue",
			timestamp: new Date("2025-01-20T10:05:00Z"),
			details: "Detected unauthorized access attempt on wallet",
		},
		{
			id: "event-003",
			type: "verification",
			status: "in_progress",
			title: "Identity Verification",
			description: "Verifying user identity",
			timestamp: new Date("2025-01-20T10:15:00Z"),
			details: "Multi-factor authentication in progress",
		},
	],
};

/**
 * Mock recovery timeline with completed status
 */
export const mockRecoveryTimelineCompleted: RecoveryTimeline = {
	id: "recovery-002",
	walletId: "wallet-002",
	startedAt: new Date("2025-01-19T14:00:00Z"),
	completedAt: new Date("2025-01-19T14:35:00Z"),
	status: "completed",
	totalDuration: 35 * 60 * 1000, // 35 minutes in milliseconds
	events: mockRecoveryEvents,
};

/**
 * Mock recovery timeline with failed status
 */
export const mockRecoveryTimelineFailed: RecoveryTimeline = {
	id: "recovery-003",
	walletId: "wallet-003",
	startedAt: new Date("2025-01-18T09:00:00Z"),
	status: "failed",
	events: [
		{
			id: "event-001",
			type: "initiated",
			status: "completed",
			title: "Recovery Initiated",
			description: "Wallet recovery process started",
			timestamp: new Date("2025-01-18T09:00:00Z"),
		},
		{
			id: "event-002",
			type: "detection",
			status: "completed",
			title: "Issue Detection",
			description: "System detected wallet access issue",
			timestamp: new Date("2025-01-18T09:05:00Z"),
		},
		{
			id: "event-003",
			type: "verification",
			status: "failed",
			title: "Identity Verification Failed",
			description: "Unable to verify user identity",
			timestamp: new Date("2025-01-18T09:15:00Z"),
			errorMessage: "Maximum verification attempts exceeded",
		},
	],
};

/**
 * Mock recovery timeline with pending status
 */
export const mockRecoveryTimelinePending: RecoveryTimeline = {
	id: "recovery-004",
	walletId: "wallet-004",
	startedAt: new Date("2025-01-21T08:00:00Z"),
	status: "pending",
	events: [
		{
			id: "event-001",
			type: "initiated",
			status: "pending",
			title: "Recovery Initiated",
			description: "Wallet recovery process queued",
			timestamp: new Date("2025-01-21T08:00:00Z"),
		},
	],
};

/**
 * Collection of all mock recovery timelines
 */
export const mockRecoveryTimelines: RecoveryTimeline[] = [
	mockRecoveryTimelineCompleted,
	mockRecoveryTimelineInProgress,
	mockRecoveryTimelineFailed,
	mockRecoveryTimelinePending,
];
