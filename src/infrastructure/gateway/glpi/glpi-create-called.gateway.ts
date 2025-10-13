export interface CreateCalled{
  id: number,
  message: string
}

export interface inputCreateCalledDto {
  entities_id: number
  name: string,
  content: string
}

export interface GLPICreateCalledGateway {
  newCalled(input: inputCreateCalledDto): Promise<CreateCalled>
}