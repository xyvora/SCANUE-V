export const CHAT_CONSTANTS = {
  DEFAULT_AGENT: 'General',
  MAX_MESSAGE_LENGTH: 1000,
  AGENTS: ['General', 'PFC'] as const,
};

export const ERROR_MESSAGES = {
  EMPTY_INPUT: 'Please enter a message',
  SEND_FAILED: 'Failed to send message',
  HTTP_ERROR: (status: number) => `HTTP error! status: ${status}`,
} as const;
