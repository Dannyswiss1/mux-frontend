# Recovery Timeline - Quick Start Guide

## 5-Minute Setup

### 1. Import Components

```typescript
import { RecoveryTimelineList } from "@/components/recovery/RecoveryTimelineList";
import { useRecoveryTimeline } from "@/hooks/useRecoveryTimeline";
import { mockRecoveryTimelineCompleted } from "@/mock-data/recovery";
```

### 2. Display Timeline

```typescript
export function RecoveryPage() {
  return (
    <RecoveryTimelineList
      events={mockRecoveryTimelineCompleted.events}
    />
  );
}
```

### 3. Add Event Selection

```typescript
export function RecoveryPageWithSelection() {
  const { timeline, selectEvent } = useRecoveryTimeline(
    mockRecoveryTimelineCompleted
  );

  return (
    <RecoveryTimelineList
      events={timeline.events}
      onEventClick={selectEvent}
    />
  );
}
```

## Common Tasks

### Display Progress

```typescript
const { progressPercentage, isComplete } = useRecoveryTimeline(timeline);

<div>
  <p>Progress: {progressPercentage}%</p>
  {isComplete && <p>Recovery Complete!</p>}
</div>
```

### Handle Errors

```typescript
const { hasErrors, failedEvents } = useRecoveryTimeline(timeline);

{hasErrors && (
  <div className="bg-red-50 p-4 rounded">
    <p>Recovery encountered {failedEvents.length} error(s)</p>
  </div>
)}
```

### Format Duration

```typescript
const { formatDuration, getEventDuration } = useRecoveryTimeline(timeline);

const duration = getEventDuration(0, 1);
if (duration) {
  <p>Step took: {formatDuration(duration)}</p>
}
```

### Filter Events

```typescript
const { getEventsByStatus } = useRecoveryTimeline(timeline);

const completed = getEventsByStatus("completed");
const failed = getEventsByStatus("failed");
```

## Available Mock Data

```typescript
import {
  mockRecoveryEvents,              // Array of events
  mockRecoveryTimelineCompleted,   // Completed timeline
  mockRecoveryTimelineInProgress,  // In-progress timeline
  mockRecoveryTimelineFailed,      // Failed timeline
  mockRecoveryTimelinePending,     // Pending timeline
} from "@/mock-data/recovery";
```

## Component Props

### RecoveryTimelineList

```typescript
<RecoveryTimelineList
  events={timeline.events}           // Required: array of events
  onEventClick={(event) => {}}       // Optional: click handler
  className="custom-class"           // Optional: CSS classes
  emptyMessage="No events"           // Optional: empty state message
/>
```

### RecoveryTimelineEvent

```typescript
<RecoveryTimelineEvent
  event={event}                      // Required: event object
  isLast={false}                     // Optional: is last event
  isFirst={false}                    // Optional: is first event
  onClick={() => {}}                 // Optional: click handler
  className="custom-class"           // Optional: CSS classes
/>
```

## Hook Methods

```typescript
const {
  // State
  timeline,                          // Current timeline
  selectedEvent,                     // Selected event or null

  // Methods
  updateTimeline(newTimeline),       // Update timeline
  selectEvent(eventId),              // Select event
  getEventsByStatus(status),         // Filter by status
  formatDuration(ms),                // Format duration
  validateTimeline(timeline),        // Validate timeline

  // Computed
  progressPercentage,                // 0-100
  isComplete,                        // boolean
  hasErrors,                         // boolean
  currentEvent,                      // event or null
  completedEvents,                   // array
  inProgressEvents,                  // array
  failedEvents,                      // array
  pendingEvents,                     // array
} = useRecoveryTimeline(timeline);
```

## Event Types

```typescript
type RecoveryEventType = 
  | "initiated"      // Recovery started
  | "detection"      // Issue detected
  | "verification"   // Identity verified
  | "processing"     // Processing recovery
  | "completion"     // Recovery completed
  | "error"          // Error occurred
```

