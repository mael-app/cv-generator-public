import pino from "pino";

// pino-pretty uses worker threads which conflict with Next.js bundling.
// Output is JSON — pipe through pino-pretty in dev if needed:
//   npm run dev 2>&1 | npx pino-pretty
const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
});

export default logger;
