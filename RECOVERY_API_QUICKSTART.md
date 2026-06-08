# Recovery API Integration - Quick Start Guide

## 5-Minute Setup

### 1. Set Environment Variable

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
```

### 2. Import Hook

```typescript
import { useRecoveryStatus } from "@/hooks/useRecoveryStatus";
```

### 3. Use in Component

```typescript
export function RecoveryPage() {
  const { timeline, loading, error } = useRecoveryStatus("wallet-123");

  if (loading === "loading") return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!timeline) return <div>No data</div>;

  return <RecoveryTimelineList events={timeline.events} />;
}
```

## Common Tasks

### Fetch Recovery Status

```typescript
const { timeline } = useRecoveryStatus("wallet-123");
```

### Handle Errors

```typescript
const { error, clearError } = useRecoveryStatus("wallet-123");

if (error) {
  return (
    <div>
      <p>{error}</p>
      <button onClick={clearError}>Dismiss</button>
    </div>
  );
}
```

### Manual Refetch

```typescript
const { refetch } = useRecoveryStatus("wallet-123");

<button onClick={refetch}>Refresh</button>
```

### Disable Auto-Fetch

```typescript
const { timeline, refetch } = useRecoveryStatus("wallet-123", {
  autoFetch: false,
});

// Fetch manually
<button onClick={refetch}>Fetch Status</button>
```

### Handle Status Changes

```typescript
const { timeline } = useRecoveryStatus("wallet-123", {
  onStatusChange: (timeline) => {
    console.log("Status:", timeline.status);
    if (timeline.status === "completed") {
      showSuccess("Recovery complete!");
    }
  },
});
```

### Custom Polling

```typescript
const { startPolling, stopPolling } = useRecoveryStatus("wallet-123", {
  pollInterval: 10000, // 10 seconds
  maxPollDuration: 600000, // 10 minutes
});

<button onClick={startPolling}>Start Polling</button>
<button onClick={stopPolling}>Stop Polling</button>
```

### Check Stale Data

```typescript
const { isStale, refetch } = useRecoveryStatus("wallet-123");

if (isStale) {
  return <button onClick={refetch}>Data is stale - Refresh</button>;
}
```

## API Service Usage

### Direct API Calls

```typescript
import { fetchRecoveryStatus } from "@/services/recoveryApi";

const result = await fetchRecoveryStatus("wallet-123");

if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### Polling

```typescript
import { pollRecoveryStatus } from "@/services/recoveryApi";

const stop = pollRecoveryStatus(
  "wallet-123",
  5000, // interval
  300000, // max duration
  (response) => {
    if (response.success) {
      console.log(response.data?.status);
    }
  }
);

// Stop later
stop();
```

### Custom Configuration

```typescript
const result = await fetchRecoveryStatus("wallet-123", {
  baseUrl: "https://custom-api.com",
  timeout: 15000,
  retryAttempts: 5,
  retryDelay: 2000,
});
```

## Hook API Reference

### State

```typescript
const {
  timeline,           // RecoveryTimeline | null
  loading,            // "idle" | "loading" | "success" | "error"
  error,              // string | null
  isStale,            // boolean
  lastFetchTime,      // number | null
} = useRecoveryStatus("wallet-123");
```

### Methods

```typescript
const {
  refetch,            // () => Promise<void>
  startPolling,       // () => void
  stopPolling,        // () => void
  markAsStale,        // () => void
  clearError,         // () => void
} = useRecoveryStatus("wallet-123");
```

### Computed

```typescript
const {
  isLoading,          // boolean
  isError,            // boolean
  isSuccess,          // boolean
  isIdle,             // boolean
} = useRecoveryStatus("wallet-123");
```

## Options

```typescript
useRecoveryStatus("wallet-123", {
  autoFetch: true,                    // Auto-fetch on mount
  pollInterval: 5000,                 // Polling interval (ms)
  maxPollDuration: 300000,            // Max polling duration (ms)
  onStatusChange: (timeline) => {},   // Status change callback
  onError: (error) => {},             // Error callback
});
```

## Loading States

```typescript
const { loading } = useRecoveryStatus("wallet-123");

switch (loading) {
  case "idle":
    return <div>Not started</div>;
  case "loading":
    return <div>Loading...</div>;
  case "success":
    return <div>Success</div>;
  case "error":
    return <div>Error</div>;
}
```

## Error Handling

