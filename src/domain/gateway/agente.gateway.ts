import { 
  DecisionInputDto as DecisionInputDtoOpenAI,
  DecisionOutputDto as DecisionOutputDtoOpenAI,
  ChatMessage as ChatMessageOpenAI
} from "@/domain/gateway/mcp/agenteAI-openAI"

import { 
  DecisionInputDto as DecisionInputDtoGeminai, 
  DecisionOutputDto as DecisionOutputDtoGeminai,
  ChatMessage as ChatMessageGeminai
} from "@/domain/gateway/mcp/agenteAI-geminai"

import { IAICacheGateway } from "./cache.gateway"


export type AgenteAIOpenAIGateway = IAgenteAIGateway<
  DecisionInputDtoOpenAI,
  DecisionOutputDtoOpenAI,
  ChatMessageOpenAI
>

export type AgenteAIGeminaiGateway = IAgenteAIGateway<
  DecisionInputDtoGeminai,
  DecisionOutputDtoGeminai,
  ChatMessageGeminai
>

export interface IAgenteAIGateway<I, O, M> {
  decided(input: I): AsyncGenerator<O>
  agenteFunction(cache: IAICacheGateway<M>, key: string): AsyncGenerator<string>
}