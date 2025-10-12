import OpenAI from "openai";
import { buildDocsSystemPrompt } from "./prompts/prompt"
import { buildSystemPrompt } from "@/infrastructure/mcp/prompts/prompt";
import { docAgenteDiretrizes } from "./resources";
import { ChatMessage as ChatMessageOpenAI, DecisionInputDto, DecisionOutputDto, ChatCompletionFunctionTool, FunctionDeclaration } from "../../domain/gateway/mcp/agenteAI-openAI"
import { IAgenteAIGateway } from "@/domain/gateway/agente.gateway";
import { IAICacheGateway } from "@/domain/gateway/cache.gateway";

export class AgenteAIOpenAIRepository implements IAgenteAIGateway<DecisionInputDto, DecisionOutputDto, ChatMessageOpenAI> {
  private readonly systemPrompt: string = buildSystemPrompt()
  private readonly docsPrompt = buildDocsSystemPrompt(docAgenteDiretrizes())

  constructor (
    private agenteAI: OpenAI, 
    private readonly cache: IAICacheGateway<ChatMessageOpenAI>
  ) {}

  public async *decided(input: DecisionInputDto) {
    const responseAI = await this.agenteAI.chat.completions.create({
      model: "llama3.1",
      messages: [
        { role: "system", content: this.systemPrompt },
        { role: "system", content: this.docsPrompt },
        ...input.contents
      ],
      tools: [
        ...this.formatTool(input.functionDeclarations)
      ],
      temperature: 0.9,
      stream: true
    })
  
    for await (const chunk of responseAI) {
      const delta = chunk.choices[0]?.delta

      //  Texto normal sendo gerado
      if (delta.content) {
        yield delta.content
      }

      // Function calling detectado
      if (delta.tool_calls) {
        yield { functionCalls: delta.tool_calls }
      }
    }
  }

  private formatTool (tools: FunctionDeclaration[]): ChatCompletionFunctionTool[] {
    const formatOpenAi: ChatCompletionFunctionTool[] = tools.map(
      value => ({
        type: "function",
        function: {
        ...value
        }
    }))

    return formatOpenAi
  }

  public async cacheMessageUser (role: "user" | "model", message: string): Promise<void> {
    const convertRoleToOpenAI = role === "model" ? "assistant" : role

    return await this.cache.addMessage('message', [{
      role: convertRoleToOpenAI,
      content: message
    }])
  }

  public async *agenteFunction (cache: IAICacheGateway<ChatMessageOpenAI>, key: string): AsyncGenerator<string> {
    const resultQuestion = await this.agenteAI.chat.completions.create({
      model: 'llama3.1',
      messages: [
        { role: "system", content: this.systemPrompt },
        ...await cache.getSession(key)
      ],
      temperature: 0.9,
      stream: true  
    })

    for await (const chunk of resultQuestion) {
      if (chunk) {
        yield chunk.choices[0]?.delta.content as string
      }
    }
  }

  public async cacheMessageFunction (functionName: string, functionResult: string): Promise<void> {
    return await this.cache.addMessage('message', [{
      role: "tool",
      tool_call_id: functionName,
      content: functionResult
    }])
  }
 }