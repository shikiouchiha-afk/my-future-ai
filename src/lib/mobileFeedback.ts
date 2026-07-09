export function triggerHaptic(pattern: number | number[] = 10) {
  if (typeof window === "undefined") {
    return;
  }

  const isCoarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches;
  if (!isCoarsePointer) {
    return;
  }

  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(pattern);
  }
}
