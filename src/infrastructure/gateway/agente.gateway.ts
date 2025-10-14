export interface IAgenteAIGateway<I, O> {
  decided(input: I): AsyncGenerator<O>
  cacheMessageUser(role: "user" | "model", message: string): Promise<void>
  cacheMessageFunction(functionName: string, functionResult: any): Promise<void>
}