// export const BASE_URL = "http://localhost:8000"

// frontend/src/utils/constants.js
// Read API base URL from Vite env and sanitize trailing slash.
// Fallback to localhost if not set (handy for local dev if you forget .env).
export const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/$/, "");
