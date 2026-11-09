import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend/.env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../../../backend/.env"),
];

for (const envPath of candidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

export const ENV = {
  PORT: (process.env.PORT || "7000").trim(),
  FRONTEND_URL: (process.env.FRONTEND_URL || "http://localhost:3000").trim(),
  NODE_ENV: (process.env.NODE_ENV || "development").trim(),
  MONGO_URL: (process.env.MONGO_URL || "").trim(),
  JWT_SECRET: (process.env.JWT_SECRET || "").trim(),
  JWT_REFRESH_TOKEN: (process.env.JWT_REFRESH_TOKEN || "").trim(),
  GOOGLE_CLIENT_ID: (process.env.GOOGLE_CLIENT_ID || "").trim(),
  GOOGLE_CLIENT_SECRET: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
  GOOGLE_CALLBACK_URL: (process.env.GOOGLE_CALLBACK_URL || "http://localhost:7000/api/auth/google/callback").trim(),
};

export default ENV;

