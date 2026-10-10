import { startAIGame } from "./start-ai-game";

export interface StartAIGameRequest {
  boardId?: string;
  maxRounds?: number;
  provider?: string;
  model?: string;
  reasoning?: "off" | "standard" | "deep";
}

export interface AIGameStartResponse {
  gameId: string;
  boardId: string;
  status: "started";
}

/**
 * Application boundary for HTTP/WebSocket layers.
 * The transport layer should call this service instead of assembling AI objects.
 */
export async function startAIGameApi(
  request: StartAIGameRequest = {},
): Promise<AIGameStartResponse> {
  const session = await startAIGame({
    boardId: request.boardId ?? "pre_woman_hunter_guard_wolfking",
    maxRounds: request.maxRounds ?? 100,
    provider: request.provider,
    model: request.model,
    reasoning: request.reasoning,
  });

  return {
    gameId: session.id,
    boardId: session.boardId,
    status: "started",
  };
}
