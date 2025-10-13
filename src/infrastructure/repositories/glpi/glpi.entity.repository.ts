import { Entity, GLPIEntityGateway } from "@/infrastructure/gateway/glpi/glpi.entity.gateway";
import { Api } from "@/shared/utils/api";

export class GLPIEntityRepository implements GLPIEntityGateway {
  constructor (
    private readonly api: Api
  ) {}

  public async entity(): Promise<Entity[]> {
    const result = await this.api.get<Entity[]>("/Entity?range=0-9999")

    const entity = result.map(e => ({
      id: e.id,
      name: e.name,
      entities_id: e.entities_id,
      completename: e.completename
    }))

    return entity
  }
}