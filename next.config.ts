import { join } from "node:path";
import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  // Pin the trace root: a lockfile in a parent directory otherwise makes Next
  // guess wrong about where this project starts.
  outputFileTracingRoot: join(process.cwd()),
  // Content is read from disk at build time; keep the YAML tree traceable.
  outputFileTracingIncludes: { "/**": ["./content/**/*"] },
};

export default config;