## Event Status

```typescript
type RecoveryEventStatus = 
  | "pending"        // Waiting
  | "in_progress"    // Running
  | "completed"      // Done
  | "failed"         // Failed
```

## Running Tests

```bash
# All recovery timeline tests
pnpm test useRecoveryTimeline
pnpm test RecoveryTimelineList
pnpm test RecoveryTimelineEvent

# With coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

## Test Statistics

- **Hook Tests:** 40+ tests
- **RecoveryTimelineList Tests:** 50+ tests
- **RecoveryTimelineEvent Tests:** 45+ tests
- **Total:** 135+ tests

## Styling

### Status Colors

- **Completed:** Green (bg-green-50, text-green-700)
- **In Progress:** Yellow (bg-yellow-50, text-yellow-700)
- **Failed:** Red (bg-red-50, text-red-700)
- **Pending:** Zinc (bg-zinc-100, text-zinc-600)

### Dark Mode

All components include dark mode support with `dark:` prefixes.

## Accessibility

- ✅ ARIA roles and labels
- ✅ Semantic HTML
- ✅ Keyboard navigation
- ✅ Color contrast
- ✅ Screen reader friendly

## Common Patterns

### Complete Recovery Workflow

```typescript
function RecoveryWorkflow() {
  const {
    timeline,
    progressPercentage,
    isComplete,
    hasErrors,
    selectEvent,
  } = useRecoveryTimeline(mockRecoveryTimelineCompleted);

  return (
    <div className="space-y-4">
      <h2>Recovery Status</h2>
      
      <div className="bg-blue-50 p-4 rounded">
        <p>Progress: {progressPercentage}%</p>
        {isComplete && <p className="text-green-600">Complete!</p>}
        {hasErrors && <p className="text-red-600">Failed</p>}
      </div>

      <RecoveryTimelineList
        events={timeline.events}
        onEventClick={selectEvent}
      />
    </div>
  );
}
```

### In-Progress Recovery

```typescript
function InProgressRecovery() {
  const { currentEvent, progressPercentage } = useRecoveryTimeline(
    mockRecoveryTimelineInProgress
  );

  return (
    <div>
      <p>Current Step: {currentEvent?.title}</p>
      <p>Progress: {progressPercentage}%</p>
    </div>
  );
}
```

### Error Handling

```typescript
function RecoveryWithErrors() {
  const { hasErrors, failedEvents } = useRecoveryTimeline(
    mockRecoveryTimelineFailed
  );

  if (hasErrors) {
    return (
      <div className="bg-red-50 p-4 rounded">
        <h3>Recovery Failed</h3>
        {failedEvents.map((event) => (
          <div key={event.id}>
            <p>{event.title}</p>
            {event.errorMessage && (
              <p className="text-red-600">{event.errorMessage}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return <p>Recovery successful</p>;
}
```

## Troubleshooting

### Timeline not showing
- Check events array is not empty
- Verify event data structure
- Check for console errors

### Progress not updating
- Ensure updateTimeline is called
- Verify timeline data is valid
- Check component re-rendering

### Styles not applying
- Verify Tailwind CSS is loaded
- Check dark mode configuration
- Verify className props

## Next Steps

1. Read [RECOVERY_TIMELINE_DOCUMENTATION.md](./RECOVERY_TIMELINE_DOCUMENTATION.md) for detailed info
2. Check [src/mock-data/recovery.ts](./src/mock-data/recovery.ts) for data structure
3. Review tests in [src/components/recovery/__tests__/](./src/components/recovery/__tests__/)
4. Integrate into your recovery page

## Resources

- [Type Definitions](./src/types/recovery.ts)
- [Hook Implementation](./src/hooks/useRecoveryTimeline.ts)
- [Components](./src/components/recovery/)
- [Mock Data](./src/mock-data/recovery.ts)
- [Tests](./src/components/recovery/__tests__/)
- [Full Documentation](./RECOVERY_TIMELINE_DOCUMENTATION.md)
