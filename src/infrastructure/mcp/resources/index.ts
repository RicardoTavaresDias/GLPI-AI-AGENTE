import fs from "fs"

export function docAgenteDiretrizes (): string {
  const diretrizes = fs.readFileSync("./src/infrastructure/mcp/resources/knowledge/diretrizes.md", "utf-8")

  return diretrizes
}