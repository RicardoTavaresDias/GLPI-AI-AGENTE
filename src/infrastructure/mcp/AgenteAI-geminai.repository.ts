import { IAgenteAIGateway } from "@/infrastructure/gateway/agente.gateway"
import { GoogleGenAI } from "@google/genai"; 
import { buildSystemPrompt } from "@/infrastructure/mcp/prompts/prompt";
import { buildDocsSystemPrompt } from "./prompts/prompt"
import { docAgenteDiretrizes } from "./resources";
import { DecisionInputDto, DecisionOutputDto, ChatMessage as ChatMessageGeminai } from "@/infrastructure/gateway/mcp/agenteAI"
import { IAICacheGateway } from "@/infrastructure/gateway/cache.gateway";
import { AppError } from "@/shared/utils/AppError";

export class AgenteAIGeminaiRepository implements IAgenteAIGateway<DecisionInputDto, DecisionOutputDto> {
  private readonly systemPrompt: string = buildSystemPrompt()
  private readonly docsPrompt = buildDocsSystemPrompt(docAgenteDiretrizes())
  
  constructor (
    private agenteAI: GoogleGenAI, 
    private readonly cache: IAICacheGateway<ChatMessageGeminai>
  ) {}

  public async *decided(input: DecisionInputDto): AsyncGenerator<DecisionOutputDto> {
    try {
      const responseAI = await this.agenteAI.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: [
        ...input.contents
        ],
        config: {
          temperature: 0.9,
          systemInstruction: `${this.systemPrompt}\n\n${this.docsPrompt}`,
          tools: [{
            functionDeclarations: [
              ...input.functionDeclarations
            ]
          }]
        }
      })
  
      for await (const chunk of responseAI) {

        //  Texto normal sendo gerado
        if ("text" in chunk && chunk.text) {
          yield chunk.text
        }

        // Function calling detectado
        if ("functionCalls" in chunk && chunk.functionCalls) {
          yield { functionCalls: chunk.functionCalls }
        }
      }
    } catch (error: any) {
      throw new AppError(`Agente AI: ${error.message}`, error.status)
    } 
  }

  public async cacheMessageUser (role: "user" | "model", message: string): Promise<void> {
    return await this.cache.addMessage('message', [{
      role: role,
      parts: [{
        text: message
      }]
    }])
  }

  public async cacheMessageFunction (functionName: string, functionResult: any): Promise<void> {
    return await this.cache.addMessage('message', [{
      role: "function",
      parts: [{
        functionResponse: {
          name: functionName,
          response: { result: functionResult }
        }
      }]
    }])
  }
}