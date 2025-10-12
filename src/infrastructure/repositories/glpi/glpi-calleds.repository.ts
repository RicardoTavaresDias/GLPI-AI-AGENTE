import { Calleds, CloseCalled, FollowUpCalled, GLPICalledsGateway, TaskCalled } from "@/domain/gateway/glpi/glpi-calleds.gateway";
import { Api } from "@/shared/utils/api";

export interface InputCloseCalledDto {
  input: Input
}

export interface Input {
  items_id: number
  itemtype: string
  status: number
  content: string
}

export class GLPICalledsRepository implements GLPICalledsGateway {
  constructor (
    private readonly api: Api
  ) {}
  
  public async calledsAll(): Promise<Calleds[] | []> {
    const result = await this.api.get<Calleds[] | []>("/Ticket")
    if (result.length === 0) return []

    const ticket = result.map(t => ({
        id: t.id,
        entities_id: t.entities_id,
        name: t.name,
        date: t.date,
        date_mod: t.date_mod,
        content: t.content.toString(),
        urgency: t.urgency,
        date_creation: t.date_creation
    }))

    return ticket
  } 

  public async taskCalled(idTiket: number): Promise<TaskCalled[] | []> {
    const result = await this.api.get<TaskCalled[] | []>(`/Ticket/${idTiket}/TicketTask`)
    
    if (result.length === 0) return []

    const task = result.map(t => ({
      id: t.id,
      uuid: t.uuid,
      tickets_id: t.tickets_id,
      date: t.date,
      users_id: t.users_id,
      content: t.content.toString(),
      date_mod: t.date_mod,
      date_creation: t.date_creation
    }))

    return task
  }

  public async calledById(idTiket: number): Promise<Calleds> {
    const result = await this.api.get<Calleds>(`/Ticket/${idTiket}`)

    const Called = {
      id: result.id,
      entities_id: result.entities_id,
      name: result.name,
      date: result.date,
      date_mod: result.date_mod,
      content: result.content.toString(),
      urgency: result.urgency,
      date_creation: result.date_creation
    }

    return Called
  }

  public async followUpCalled(idTiket: number): Promise<FollowUpCalled[] | []> {
    const result = await this.api.get<FollowUpCalled[] | []>(`/Ticket/${idTiket}/ITILFollowup`)
    if (result.length === 0) return []

    const followUp = result.map(f => ({
      id: f.id,
      itemtype: f.itemtype,
      items_id: f.items_id,
      date: f.date,
      users_id: f.users_id,
      content: f.content.toString(),
      date_mod: f.date_mod,
      date_creation: f.date_creation
    }))

    return followUp
  }

  public async closeCalled(idTiket: number, descript: string): Promise<CloseCalled> {
    const result = await this.api.create<CloseCalled, InputCloseCalledDto>(`/Ticket/${idTiket}/ITILSolution`, {
      input: {
          items_id: idTiket,
          itemtype: "Ticket",
          status: 1,
          content: descript
        }
    })

    return result
  }
}