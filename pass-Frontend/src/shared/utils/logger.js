const isDev = Boolean(import.meta.env.DEV);
const formatPrefix = (level) => `[${level.toUpperCase()}]`;
const write = (level, message, data) => {
  const text = `${formatPrefix(level)} ${message}`;
  if (level === "error") {
    console.error(text, data ?? "");
    return;
  }
  if (level === "warn") {
    console.warn(text, data ?? "");
    return;
  }
  if (isDev) {
    console.info(text, data ?? "");
  }
};
export const logger = {
  info: (message, data) => {
    write("info", message, data);
  },
  warn: (message, data) => {
    write("warn", message, data);
  },
  error: (message, error) => {
    write("error", message, error);
  },
  http: (kind, payload = {}) => {
    if (!isDev) return;
    if (kind === "request") {
      console.info(
        `[HTTP][REQ][${payload.requestId}] ${payload.method} ${payload.url}`,
        payload,
      );
      return;
    }
    if (kind === "response") {
      const level =
        payload.status >= 500 || payload.durationMs >= payload.slowThresholdMs
          ? "warn"
          : "info";
      const prefix = level === "warn" ? "[HTTP][WARN]" : "[HTTP][RES]";
      const log = level === "warn" ? console.warn : console.info;
      log(
        `${prefix}[${payload.requestId}] ${payload.method} ${payload.url} -> ${payload.status} in ${payload.durationMs}ms`,
        payload,
      );
    }
  },
};
