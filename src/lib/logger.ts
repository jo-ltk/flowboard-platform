import pino from "pino";

const levels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  customLevels: levels,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  browser: {
    asObject: true,
  },
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:standard",
          },
        }
      : undefined,
});

/**
 * Creates a child logger with a correlation ID for request tracing
 */
export function createRequestLogger(requestId: string, context?: Record<string, any>) {
  return logger.child({ requestId, ...context });
}
