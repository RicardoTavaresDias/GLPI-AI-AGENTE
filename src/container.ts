import { AgenteAIGeminaiRepository } from "./infrastructure/mcp/AgenteAI-geminai.repository";
import { CacheRepository } from "./infrastructure/repositories/cache.repository";
import { CacheRedisRepository } from "./infrastructure/repositories/redis.repository";
import { CreateCalledTool } from "./infrastructure/mcp/tools/create-called.tool";
import { CalledsTool } from "./infrastructure/mcp/tools/calleds.tool";
import { EntityTool } from "./infrastructure/mcp/tools/entity.tool";
import { GLPICalledsRepository } from "./infrastructure/repositories/glpi/glpi-calleds.repository";
import { GLPICreateCalledRepository } from "./infrastructure/repositories/glpi/glpi-create-called.repository";
import { GLPIEntityRepository } from "./infrastructure/repositories/glpi/glpi.entity.repository";
import { ProcessAIAgentRequestUsecase } from "@/usecases/process-ai-agent-request.usecase";
import { google } from "@/shared/config/google"
import { Api } from "@/shared/utils/api"
import { GlpiSession } from "@/domain/entity/glpi-session"
import { GLPIAuthRepository } from "./infrastructure/repositories/glpi/glpi-auth.repository";
import { ServiceAgenteGLPIController } from "./infrastructure/http/controllers/service-agente-glpi-controller";

export class Container {
  // Sessão e API
  public session = GlpiSession.instance
  private api = new Api(this.session)

  // Infra: cache + IA
  private cacheRepository = new CacheRepository()
  private agenteAIGeminaiRepository = new AgenteAIGeminaiRepository(
    google,
    this.cacheRepository
  )

  // Ferramentas
  private createCalledTool = new CreateCalledTool()
  private calledsTool = new CalledsTool()
  private entityTool = new EntityTool()

  // Repositórios GLPI
  private calledsRepository = new GLPICalledsRepository(this.api)
  private createCalledRepository = new GLPICreateCalledRepository(this.api)
  private entityRepository = new GLPIEntityRepository(this.api)
  public authRepository = new GLPIAuthRepository()

  // Use case principal
  public processAIAgentRequestUsecase = new ProcessAIAgentRequestUsecase(
    this.agenteAIGeminaiRepository,
    this.cacheRepository,
    this.createCalledTool,
    this.calledsTool,
    this.entityTool,
    this.calledsRepository,
    this.createCalledRepository,
    this.entityRepository
  )

  // Controller HTTP
  public serviceAgenteGLPIController = new ServiceAgenteGLPIController(
    this.processAIAgentRequestUsecase
  )
}



 

