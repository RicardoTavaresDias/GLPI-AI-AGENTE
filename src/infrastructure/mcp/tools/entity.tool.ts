import { FunctionDeclaration } from "@/domain/gateway/mcp/agenteAI-geminai"

export class EntityTool {
  public entity(): FunctionDeclaration {
    return {
      name: "entity",
      description: "Obtém a lista de todas as entidades cadastradas no GLPI (como unidades, departamentos ou setores).",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  }
}