```typescript
const { error, isError, clearError } = useRecoveryStatus("wallet-123");

if (isError) {
  return (
    <div className="error">
      <p>{error}</p>
      <button onClick={clearError}>Dismiss</button>
    </div>
  );
}
```

## Running Tests

```bash
# API service tests
pnpm test recoveryApi

# Hook tests
pnpm test useRecoveryStatus

# All recovery tests
pnpm test recovery

# With coverage
pnpm test:coverage
```

## Test Statistics

- **API Service Tests:** 40+ tests
- **Hook Tests:** 50+ tests
- **Total:** 90+ tests

## Environment Variables

```bash
# Required
NEXT_PUBLIC_API_URL=https://api.example.com

# Optional
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_RETRY_ATTEMPTS=3
NEXT_PUBLIC_API_RETRY_DELAY=1000
```

## Common Patterns

### Complete Recovery Page

```typescript
import { useRecoveryStatus } from "@/hooks/useRecoveryStatus";
import { RecoveryTimelineList } from "@/components/recovery/RecoveryTimelineList";

export function RecoveryPage() {
  const {
    timeline,
    loading,
    error,
    isStale,
    refetch,
    clearError,
  } = useRecoveryStatus("wallet-123", {
    onStatusChange: (timeline) => {
      if (timeline.status === "completed") {
        showSuccess("Recovery complete!");
      }
    },
    onError: (error) => {
      showError(error);
    },
  });

  if (loading === "loading") {
    return <div className="spinner">Loading recovery status...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={clearError}>Dismiss</button>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  if (!timeline) {
    return <div>No recovery data available</div>;
  }

  return (
    <div className="space-y-4">
      {isStale && (
        <div className="warning">
          <p>Data is stale</p>
          <button onClick={refetch}>Refresh</button>
        </div>
      )}

      <RecoveryTimelineList events={timeline.events} />
    </div>
  );
}
```

### With Manual Polling

```typescript
export function RecoveryWithPolling() {
  const {
    timeline,
    loading,
    startPolling,
    stopPolling,
  } = useRecoveryStatus("wallet-123", {
    autoFetch: true,
    pollInterval: 10000,
  });

  return (
    <div>
      <div className="controls">
        <button onClick={startPolling}>Start Polling</button>
        <button onClick={stopPolling}>Stop Polling</button>
      </div>

      {loading === "loading" && <div>Loading...</div>}
      {timeline && <RecoveryTimelineList events={timeline.events} />}
    </div>
  );
}
```

### With Error Retry

```typescript
export function RecoveryWithRetry() {
  const { timeline, error, refetch, isError } = useRecoveryStatus(
    "wallet-123"
  );

  const handleRetry = async () => {
    await refetch();
  };

  if (isError) {
    return (
      <div className="error-container">
        <h2>Failed to load recovery status</h2>
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return timeline ? (
    <RecoveryTimelineList events={timeline.events} />
  ) : null;
}
```

## Troubleshooting

### API Not Responding

```bash
# Check environment variable
echo $NEXT_PUBLIC_API_URL

# Verify API is running
curl https://api.example.com/health
```

### Polling Not Working

```typescript
// Check if status is in_progress
console.log(timeline?.status);

// Manually start polling
startPolling();
```

### Stale Data

```typescript
// Refresh data
refetch();

// Check when data was fetched
console.log(lastFetchTime);
```

## Next Steps

1. Read [RECOVERY_API_DOCUMENTATION.md](./RECOVERY_API_DOCUMENTATION.md) for detailed info
2. Check [src/services/recoveryApi.ts](./src/services/recoveryApi.ts) for API service
3. Review [src/hooks/useRecoveryStatus.ts](./src/hooks/useRecoveryStatus.ts) for hook
4. Check tests in [src/services/__tests__/](./src/services/__tests__/) and [src/hooks/__tests__/](./src/hooks/__tests__/)
5. Integrate into your recovery page

## Resources

- [API Service](./src/services/recoveryApi.ts)
- [Hook Implementation](./src/hooks/useRecoveryStatus.ts)
- [API Service Tests](./src/services/__tests__/recoveryApi.test.ts)
- [Hook Tests](./src/hooks/__tests__/useRecoveryStatus.test.ts)
- [Full Documentation](./RECOVERY_API_DOCUMENTATION.md)
- [Recovery Timeline Docs](./RECOVERY_TIMELINE_DOCUMENTATION.md)
