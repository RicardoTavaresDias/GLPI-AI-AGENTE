import { GoogleGenAI } from "@google/genai"; 
import { env } from "./env";

const google = new GoogleGenAI({
  apiKey: env.OPENAI_API_KEY
})

export { google }