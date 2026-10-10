export type Role = 'wolf' | 'wolfKing' | 'seer' | 'witch' | 'hunter' | 'guard' | 'villager';
export const roleNames: Record<Role, string> = { wolf: '狼人', wolfKing: '狼王', seer: '预言家', witch: '女巫', hunter: '猎人', guard: '守卫', villager: '平民' };
export const isWolf = (role: Role) => role === 'wolf' || role === 'wolfKing';
export const isGod = (role: Role) => ['seer', 'witch', 'hunter', 'guard'].includes(role);
export type Stage = 'NIGHT_START' | 'WOLVES' | 'GUARD' | 'WITCH' | 'SEER' | 'DAWN' | 'SKILLS' | 'SPEECH' | 'DISCUSSION' | 'VOTE' | 'EXILE' | 'JUDGE' | 'REVIEW' | 'END';
export const stageNames: Record<Stage | 'NIGHT', string> = { NIGHT: '夜晚行动', NIGHT_START: '夜幕降临', WOLVES: '狼人行动', GUARD: '守卫行动', WITCH: '女巫行动', SEER: '预言家行动', DAWN: '天亮结算', SKILLS: '死亡技能', SPEECH: '依次发言', DISCUSSION: '自由讨论', VOTE: '放逐投票', EXILE: '放逐结算', JUDGE: '胜负判断', REVIEW: '最终判断', END: '对局结束' };
export interface ModelConfig { mode: 'demo' | 'llm'; provider: string; baseUrl: string; model: string; temperature: number }
export interface Player { id: number; name: string; role: Role; alive: boolean; style: string; memory: string; observations: string[]; finalJudgment?: string }
export type Cause = 'WOLF_KILL' | 'WITCH_POISON' | 'VOTE_EXECUTION' | 'SKILL';
export interface Death { target: number; cause: Cause }
export interface Ballot { voter: number; target: number }
export interface Night { ballots: Ballot[]; kill: number | null; guard: number | null; save: boolean; poison: number | null; check: number | null }
export interface GameState {
  id: string; createdAt: string; config: ModelConfig; round: number; stage: Stage; announced: boolean; order: number[]; cursor: number;
  players: Player[]; night: Night; antidote: boolean; poison: boolean; lastGuard: number | null; votes: Ballot[]; voteRound: number; candidates: number[];
  skills: number[]; nextAfterJudge: 'SPEECH' | 'NIGHT_START'; result: null | { winner: 'good' | 'wolves'; reason: string }; steps: number;
}
export interface GameEvent { id: string; at: string; round: number; stage: Stage; type: string; visibility: 'public' | 'private'; actor?: number; text: string; data?: unknown }
export interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string }
export interface AgentLog { id: string; at: string; round: number; stage: Stage; agent: number; task: string; config: ModelConfig; input: ChatMessage[]; output: string; error?: string }
export interface LLMProvider { chat(messages: ChatMessage[]): Promise<string> }
export interface StepResult { state: GameState; events: GameEvent[]; logs: AgentLog[] }
export interface PlayerOutput { action: string; target?: number | null; speech?: string; judgment: string }
export interface HostOutput { command: Stage; order?: number[]; deaths?: Death[]; exile?: number | null; winner?: 'good' | 'wolves' | null; reason: string }
