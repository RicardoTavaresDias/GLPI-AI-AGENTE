import { IUsecase } from "./usecase";
import { CreateCalledTool } from "@/infrastructure/mcp/tools/create-called.tool";
import { CalledsTool } from "@/infrastructure/mcp/tools/calleds.tool";
import { EntityTool } from "@/infrastructure/mcp/tools/entity.tool";
import { ChatMessage, DecisionInputDto, DecisionOutputDto, FunctionDeclaration } from "../infrastructure/gateway/mcp/agenteAI";
import { FunctionCall } from "@google/genai";
import { GLPICalledsRepository } from "@/infrastructure/repositories/glpi/glpi-calleds.repository";
import { GLPICreateCalledRepository } from "@/infrastructure/repositories/glpi/glpi-create-called.repository";
import { GLPIEntityRepository } from "@/infrastructure/repositories/glpi/glpi.entity.repository";
import { inputCreateCalledDto } from "@/infrastructure/gateway/glpi/glpi-create-called.gateway";
import { IAICacheGateway } from "@/infrastructure/gateway/cache.gateway";
import { IAgenteAIGateway } from "@/infrastructure/gateway/agente.gateway";

export class ProcessAIAgentRequestUsecase implements IUsecase<string, string> {
  constructor (
    private readonly agenteAI: IAgenteAIGateway<DecisionInputDto, DecisionOutputDto>,
    private readonly cache: IAICacheGateway<ChatMessage>,
    private readonly createCalledTool: CreateCalledTool,
    private readonly calledsTool: CalledsTool,
    private readonly entityTool: EntityTool,
    private readonly glpiCalledRepository: GLPICalledsRepository,
    private readonly glpiCreateCalledRepository: GLPICreateCalledRepository,
    private readonly glpiEntityRepository: GLPIEntityRepository
  ) {}

  public async *execute(input?: string): AsyncGenerator<string> {
    input && await this.agenteAI.cacheMessageUser("user", input)

    const tools: FunctionDeclaration[] = this.buildTools()

    const response = this.agenteAI.decided({
      contents: await this.cache.getSession('message') as ChatMessage[],
      functionDeclarations: [...tools]
    })

    const result = this.processAIResponse(response)

    for await (const chunk of result) {
      if(chunk) {
        yield chunk
      }
    }
  }

  private buildTools() {
    return [
      this.createCalledTool.newCalled(),
      this.entityTool.entity(),
      this.calledsTool.calledsAll(),
      this.calledsTool.taskCalled(),
      this.calledsTool.calledById(),
      this.calledsTool.followUpCalled(),
      this.calledsTool.closeCalled()
    ]
  }

  private async *processAIResponse (aiResponse: AsyncGenerator<string | any>) {
    let systemCover: string[] = []

    for await (const chunk of aiResponse) {
      if (typeof chunk === "string") {
        systemCover.push(chunk)
        yield chunk
      } else if ("functionCalls" in chunk) {
        await this.agenteFuction(chunk.functionCalls)
        const returnAgenteFunction = this.execute()

        for await (const chunk of returnAgenteFunction) {
          systemCover.push(chunk)
          yield chunk
        }
      }
    }

    await this.agenteAI.cacheMessageUser("model", systemCover.join(""))
    systemCover.length = 0
  }

  private async agenteFuction (event: FunctionCall[]): Promise<void> {
    console.log("Usecase agenteFuction => event: ", event)
    const functionCalls = event[0]
    const glpiFunction = this.glpiFunction(functionCalls)

    const functionResult = glpiFunction[functionCalls?.name as keyof typeof glpiFunction]
    await this.agenteAI.cacheMessageFunction(functionCalls.name!, await functionResult())
  }

  private glpiFunction (functionCalls: any) {
    return {
      calledsAll: () => this.glpiCalledRepository.calledsAll(),
      taskCalled: () => this.glpiCalledRepository.taskCalled(functionCalls.args?.idTiket as number),
      calledById: () => this.glpiCalledRepository.calledById(functionCalls.args?.idTiket as number),
      followUpCalled: () => this.glpiCalledRepository.followUpCalled(functionCalls.args?.idTiket as number),
      closeCalled: () => this.glpiCalledRepository.closeCalled(functionCalls.args?.idTiket as number, functionCalls.args?.descript as string),
      newCalled: () => this.glpiCreateCalledRepository.newCalled(functionCalls.args?.input as inputCreateCalledDto),
      entity: () => this.glpiEntityRepository.entity()
    }
  }
}