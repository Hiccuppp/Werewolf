import { isGod, isWolf } from './types.ts';
import type { Ballot, Death, GameState } from './types.ts';

export const RULES = `固定12人预女猎守狼王：3狼人、1狼王、预言家/女巫/猎人/守卫各1、4平民。好人清除全部狼获胜；狼屠神或屠民任一获胜。不按人数相等判胜。
夜晚顺序：狼人、守卫、女巫、预言家、统一结算。普通狼可自刀，狼队可刀队友；狼王不投自己。狼队逐人提交意见，票最多为刀口，同票取最小座位号。
守卫可自守，不可连续两夜守同人；允许空守，空守后解除上次限制。女巫解药和毒药各一瓶，每夜最多一瓶；首夜不可自救；解药只救当夜刀口。同守同救的刀口仍死。毒不受守护或解药影响，毒与刀重合按毒死亡，毒杀不触发枪。女巫有解药时可知刀口，无解药时不再告知。
预言家不可查自己，只返回狼人或好人，仅本人可见。夜晚先全部行动再公布死亡，即将死亡的角色仍可当夜行动。
猎人/狼王仅因狼刀或放逐死亡可选择带走一人，可放弃；毒或技能死亡不可开枪。全部同时死亡先标记，再检查技能：猎人是最后神职或狼王是最后狼时不能发动。技能死亡不连锁；每次技能后判断胜负。
不开警长。白天依次发言，再一轮每人可回应的自由讨论，然后所有存活者同时投票（全体收集完才公布）；不能投自己，不弃票；最高票平票仅候选人重投一次（所有活人投票），仍平票不放逐。
每轮死亡/技能结算后判断胜负。隐藏身份、狼队、夜间行动、查验、药水和私有判断。公共只给存活、公布死亡、发言和完整投票结果。最终判断不向玩家揭晓身份。`;

export function leaders(ballots: Ballot[]): number[] {
  const count = new Map<number, number>();
  for (const b of ballots) count.set(b.target, (count.get(b.target) ?? 0) + 1);
  const max = Math.max(0, ...count.values());
  return [...count].filter(([, n]) => n === max).map(([id]) => id).sort((a, b) => a - b);
}
export function nightDeaths(s: GameState): Death[] {
  const deaths: Death[] = [];
  const n = s.night;
  if (n.kill != null && ((n.guard === n.kill) === n.save)) deaths.push({ target: n.kill, cause: 'WOLF_KILL' });
  if (n.poison != null) {
    const index = deaths.findIndex(d => d.target === n.poison);
    if (index >= 0) deaths.splice(index, 1);
    deaths.push({ target: n.poison, cause: 'WITCH_POISON' });
  }
  return deaths.sort((a, b) => a.target - b.target);
}
export function winner(s: GameState): GameState['result'] {
  const alive = s.players.filter(p => p.alive);
  if (!alive.some(p => isWolf(p.role))) return { winner: 'good', reason: '所有狼人出局，好人阵营获胜。' };
  if (!alive.some(p => isGod(p.role))) return { winner: 'wolves', reason: '所有神职出局，狼人屠神获胜。' };
  if (!alive.some(p => p.role === 'villager')) return { winner: 'wolves', reason: '所有平民出局，狼人屠民获胜。' };
  return null;
}
export function canShoot(s: GameState, id: number): boolean {
  const p = s.players.find(p => p.id === id)!;
  if (p.role === 'hunter') return s.players.some(q => q.alive && isGod(q.role));
  if (p.role === 'wolfKing') return s.players.some(q => q.alive && isWolf(q.role));
  return false;
}
export function markDeaths(s: GameState, deaths: Death[]): number[] {
  for (const d of deaths) s.players.find(p => p.id === d.target)!.alive = false;
  return deaths.filter(d => ['WOLF_KILL', 'VOTE_EXECUTION'].includes(d.cause) && canShoot(s, d.target)).map(d => d.target).sort((a, b) => a - b);
}
