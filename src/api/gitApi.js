// crawler.js
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export const ghClient = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    "Content-Type": "application/json",
  },
});
