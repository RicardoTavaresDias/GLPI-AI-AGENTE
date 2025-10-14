export interface MessagePart {
  text: string
}

export interface ChatMessage {
  role: "user" | "model" | "system" | "function" 
  parts: MessagePart[] | any
}

export interface DecisionInputDto {
  contents: ChatMessage[]
  functionDeclarations: FunctionDeclaration[] 
}

export interface FunctionDeclaration {
  name: string                    
  description?: string             
  parameters: Record<string, any>  
  required?: string[]              
}

 interface FunctionCall {
    id?: string | undefined;
    args?: Record<string, unknown> | undefined;
    name?: string | undefined;
}

export interface FunctionCallDecisionOutputDto {
  functionCalls: FunctionCall[]
}

// returno com generateContentStream
export type DecisionOutputDto = string | FunctionCallDecisionOutputDto