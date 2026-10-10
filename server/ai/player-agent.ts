import type { AgentDecision, LLMProvider, PlayerObservation } from './types';

export interface PlayerMemory {
  observations: PlayerObservation[];
  beliefs: Record<string, number>;
  reasoningLog: string[];
}

function buildReasoningPrompt(observation: PlayerObservation): string {
  return [
    '你是狼人杀玩家，不是旁观者。你只能使用自己可见的信息。',
    '',
    '请在行动前完成多层分析：',
    '1. 事实层：区分已知事实、公开信息、自己的私有信息和猜测。',
    '2. 身份概率层：为关键玩家建立好人/狼人可能性，并说明依据。',
    '3. 正反解释：对主要判断寻找至少一个替代解释，避免单线锁定。',
    '4. 动机层：分析对方发言目的、收益、是否符合其阵营利益。',
    '5. 行为层：分析票型、站边变化、发言节奏、划水、伪装低信息、异常主动攻击。',
    '6. 博弈层：考虑如果我是狼人/好人，当前最佳策略是否一致。',
    '7. 决策层：根据胜率最大化选择发言、投票或技能行动。',
    '',
    '不要输出隐藏身份之外的信息，不要假装知道未公开事件。',
    '最终给出结构化行动。',
    JSON.stringify(observation),
  ].join('\n');
}

export class PlayerAgent {
  constructor(
    readonly playerId: number,
    private readonly provider: LLMProvider,
    readonly memory: PlayerMemory = { observations: [], beliefs: {}, reasoningLog: [] },
  ) {}

  async decide(observation: PlayerObservation): Promise<AgentDecision> {
    this.memory.observations.push(observation);

    const response = await this.provider.chat(
      [{ role: 'system', content: buildReasoningPrompt(observation) }],
      { thinking: true, reasoningEffort: 'high' },
    );

    this.memory.reasoningLog.push(response);

    return {
      action: 'speech',
      summary: [response],
    };
  }
}
