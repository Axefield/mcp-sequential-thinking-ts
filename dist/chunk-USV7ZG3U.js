// src/logging.ts
import pino from "pino";
var logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  transport: process.env.NODE_ENV === "production" ? void 0 : {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss.l",
      ignore: "pid,hostname"
    }
  }
});
var childLogger = (bindings) => logger.child(bindings);

export {
  logger,
  childLogger
};
