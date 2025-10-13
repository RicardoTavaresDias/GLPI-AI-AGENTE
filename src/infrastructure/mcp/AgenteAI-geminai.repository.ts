import { IAgenteAIGateway } from "@/infrastructure/gateway/agente.gateway"
import { GoogleGenAI } from "@google/genai"; 
import { buildSystemPrompt } from "@/infrastructure/mcp/prompts/prompt";
import { buildDocsSystemPrompt } from "./prompts/prompt"
import { docAgenteDiretrizes } from "./resources";
import { DecisionInputDto, DecisionOutputDto, ChatMessage as ChatMessageGeminai } from "@/infrastructure/gateway/mcp/agenteAI-geminai"
import { IAICacheGateway } from "@/infrastructure/gateway/cache.gateway";

export class AgenteAIGeminaiRepository implements IAgenteAIGateway<DecisionInputDto, DecisionOutputDto, ChatMessageGeminai> {
  private readonly systemPrompt: string = buildSystemPrompt()
  private readonly docsPrompt = buildDocsSystemPrompt(docAgenteDiretrizes())
  
  constructor (
    private agenteAI: GoogleGenAI, 
    private readonly cache: IAICacheGateway<ChatMessageGeminai>
  ) {}

  public async *decided(input: DecisionInputDto): AsyncGenerator<DecisionOutputDto> {
    const responseAI = await this.agenteAI.models.generateContentStream({
      model: "gemini-2.5-flash-preview-09-2025",
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
  }

  public async cacheMessageUser (role: "user" | "model", message: string): Promise<void> {
    return await this.cache.addMessage('message', [{
      role: role,
      parts: [{
        text: message
      }]
    }])
  }

  public async *agenteFunction (cache: IAICacheGateway<ChatMessageGeminai>, key: string): AsyncGenerator<string> {    
    const resultQuestion = await this.agenteAI.models.generateContentStream({
      model: 'gemini-2.5-flash-preview-09-2025',
      contents: await cache.getSession(key), 
      config: {
        temperature: 0.9,
        systemInstruction: this.systemPrompt,
      }
    })

    for await (const chunk of resultQuestion) {
      if (chunk) {
        yield chunk.text as string
      }
    }
  }

  public async cacheMessageFunction (functionName: string, functionResult: string): Promise<void> {
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