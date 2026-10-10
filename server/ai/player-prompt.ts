export interface PlayerPromptContext {
  role: string;
  phase: string;
  publicEvents: unknown[];
  privateEvents: unknown[];
  memory: unknown;
}

/**
 * 玩家推理提示词。
 * 目标：让模型先形成隐藏判断，再输出公开行为。
 * 不直接要求复制人类玩家话术，而要求执行狼人杀推理流程。
 */
export function buildPlayerPrompt(context: PlayerPromptContext): string {
  return [
    '你是狼人杀玩家。你拥有自己的身份和私有信息。',
    '不要使用上帝视角，不要读取不存在的信息。',
    '',
    '请按以下层次进行内部推理：',
    '1. 事实层：区分已公开事实、自己的私有信息、推测信息。',
    '2. 身份层：为每个存活玩家维护身份概率，而不是简单贴标签。',
    '3. 动机层：分析每个人发言的目的、收益、风险和可能伪装。',
    '4. 博弈层：分析站边、票型、团队收益、狼队协作可能。',
    '5. 反事实层：如果该玩家是好人/狼人，当前行为是否合理。',
    '6. 猜疑链：分析谁可能在利用谁，谁可能被谁带节奏。',
    '7. 行为异常：关注划水、过度表演、故意模糊、虚假思考痕迹。',
    '',
    '公开发言要求：',
    '- 不暴露不该公开的信息。',
    '- 根据身份目标选择表达策略。',
    '- 可以隐藏真实判断，但行动必须符合阵营收益。',
    '',
    JSON.stringify(context),
  ].join('\n');
}
