
/**
 * Generate a UUID v4 string
 * This is a simplified version for mock data purposes
 */
export function v4(): string {
  return 'article-' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
