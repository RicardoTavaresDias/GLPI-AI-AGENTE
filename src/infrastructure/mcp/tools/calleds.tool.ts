import { FunctionDeclaration } from "@/infrastructure/gateway/mcp/agenteAI"

export class CalledsTool {
  public calledsAll(): FunctionDeclaration {
    return {
      name: "calledsAll",
      description: "Retorna a lista de todos os chamados registrados no GLPI.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  }

  public taskCalled(): FunctionDeclaration {
    return {
      name: "taskCalled",
      description: "Lista todas as tarefas associadas a um chamado específico no GLPI.",
      parameters: {
        type: "object",
        properties: {
          idTiket: {
            type: "number",
            description: "ID do chamado para obter as tarefas associadas."
          }
        },
        required: ["idTiket"] 
      }
    }
  }

  public calledById(): FunctionDeclaration {
    return {
      name: "calledById",
      description: "Busca os detalhes completos de um chamado específico no GLPI pelo seu ID.",
      parameters: {
        type: "object",
        properties: {
          idTiket: {
            type: "number",
            description: "ID do chamado para buscar os detalhes."
          }
        },
        required: ["idTiket"] 
      }
    }
  }

  public followUpCalled(): FunctionDeclaration {
    return {
      name: "followUpCalled",
      description: "Lista todos os acompanhamentos (follow-ups) associados a um chamado no GLPI.",
      parameters: {
        type: "object",
        properties: {
          idTiket: {
            type: "number",
            description: "ID do chamado para obter os acompanhamentos."
          }
        },
        required: ["idTiket"] 
      }
    }
  }

  public closeCalled(): FunctionDeclaration {
    return {
      name: "closeCalled",
      description: "Fecha um chamado GLPI com uma descrição de solução.",
      parameters: {
        type: "object",
        properties: {
          idTiket: {
            type: "number",
            description: "id do chamado ou numero de chamado"
          },
          descript: {
            type: "string",
            description: "Descrição da solução ou justificativa do fechamento."
          }
        },
        required: ["idTiket", "descript"] 
      }
    }
  }
}