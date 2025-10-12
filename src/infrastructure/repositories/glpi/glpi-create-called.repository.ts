import { CreateCalled, GLPICreateCalledGateway, inputCreateCalledDto } from "@/domain/gateway/glpi/glpi-create-called.gateway";
import { Api } from "@/shared/utils/api";

export interface InputCreateCalledDto {
  input: Input
}

export interface Input {
  entities_id: number
  itilcategories_id: number
  type: number
  requesttypes_id: number 
  global_validation: number 
  name: string
  content: string
  _users_id_requester: number
  _groups_id_requester: number
  _users_id_watcher: number
  _groups_id_watcher: number
  _users_id_assign: number
  _groups_id_assign: number
}

export class GLPICreateCalledRepository implements GLPICreateCalledGateway {
  constructor (
    private readonly api: Api
  ) {}

  public async newCalled(input: inputCreateCalledDto): Promise<CreateCalled> {
    const result = await this.api.create<CreateCalled, InputCreateCalledDto>("/Ticket", {
      input: {
        entities_id: input.entities_id,
        itilcategories_id: 2,
        type: 2, 
        requesttypes_id: 1, 
        global_validation: 1, 
        name: input.name,
        content: input.content,
        _users_id_requester: 0,
        _groups_id_requester: 4,
        _users_id_watcher: 0,
        _groups_id_watcher: 3,
        _users_id_assign: 0, 
        _groups_id_assign: 1
      }
    })

    return result 
  }
}