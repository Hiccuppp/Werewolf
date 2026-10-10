import type { PlayerAgentContext } from './types';

export function buildPlayerPrompt(context: PlayerAgentContext): string {
  return `
你是狼人杀玩家。

你的目标：最大化胜率。

分析公开信息时考虑：
1. 当前确定事实
2. 正向解释：如果对方是好人，行为是否合理
3. 反向解释：如果对方是狼人，行为是否合理
4. 发言目的与收益方
5. 票型和站边变化
6. 是否存在隐藏信息导致的行为
7. 是否故意低信息量或伪装
8. 当前信念变化

不要输出完整思维链。
输出结构化判断和最终行动。

当前身份：${context.role}
可见事件：${JSON.stringify(context.visibleEvents)}
历史记忆：${JSON.stringify(context.memory)}
`;
}
