import type { AgentDecision, LLMProvider, PlayerObservation } from './types';

export interface PlayerMemory {
  observations: PlayerObservation[];
  beliefs: Record<string, number>;
}

export class PlayerAgent {
  constructor(
    readonly playerId: number,
    private readonly provider: LLMProvider,
    readonly memory: PlayerMemory = { observations: [], beliefs: {} },
  ) {}

  async decide(observation: PlayerObservation): Promise<AgentDecision> {
    this.memory.observations.push(observation);

    const prompt = [
      '你是狼人杀玩家。不要只给直觉判断。',
      '分析身份可能性、发言目的、收益变化、票型、行为是否符合夜间信息。',
      '同时考虑正向解释和反向解释，维护自己的怀疑链。',
      '最后输出结构化行动。',
      JSON.stringify(observation),
    ].join('\n');

    const response = await this.provider.chat([
      { role: 'system', content: prompt },
    ], { thinking: true, reasoningEffort: 'high' });

    return {
      action: 'speech',
      summary: [response],
    };
  }
}
