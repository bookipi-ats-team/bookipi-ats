/**
 * Generates consistent random scores for applicants based on their ID
 * This ensures the same applicant always gets the same scores across all screens
 */

/**
 * Simple hash function to convert a string to a number
 * Used to generate consistent "random" values from an ID
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Generates a consistent score (0-100) from a seed value
 * @param seed - A unique identifier (like applicantId)
 * @param offset - Optional offset to generate different scores from the same seed
 * @param min - Minimum score value (default: 70)
 * @param max - Maximum score value (default: 100)
 */
export function generateConsistentScore(
  seed: string,
  offset: number = 0,
  min: number = 70,
  max: number = 100
): number {
  const hash = hashString(seed + offset.toString());
  const range = max - min;
  return Math.floor((hash % range) + min);
}

/**
 * Gets the match score for an applicant
 * Returns consistent score based on applicant ID
 */
export function getMatchScore(applicantId: string, providedScore?: number): number {
  if (providedScore !== undefined && providedScore !== null) {
    return providedScore;
  }
  return generateConsistentScore(applicantId, 0);
}

/**
 * Gets the CV score for an applicant
 * Returns consistent score based on applicant ID (different from match score)
 */
export function getCVScore(applicantId: string, providedScore?: number): number {
  if (providedScore !== undefined && providedScore !== null) {
    return providedScore;
  }
  // Use offset of 1 to get a different score than match score
  return generateConsistentScore(applicantId, 1);
}
