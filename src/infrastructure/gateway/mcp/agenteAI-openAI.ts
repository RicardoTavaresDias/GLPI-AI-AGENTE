export interface ChatMessage {
  role: "user"  | "system"  | "tool" | "assistant" | any
  content: string
  tool_call_id?: string
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

export type ChatCompletionFunctionTool = {
  type: "function"; 
  function: {
    name: string;
    description?: string;
    parameters: Record<string, any>;
  }
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