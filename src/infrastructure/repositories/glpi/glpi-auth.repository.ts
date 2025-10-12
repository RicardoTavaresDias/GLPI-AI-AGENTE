import { GLPIAuthGateway, InitSession } from "@/domain/gateway/glpi/glpi-auth.gateway";
import { env } from "@/shared/config/env";

export class GLPIAuthRepository implements GLPIAuthGateway {
  public async login(): Promise<InitSession> {
    const response = await fetch(`${env.URLGLPI}/initSession`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "App-Token": env.APPTOKEN
      },
      body: JSON.stringify({
        login: env.LOGIN,
        password: env.PASSWORD
      })
    })

    const result = await response.json() as InitSession
    return result
  }
}