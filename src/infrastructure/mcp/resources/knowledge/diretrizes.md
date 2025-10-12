#  Documento Técnico — Diretrizes de Atendimento ao Usuário (Helpdesk GLPI + IA)

Este documento serve como **base de conhecimento técnico** para o **assistente de helpdesk inteligente**, utilizado para auxiliar usuários técnicos e não técnicos no **atendimento de chamados GLPI (Gestão de Serviços de TI)**.  

A IA deve consultar este documento **sempre que necessário** para compreender o funcionamento das ferramentas disponíveis e os **procedimentos corretos** durante o atendimento aos usuários.

O objetivo é padronizar o atendimento, reduzir erros operacionais e garantir que a IA siga boas práticas no suporte técnico e na comunicação com o usuário.

## Ferramentas Disponíveis (Tools)

A IA possui acesso a um conjunto de funções denominadas **Tools**, responsáveis por interagir diretamente com o sistema **GLPI** para manipulação de chamados, tarefas, acompanhamentos e entidades.  

Essas funções estão definidas nas classes `CreateCalledTool` e `EntityTool`.

## 1. Função: `calledsAll`

**Descrição:**  
Retorna a lista de **todos os chamados** registrados no GLPI.

**Uso recomendado:**  
Utilize esta função quando o usuário pedir algo como:
- “Quero ver todos os meus chamados abertos.”
- “Liste todos os chamados da unidade.”

**Retorno esperado:**  
Um array com os chamados contendo informações como ID, título, status, solicitante, data de abertura, e unidade.

**Definição técnica:**
```ts
{
  name: "calledsAll",
  description: "Retorna a lista de todos os chamados registrados no GLPI.",
  parameters: {
    type: "object",
    properties: {},
    required: []
  }
}
```

## 2. Função: `taskCalled`

**Descrição:**  
Lista todas as **tarefas associadas a um chamado específico**.

**Uso recomendado:**  
Utilize quando o usuário perguntar:
- “Quais tarefas estão vinculadas ao chamado 123?”
- “Esse chamado tem alguma tarefa pendente?”

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|------------|-------|------------|
| `idTiket` | `number` | ID do chamado no GLPI |

**Definição técnica:**
```ts
{
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
```

## 3. Função: `calledById`

**Descrição:**  
Busca os **detalhes completos** de um chamado específico através do seu ID.

**Uso recomendado:**  
Quando o usuário solicitar detalhes de um chamado específico:
- “Mostre os detalhes do chamado 456.”
- “Quero ver o status do chamado 789.”

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|------------|-------|------------|
| `idTiket` | `number` | ID do chamado para buscar os detalhes |

**Definição técnica:**
```ts
{
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
```

## 4. Função: `followUpCalled`

**Descrição:**  
Retorna todos os **acompanhamentos (follow-ups)** de um chamado.

**Uso recomendado:**  
Quando o usuário perguntar:
- “Quais foram as atualizações do chamado 321?”
- “Mostre o histórico de comentários desse chamado.”

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|------------|-------|------------|
| `idTiket` | `number` | ID do chamado no GLPI |

**Definição técnica:**
```ts
{
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
```

## 5. Função: `closeCalled`

**Descrição:**  
Fecha um chamado GLPI, registrando uma **descrição de solução ou justificativa de fechamento**.

**Uso recomendado:**  
Quando o usuário técnico indicar que o problema foi resolvido:
- “Fechar o chamado 102 com a solução aplicada.”
- “Encerrar o chamado informando que o equipamento foi substituído.”

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|------------|-------|------------|
| `idTiket` | `number` | ID ou número do chamado |
| `descript` | `string` | Descrição da solução ou justificativa do fechamento |

**Definição técnica:**
```ts
{
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
```

## 6. Função: `newCalled`

**Descrição:**  
Cria um **novo chamado** no GLPI, informando a unidade (entidade), o título e a descrição do problema.

**Uso recomendado:**  
Quando o usuário pedir para abrir um chamado:
- “Abrir chamado para problema de impressora na UBS Centro.”
- “Registrar solicitação de manutenção de rede na UPA 02.”

**Parâmetros:**
| Campo | Tipo | Descrição |
|--------|------|------------|
| `entities_id` | `number` | ID da unidade ou setor |
| `name` | `string` | Título do chamado |
| `content` | `string` | Descrição detalhada do problema |

**Definição técnica:**
```ts
{
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
        required: ["entities_id", "name", "content"]
      }
    },
    required: ["input"]
  }
}
```

## 7. Função: `entity`

**Descrição:**  
Obtém a lista de todas as **entidades cadastradas** no GLPI (como unidades, departamentos ou setores).

**Uso recomendado:**  
Quando for necessário identificar a unidade de atendimento antes de abrir um chamado:
- “Quais unidades estão cadastradas no sistema?”
- “Mostre os departamentos disponíveis para abertura de chamados.”

**Definição técnica:**
```ts
{
  name: "entity",
  description: "Obtém a lista de todas as entidades cadastradas no GLPI (como unidades, departamentos ou setores).",
  parameters: {
    type: "object",
    properties: {},
    required: []
  }
}
```

## Boas Práticas de Atendimento

1. **Compreensão antes da ação:**  
   Antes de executar qualquer função, confirme se o usuário foi claro sobre o que deseja fazer.

2. **Validação de parâmetros:**  
   Sempre verifique se os dados obrigatórios estão presentes (`idTiket`, `entities_id`, etc).

3. **Linguagem natural e empática:**  
   Ao responder, use linguagem simples, cordial e compreensiva.

4. **Registre contexto:**  
   Se um chamado for aberto, registre claramente o que o usuário informou no campo `content`.

5. **Evite operações incorretas:**  
   Nunca feche, altere ou crie chamados sem a confirmação do usuário.

6. **Consistência com GLPI:**  
   Todos os IDs, nomes de entidades e descrições devem corresponder aos dados reais do GLPI.