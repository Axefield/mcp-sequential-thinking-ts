import pino from 'pino';

declare const logger: pino.Logger<never, boolean>;
declare const childLogger: (bindings: Record<string, unknown>) => pino.Logger<never, boolean>;

export { childLogger, logger };
