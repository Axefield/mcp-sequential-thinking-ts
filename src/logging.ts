import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: process.env.NODE_ENV === 'production' ? undefined : {
    target: 'pino-pretty',
    options: { 
      colorize: true, 
      translateTime: 'HH:MM:ss.l', 
      ignore: 'pid,hostname' 
    }
  }
});

export const childLogger = (bindings: Record<string, unknown>) => logger.child(bindings);
