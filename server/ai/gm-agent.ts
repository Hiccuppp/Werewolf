import type { LLMProvider } from './provider';

export interface GMContext {
  phase: string;
  publicEvents: unknown[];
  alivePlayers: string[];
  availableActions: string[];
}

export interface GMDecision {
  action: string;
  payload?: unknown;
}

const GM_PROMPT = `
你是狼人杀游戏主持人。
你的职责不是替玩家思考，而是严格按照规则推进游戏。

检查顺序:
1. 当前阶段是否合法
2. 玩家技能是否可用
3. 是否产生隐藏信息泄露
4. 是否需要公布事件
5. 是否进入下一阶段

禁止:
- 修改规则
- 暗示玩家身份
- 替玩家做阵营判断
- 提供未公开信息
`;

export class GMAgent {
  constructor(private readonly provider: LLMProvider) {}

  async decide(context: GMContext): Promise<GMDecision> {
    const result = await this.provider.chat([
      { role: 'system', content: GM_PROMPT },
      { role: 'user', content: JSON.stringify(context) },
    ], {
      temperature: 0,
      thinking: true,
      reasoningEffort: 'medium',
    });

    return JSON.parse(result.content) as GMDecision;
  }
}
