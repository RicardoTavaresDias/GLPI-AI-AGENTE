export class GlpiSession {
  private static _instance: GlpiSession | null = null
  private sessionToken: string = ''

  private constructor(){}

  static get instance (): GlpiSession {
    if (GlpiSession._instance === null) {
      GlpiSession._instance = new GlpiSession()
    }

    return GlpiSession._instance
  }

  public setSessionToken(value: string): string {
    return this.sessionToken = value
  }

  public getSessionToken(): string {
    return this.sessionToken
  }
}