import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  OPENAI_API_KEY: z.string(),
  APPTOKEN: z.string(),
  LOGIN: z.string(),
  PASSWORD: z.string(),
  URLGLPI: z.url(),
  PASSWORD_REDIS: z.string(),
  HOST_REDIS: z.string(),
  PORT_REDIS: z.coerce.number()
})  

export const env = envSchema.parse(process.env)