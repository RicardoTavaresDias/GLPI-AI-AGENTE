export interface IUsecase<InputDto, OutPutDto> {
  execute(input: InputDto): AsyncGenerator<OutPutDto>
}