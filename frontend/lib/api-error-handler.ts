export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    switch (error.message) {
      case 'Failed to fetch':
        return 'Network error. Please check your connection.';
      default:
        return error.message;
    }
  }
  return 'An unexpected error occurred';
} 