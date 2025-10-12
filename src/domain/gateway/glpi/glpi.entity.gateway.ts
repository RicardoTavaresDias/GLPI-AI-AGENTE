export interface Entity{
  id: number
  name: string
  entities_id: number
  completename: string
}

export interface GLPIEntityGateway {
  entity(): Promise<Entity[]>
}