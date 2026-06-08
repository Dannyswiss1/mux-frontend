# Recovery User Flow Guide

## Overview

The Mux Protocol Recovery system provides an automated wallet recovery mechanism that ensures wallet accessibility even when users lose access to their devices or accounts. This document outlines the complete user flow through the recovery interface.

## User Flow States

### 1. Initial Load (Loading State)

When the recovery page first loads, it displays a **loading skeleton** while the system fetches the current recovery status from the backend.

- **UI:** `RecoveryLoadingState` component with skeleton placeholders
- **Duration:** ~1.2 seconds (simulated)
- **Fallback:** If the API call fails, the page transitions to an error state

### 2. Idle State

Once the initial status is loaded, the user sees the recovery dashboard showing:

- **Recovery System Status badge** indicating the current system health (`active`, `monitoring`, `ready`, `error`, `disconnected`, or `unknown`)
- **Invisible Wallet Recovery explanation** — an educational section explaining how recovery works
- **Initiate Recovery CTA** — a call-to-action card allowing the user to manually trigger recovery
- **FAQ section** — answers to common questions about the recovery process

### 3. Initiating Recovery

When the user clicks the **"Initiate recovery"** button:

1. **Pre-confirmation check:** The system prevents accidental triggers by only allowing the action from `idle` or `error` states
2. **Confirmation dialog:** A confirmation dialog appears asking the user to confirm their intent

### 4. Confirmation State

The user sees a confirmation card with:

- A warning about the implications of recovery initiation
- Security reassurance that private keys will never be exposed
- Two options:
  - **"Yes, initiate recovery"** — confirms and proceeds with recovery
  - **"Cancel"** — returns to the idle state

### 5. Pending State

After confirmation:

- The system submits the recovery request to the backend (simulated with a 1.5-second delay)
- A loading spinner with "Submitting recovery request…" text is displayed
- The button is disabled to prevent duplicate submissions

### 6. Success State

When recovery is successfully initiated:

- A green success banner is displayed with confirmation text
- The user is informed that recovery may take up to 24 hours
- A **"Dismiss"** button allows the user to clear the message and return to idle

### 7. Error State

If recovery fails (either during status fetch or initiation):

- An error card is displayed with the error message
- A **"Retry"** button allows the user to attempt recovery again
- The error state still shows the recovery system status and explanation sections

## Error Handling

The system gracefully handles the following error scenarios:

| Scenario | Behavior |
|---|---|
| **API URL not configured** | Error message: "API URL is not configured." |
| **Failed to load recovery status** | Error message: "Failed to load recovery status." |
| **Recovery initiation failure** | Displays the specific error message from the backend |
| **Unexpected error** | Fallback message: "An unexpected error occurred." |

## State Machine

```
loading → idle → confirming → pending → success
                  ↑    ↓                        ↓
                  └────┘ (cancel)          (dismiss → idle)
```

- From `error` state, user can retry (returns to `confirming`)
- From `success` state, user can dismiss (returns to `idle`)

## Component Architecture

```
RecoveryPage
├── Header (title, description, back link)
├── RecoveryLoadingState (shown during loading)
├── Error State (shown during error)
└── Content (shown when idle/success/confirming/pending)
    ├── InitiateRecoveryCTA
    │   ├── Idle view (primary CTA button)
    │   ├── Confirming view (confirmation dialog)
    │   ├── Pending view (loading spinner)
    │   ├── Success view (success banner)
    │   └── Error view (error message with retry)
    ├── RecoveryExplanation
    │   ├── System Status section
    │   ├── How It Works steps
    │   ├── When Recovery Occurs list
    │   ├── Important Information warning
    │   └── Security & Transparency grid
    └── RecoveryFAQ
        └── Accordion list of Q&A items
```

## Key Design Decisions

1. **Automatic recovery:** The system works in the background without requiring user action for most cases.
2. **Manual trigger available:** Users can manually initiate recovery if they believe immediate attention is needed.
3. **Confirmation step:** Prevents accidental recovery initiation.
4. **Graceful degradation:** All states (loading, error, success) have appropriate UI representations.
5. **Security-first messaging:** The UI reinforces that private keys are never exposed.

## See Also

- [Recovery API Documentation](./RECOVERY_API_DOCUMENTATION.md)
- [Recovery Timeline Documentation](./RECOVERY_TIMELINE_DOCUMENTATION.md)
- [Recovery API Implementation](./RECOVERY_API_IMPLEMENTATION.md)
