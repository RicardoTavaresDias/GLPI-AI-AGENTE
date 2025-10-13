import { IAICacheGateway } from "@/infrastructure/gateway/cache.gateway"

export class CacheRepository<T> implements IAICacheGateway<T> {
  private cache = new Map()

  private hasSession(AIId: string): boolean {
   return this.cache.has(AIId)
  }

  public getSession(AIId: string) {
    return this.cache.get(AIId)
  }

  private setSession(AIId: string, messages: T[]): void {
    this.cache.set(AIId, messages)
  }

  public addMessage(AIId: string, message: T[]): void {
    if (!this.hasSession(AIId)) {
      return this.setSession(AIId, message)
    }
    
    this.cache.get(AIId).push(...message)
  }
}