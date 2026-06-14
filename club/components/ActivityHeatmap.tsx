"use client";

/** GitHub-style activity heatmap of the last 12 weeks of workouts. */
export function ActivityHeatmap({ workoutDays }: { workoutDays: number[] }) {
  const DAY = 24 * 60 * 60 * 1000;
  const set = new Set(workoutDays);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();

  // Align the grid so the last column ends on this week. 12 weeks × 7 days.
  const weeks = 12;
  const cols: number[][] = [];
  // Find the start: 12 weeks back, snapped to the week's start (Sunday).
  const startOffset = (weeks - 1) * 7 + today.getDay();
  const start = todayTs - startOffset * DAY;

  for (let w = 0; w < weeks; w++) {
    const col: number[] = [];
    for (let d = 0; d < 7; d++) {
      col.push(start + (w * 7 + d) * DAY);
    }
    cols.push(col);
  }

  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {cols.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-1">
          {col.map((ts) => {
            const future = ts > todayTs;
            const active = set.has(ts);
            return (
              <span
                key={ts}
                title={new Date(ts).toLocaleDateString()}
                className="h-3.5 w-3.5 rounded-[3px]"
                style={{
                  background: future
                    ? "transparent"
                    : active
                      ? "#34d399"
                      : "rgba(255,255,255,0.06)",
                  boxShadow: active ? "0 0 6px rgba(52,211,153,0.5)" : "none",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
