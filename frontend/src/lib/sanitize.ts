import DOMPurify from 'dompurify';

/**
 * Sanitizes user input to prevent XSS and other injection attacks
 * @param input - The user input to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Use DOMPurify for more robust sanitization
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [] // Strip all attributes
  }).trim();
}

/**
 * Sanitizes an object's string properties
 * @param obj - Object to sanitize
 * @returns New object with sanitized strings
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Partial<T> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key as keyof T] = sanitizeObject(value as Record<string, unknown>) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value as T[keyof T];
    }
  }

  return sanitized as T;
}
