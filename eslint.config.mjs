import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // ❌ disable completely
      "@typescript-eslint/no-explicit-any": "off",

      // ⚠️ or just warn instead of error
      // "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
