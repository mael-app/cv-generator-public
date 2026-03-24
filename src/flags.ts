import { flag } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";

const hasVercelFlagsEnv = Boolean(process.env.FLAGS);

export const apiGeneration = flag<boolean>({
  key: "api-generation",
  description: "Generate CV using api",
  options: [
    { value: false, label: "Off" },
    { value: true, label: "On" },
  ],
  defaultValue: false,
  ...(hasVercelFlagsEnv
    ? { adapter: vercelAdapter() }
    : {
        // Keep local/CI builds working when Vercel Flags env vars are absent.
        decide: async () => false,
      }),
});
