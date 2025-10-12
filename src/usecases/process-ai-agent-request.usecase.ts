import { IUsecase } from "./usecase";
import { CreateCalledTool } from "@/infrastructure/mcp/tools/create-called.tool";
import { CalledsTool } from "@/infrastructure/mcp/tools/calleds.tool";
import { EntityTool } from "@/infrastructure/mcp/tools/entity.tool";
import { ChatMessage as ChatMessageGeminai, FunctionDeclaration } from "../domain/gateway/mcp/agenteAI-geminai";
import { FunctionCall } from "@google/genai";
import { GLPICalledsRepository } from "@/infrastructure/repositories/glpi/glpi-calleds.repository";
import { GLPICreateCalledRepository } from "@/infrastructure/repositories/glpi/glpi-create-called.repository";
import { GLPIEntityRepository } from "@/infrastructure/repositories/glpi/glpi.entity.repository";
import { inputCreateCalledDto } from "@/domain/gateway/glpi/glpi-create-called.gateway";
import { ChatMessage as ChatMessageOpenAI } from "@/domain/gateway/mcp/agenteAI-openAI";
import { IAICacheGateway } from "@/domain/gateway/cache.gateway";

export class ProcessAIAgentRequestUsecase implements IUsecase<string, string> {
  constructor (
    private readonly agenteAI: any,
    private readonly cache: IAICacheGateway<ChatMessageOpenAI | ChatMessageGeminai>,
    private readonly createCalledTool: CreateCalledTool,
    private readonly calledsTool: CalledsTool,
    private readonly entityTool: EntityTool,
    private readonly glpiCalledRepository: GLPICalledsRepository,
    private readonly glpiCreateCalledRepository: GLPICreateCalledRepository,
    private readonly glpiEntityRepository: GLPIEntityRepository
  ) {}

  public async *execute(input: string): AsyncGenerator<string> {
    await this.agenteAI.cacheMessageUser("user", input)

    const tools: FunctionDeclaration[] = this.buildTools()

    const response = this.agenteAI.decided({
      contents: await this.cache.getSession('message'),
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
        const returnAgenteFunction = this.agenteReturnFuction()

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

    const functionResult = await glpiFunction[functionCalls?.name as keyof typeof glpiFunction]()
    await this.agenteAI.cacheMessageFunction(functionCalls.name!, functionResult)
  }

  private glpiFunction (functionCalls: any) {
    return {
      calledsAll: async () => await this.glpiCalledRepository.calledsAll(),
      taskCalled: async () => await this.glpiCalledRepository.taskCalled(functionCalls.args?.idTiket as number),
      calledById: async () => await this.glpiCalledRepository.calledById(functionCalls.args?.idTiket as number),
      followUpCalled: async () => await this.glpiCalledRepository.followUpCalled(functionCalls.args?.idTiket as number),
      closeCalled: async () => await this.glpiCalledRepository.closeCalled(functionCalls.args?.idTiket as number, functionCalls.args?.descript as string),
      newCalled: async () => await this.glpiCreateCalledRepository.newCalled(functionCalls.args?.input as inputCreateCalledDto),
      entity: async () => await this.glpiEntityRepository.entity()
    }
  }

  private async *agenteReturnFuction (): AsyncGenerator<string> {
    const result = await this.agenteAI.agenteFunction(this.cache, 'message')
    
    for await (const chunk of result) {
      if(chunk) {
        yield chunk
      }
    }
  }
}