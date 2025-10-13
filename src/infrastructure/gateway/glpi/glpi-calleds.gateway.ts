export interface Calleds {
  id: number
  entities_id: number
  name: string
  date: string
  date_mod: string
  content: string
  urgency: number
  date_creation: string
}

export interface TaskCalled {
  id: number
  uuid: string
  tickets_id: number
  date: string
  users_id: number
  content: string
  date_mod: string
  date_creation: string
}

export interface FollowUpCalled {
  id: number
  itemtype: string
  items_id: number
  date: string
  users_id: number
  content: string
  date_mod: string
  date_creation: string
}

export interface CloseCalled {
  id: string,
  message: string
}

export interface GLPICalledsGateway {
  calledsAll(): Promise<Calleds[] | []>
  taskCalled(idTiket: number): Promise<TaskCalled[] | []>
  calledById(idTiket: number): Promise<Calleds>
  followUpCalled(idTiket: number): Promise<FollowUpCalled[] | []>
  closeCalled(idTiket: number, descript: string): Promise<CloseCalled>
}