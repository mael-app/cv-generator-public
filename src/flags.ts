import { flag } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";

export const apiGeneration = flag<boolean>({
  key: "api-generation",
  description: "Generate CV using api",
  options: [
    { value: false, label: "Off" },
    { value: true, label: "On" },
  ],
  defaultValue: false,
  adapter: vercelAdapter(),
});
