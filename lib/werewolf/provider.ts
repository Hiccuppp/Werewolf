import { hostExpected } from './engine.ts';
import type { ChatMessage, GameState, LLMProvider, ModelConfig } from './types.ts';

export class CompatibleProvider implements LLMProvider {
  private config: ModelConfig;
  private apiKey: string;
  constructor(config: ModelConfig, apiKey: string) { this.config = config; this.apiKey = apiKey; }
  async chat(messages: ChatMessage[]): Promise<string> {
    if (!this.apiKey) throw new Error('请填写本局模型的 API Key。');
    const base = this.config.baseUrl.replace(/\/+$/, '');
    const endpoint = base.endsWith('/chat/completions') ? base : `${base}/chat/completions`;
    let response: Response;
    try {
      response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` }, body: JSON.stringify({ model: this.config.model, messages, temperature: this.config.temperature, stream: false }), signal: AbortSignal.timeout(90000) });
    } catch (error) { throw new Error(error instanceof Error && error.name === 'TimeoutError' ? '模型请求超过90秒，请重试或换用更快的模型。' : '无法连接模型 API，请检查 Base URL 或稍后重试。'); }
    if (!response.ok) {
      let detail = ''; try { const body = await response.json() as { error?: { message?: string } }; detail = (body.error?.message ?? '').split(this.apiKey).join('[redacted]').slice(0, 200); } catch {}
      throw new Error(`模型 API 返回 ${response.status}${detail ? `：${detail}` : '，请检查接口地址、Key、模型名和余额。'}`);
    }
    const body = await response.json() as { choices?: { message?: { content?: string } }[] };
    const content = body.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) throw new Error('模型未返回文本。请使用支持 Chat Completions 文本输出的模型。');
    return content;
  }
}

// Offline demo, receiving exactly the same filtered messages as real players.
export class DemoProvider implements LLMProvider {
  async chat(messages: ChatMessage[]): Promise<string> {
    const input = JSON.parse(messages[1].content);
    if (input.agent === 'host') {
      const s = input.state as GameState, out = hostExpected(s);
      if (['SPEECH', 'DISCUSSION'].includes(s.stage) && out.order!.length) { const n = (s.round - 1) % out.order!.length; out.order = [...out.order!.slice(n), ...out.order!.slice(0,n)]; }
      return JSON.stringify(out);
    }
    const { self, task, round, publicHistory, observations } = input;
    const team = (input.teammates ?? []).map((p: { id: number }) => p.id);
    const alive = input.players.filter((p: { alive: boolean }) => p.alive).map((p: { id: number }) => p.id);
    const directWolf = observations.map((s: string) => s.match(/查验(\d+)号：狼人/)).filter(Boolean).map((m: string[]) => Number(m[1]));
    const publicWolves = publicHistory.filter((e: { type: string }) => e.type === 'speech').flatMap((e: { text: string }) => [...e.text.matchAll(/查验(\d+)号：狼人/g)].map(m=>Number(m[1])));
    const targets: number[] = task.targets ?? [];
    const suspected = [...directWolf, ...publicWolves].find(id => targets.includes(id) && !team.includes(id));
    const options = targets.filter(id => !team.includes(id));
    let target: number | null = suspected ?? options[(self.id + round) % (options.length || 1)] ?? targets[0] ?? null;
    let action = task.action, speech: string | undefined;
    if (action === 'kill') target = options[(round - 1) % (options.length || 1)] ?? targets[0];
    if (action === 'guard') target = targets.includes(self.id) ? self.id : targets[(round - 1) % targets.length];
    if (action === 'check') { const checked = observations.map((o: string)=>Number(o.match(/查验(\d+)号/)?.[1])); target = targets.find(id=>!checked.includes(id)) ?? targets[0]; }
    if (action === 'witch') {
      if (task.options.includes('save')) { action = 'save'; target = null; }
      else if (task.options.includes('poison') && (suspected || round >= 3)) { action = 'poison'; target = suspected ?? targets.find(id=>id!==self.id)!; }
      else { action = 'none'; target = null; }
    }
    const previous = publicHistory.filter((e: { type: string, actor: number })=>e.type==='speech' && e.actor!==self.id).at(-1);
    if (action === 'speak') {
      if (self.role === 'seer' && observations.length) speech = `我是预言家，${observations.join('；')}。请结合查验和投票记录判断，优先处理查验为狼的玩家。`;
      else if (self.camp === '狼人') speech = `我目前是好人视角。${previous ? `刚才${previous.actor}号的结论我会继续核对，` : '首轮信息有限，'}我更关注发言前后是否一致，先比较票型，不急着认定任何身份。`;
      else if (publicWolves.some((id:number)=>alive.includes(id))) speech = '公开发言里有人报出狼查验，我会优先核实这些信息。也请被点到的玩家正面回应，投票时结合发言和已有查验。';
      else speech = `${previous ? `我听到了${previous.actor}号的发言。` : '现在公开信息还比较少。'}第${round}轮我会关注谁在回避问题、谁的票型和发言不一致。先把大家的逻辑听完整。`;
    }
    const judgment = self.role === 'seer' && observations.length ? `已掌握的查验：${observations.join('；')}。其余身份仍需结合公开发言。` : `${self.camp === '狼人' ? `已知狼队：${team.join('、')}号；优先争取放逐非队友。` : '尚不能确定全部身份，重点参考公开查验和投票。'}${suspected ? `目前最怀疑${suspected}号。` : ''}`;
    return JSON.stringify({ action, target, speech, judgment });
  }
}
export function makeProvider(config: ModelConfig, apiKey = ''): LLMProvider { return config.mode === 'demo' ? new DemoProvider() : new CompatibleProvider(config, apiKey); }

export function readConfig(input: unknown): ModelConfig {
  const value = input as Partial<ModelConfig>;
  if (!value || !['demo', 'llm'].includes(value.mode!)) throw new Error('请选择演示或真实模型模式。');
  if (value.mode === 'demo') return { mode: 'demo', provider: 'demo', model: '离线演示', baseUrl: '', temperature: 0 };
  const url = new URL(String(value.baseUrl ?? ''));
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('Base URL 必须是 HTTP(S) 模型接口，不含密码、查询参数或片段。');
  const temperature = Number(value.temperature);
  if (!Number.isFinite(temperature) || temperature < 0 || temperature > 2) throw new Error('温度必须在0到2之间。');
  if (!value.model?.trim()) throw new Error('请输入模型名称。');
  return { mode: 'llm', provider: String(value.provider || 'custom'), baseUrl: url.toString().replace(/\/$/, ''), model: value.model.trim(), temperature };
}
