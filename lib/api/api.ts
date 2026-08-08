import axios from "axios";

const publicAppUrl = process.env.NEXT_PUBLIC_API_URL;
const vercelAppUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : undefined;
const appUrl = publicAppUrl ?? vercelAppUrl;
const baseURL = appUrl ? `${appUrl.replace(/\/$/, "")}/api` : "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
