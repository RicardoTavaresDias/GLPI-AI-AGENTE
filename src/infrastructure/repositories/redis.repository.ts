import { IAICacheGateway } from "@/domain/gateway/cache.gateway"
import { redisClient, connectRedis } from "@/shared/config/redis"

export class CacheRedisRepository<T> implements IAICacheGateway<T> {
  private cache = redisClient

  public async getSession(AIId: string): Promise<T[]> {
    const get = await this.cache.get(AIId)
    return JSON.parse(get!)
  }

  private async setSession(AIId: string, messages: T[]): Promise<void> {
    await this.cache.set(AIId, JSON.stringify(messages), { "EX": 120 })
  }

  public async addMessage(AIId: string, message: T[]): Promise<void> {
    const exist = await this.getSession(AIId)
    
    if(!exist) {
      return await this.setSession(AIId, message)
    }
    
    await this.setSession(AIId, [...exist, ...message])
  }
}