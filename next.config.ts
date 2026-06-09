import { validateEnv } from "./src/lib/env";

// Validate environment variables at build/startup time
validateEnv();

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
