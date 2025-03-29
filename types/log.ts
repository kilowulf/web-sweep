/**
 * LogLevels
 *
 * An array of allowed log levels.
 */
export const LogLevels = ["info", "error", "warning"] as const;

/**
 * LogLevel type.
 *
 * Represents a log level, which can be "info", "error", or "warning".
 */
export type LogLevel = (typeof LogLevels)[number];

/**
 * Log type.
 *
 * Represents a log entry with a message, a log level, and a timestamp.
 *
 * @property {string} message - The log message.
 * @property {LogLevel} level - The severity level of the log.
 * @property {Date} timestamp - The date and time when the log was created.
 */
export type Log = {
  message: string;
  level: LogLevel;
  timestamp: Date;
};

/**
 * LogFunction type.
 *
 * A function type that takes a string message and logs it.
 *
 * @param {string} message - The message to log.
 */
export type LogFunction = (message: string) => void;

/**
 * LogCollector type.
 *
 * Represents a log collector that provides a method to retrieve all collected logs
 * and includes logging functions for each defined log level.
 *
 * @property {() => Log[]} getAll - A function that returns an array of all log entries.
 * @property {LogFunction} info - Function to log informational messages.
 * @property {LogFunction} error - Function to log error messages.
 * @property {LogFunction} warning - Function to log warning messages.
 */
export type LogCollector = {
  getAll(): Log[];
} & {
  [K in LogLevel]: LogFunction;
};
