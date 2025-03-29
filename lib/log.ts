import {
  Log,
  LogCollector,
  LogFunction,
  LogLevel,
  LogLevels
} from "@/types/log";

/**
 * createLogCollector
 *
 * Creates a log collector that aggregates log messages with their respective log levels and timestamps.
 * It generates log functions for each log level defined in LogLevels, which when invoked,
 * will push a log entry into an internal array. The collector also provides a method, `getAll`,
 * to retrieve all collected log entries.
 *
 * @returns {LogCollector} An object containing log functions for each log level and a `getAll` method.
 */
export function createLogCollector(): LogCollector {
  const logs: Log[] = [];
  const getAll = () => logs;
  const logFunctions = {} as Record<LogLevel, LogFunction>;

  // Create a log function for each defined log level.
  LogLevels.forEach((level) => {
    logFunctions[level] = (message: string) => {
      logs.push({ level, message, timestamp: new Date() });
    };
  });

  return {
    getAll,
    ...logFunctions
  };
}
