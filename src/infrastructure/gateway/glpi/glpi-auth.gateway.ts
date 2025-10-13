export interface InitSession {
  session_token: string
}

export interface GLPIAuthGateway {
  login(): Promise<InitSession>
}