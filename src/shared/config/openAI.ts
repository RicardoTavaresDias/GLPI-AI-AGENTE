import OpenAI from "openai";
import { env } from "./env";

const openAI = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: env.OPENAI_API_KEY
})

export { openAI }