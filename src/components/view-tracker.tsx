"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

/** Fires a single view event on mount. Kept separate so pages stay server components. */
export function ViewTracker({ event }: { event: AnalyticsEvent }) {
  useEffect(() => {
    track(event);
    // The event object is a stable server-serialised value per page render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
