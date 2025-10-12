import { ProcessAIAgentRequestUsecase } from "@/usecases/process-ai-agent-request.usecase"
import { Request, Response } from "express"

export class ServiceAgenteGLPIController {
  constructor (
    private processAIAgentRequestUsecase: ProcessAIAgentRequestUsecase
  ) {}

  public postHandler = async (request: Request, respose: Response) => {
    respose.setHeader("Access-Control-Allow-Origin", "*")
    respose.setHeader("Content-Type", "text/event-stream; charset=utf-8")
    respose.setHeader("Cache-Control", "no-cache")
    respose.setHeader("Connection", "keep-alive")

    const result = this.processAIAgentRequestUsecase.execute(request.body.message)

    for await (const chunk of result) {
      respose.write(chunk)
    }

    respose.end()
  }
}