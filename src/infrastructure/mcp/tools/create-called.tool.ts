import { FunctionDeclaration } from "@/domain/gateway/mcp/agenteAI-geminai"

export class CreateCalledTool {
  public newCalled(): FunctionDeclaration {
    return {
      name: "newCalled",
      description: "Cria um novo chamado no GLPI com título, descrição e unidade (entidade) informados.",
      parameters: {
        type: "object",
        properties: {
          input: {
            type: "object",
            description: "Dados necessários para criar um novo chamado no GLPI.",
            properties: {
              entities_id: {
                type: "number",
                description: "ID da entidade (unidade) onde o chamado será registrado."
              },
              name: {
                type: "string",
                description: "Título ou assunto do chamado."
              },
              content: {
                type: "string",
                description: "Descrição detalhada do problema ou solicitação."
              }
            },
              required: [
              "entities_id",
              "name",
              "content"
            ] 
          }
        },
        required: ["input"]
      }
    }
  }
}