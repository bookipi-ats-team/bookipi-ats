/**
 * Utilities to conditionally execute functions.
 *
 */

/**
 * Runs a synchronous callback when the condition is true and returns the callback result or `undefined`.
 */
export function executeIf<T>(condition: boolean, fn: () => T): T | undefined {
  if (condition) return fn();
  return undefined;
}

/**
 * Runs an async (or sync) callback when the condition is true and returns a `Promise` resolving to the result or `undefined`.
 */
export async function executeIfAsync<T>(
  condition: boolean,
  fn: () => Promise<T> | T,
): Promise<T | undefined> {
  if (!condition) return undefined;
  return await fn();
}
