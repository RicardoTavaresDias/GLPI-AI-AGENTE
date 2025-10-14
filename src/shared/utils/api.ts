import { GlpiSession } from "@/domain/entity/glpi-session"
import { env } from "../config/env"
import { AppError } from "./AppError"

export class Api {
  constructor(
    private readonly session: GlpiSession
  ) {}

  private headers() {
    return {
      "Content-Type": "application/json",
      "App-Token": env.APPTOKEN,
      'Session-Token': this.session.getSessionToken()
    }
  }

  public async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${env.URLGLPI}${endpoint}`, {
        method: "GET",
        headers: this.headers()
      })

      const result = await response.json() as T
      return result
    } catch (error: any) {
      throw new AppError(error.message, 500)
    }
  }

  public async create<T, D>(endpoint: string, data: D): Promise<T> {
    try {
      const response = await fetch(`${env.URLGLPI}${endpoint}`, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify(data)
      })

      const result = await response.json() as T
      return result
    } catch (error: any) {
      throw new AppError(error.message, 500)
    }
  }
}