export interface IAICacheGateway<C> {
  getSession(userId: string): Promise<C[]> | C[]
  addMessage(userId: string, message: C[]): Promise<void> | void
}