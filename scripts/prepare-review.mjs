import { mkdir, copyFile, cp, writeFile, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = process.argv[2];
if (!output)
  throw new Error("Pass a new output directory outside the repository.");
const dest = resolve(output);
if (dest.startsWith(root + "/") || dest === root)
  throw new Error("Review output must be outside the source checkout.");
try {
  await access(dest);
  throw new Error("Choose a new output directory to preserve existing files.");
} catch (e) {
  if (e.code !== "ENOENT") throw e;
}
await mkdir(resolve(dest, "assets"), { recursive: true });
await copyFile(resolve(root, "index.html"), resolve(dest, "index.html"));
await cp(
  resolve(root, "assets/app-preview"),
  resolve(dest, "assets/app-preview"),
  { recursive: true },
);
await writeFile(
  resolve(dest, "vercel.json"),
  JSON.stringify(
    {
      framework: null,
      buildCommand: null,
      installCommand: null,
      outputDirectory: ".",
      headers: [
        {
          source: "/(.*)",
          headers: [
            { key: "X-Robots-Tag", value: "noindex, nofollow" },
            { key: "X-Content-Type-Options", value: "nosniff" },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
          ],
        },
      ],
      redirects: [
        {
          source: "/options/:path*",
          destination: "https://thefriendlytrader.com/options/:path*",
          permanent: false,
        },
        {
          source: "/faq/:path*",
          destination: "https://thefriendlytrader.com/faq/:path*",
          permanent: false,
        },
      ],
    },
    null,
    2,
  ) + "\n",
);
console.log(dest);
