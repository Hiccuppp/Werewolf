import { getLogs, insertGame, listGames, loadGame, saveError, saveStep } from './repository.ts';
import { advance, createGame, publicView, TurnError } from '../lib/werewolf/engine.ts';
import { makeProvider, readConfig } from '../lib/werewolf/provider.ts';
import { startAIGameApi } from './ai/ai-game-api.ts';

const runningTurns=new Set<string>();
const json=(body:unknown,status=200,headers:Record<string,string>={})=>Response.json(body,{status,headers:{'Cache-Control':'no-store',...headers}});
export async function handleApi(request:Request):Promise<Response> {
  const url=new URL(request.url), method=request.method;

  if(url.pathname==='/api/games/ai/start') {
    if(method!=='POST') return json({error:'不支持的请求方法。'},405);
    try {
      const body=await request.json().catch(()=>({})) as Record<string,unknown>;
      const result=await startAIGameApi({
        boardId: typeof body.boardId==='string'?body.boardId:undefined,
        maxRounds: typeof body.maxRounds==='number'?body.maxRounds:undefined,
        provider: typeof body.provider==='string'?body.provider:undefined,
        model: typeof body.model==='string'?body.model:undefined,
        reasoning: body.reasoning==='off'||body.reasoning==='standard'||body.reasoning==='deep'?body.reasoning:undefined,
      });
      return json(result,201);
    } catch(error) {
      return json({error:error instanceof Error?error.message:'启动失败。'},500);
    }
  }

  if(url.pathname==='/api/games') {
    if(method==='GET')return json(listGames());
    if(method==='POST'){
      try { const state=createGame(readConfig(await request.json()));insertGame(state);return json({id:state.id},201); }
      catch(error) { return json({error:error instanceof Error?error.message:'创建失败。'},400); }
    }
  }
  const match=url.pathname.match(/^\/api\/games\/([a-f0-9-]+)(\/step)?$/i);
  if(!match)return json({error:'接口不存在。'},404);
  const id=match[1];
  const game=loadGame(id);
  if(!game)return json({error:'找不到这局游戏。'},404);
  if(!match[2]&&method==='GET'){
    const god=url.searchParams.get('view')==='god', download=url.searchParams.get('download')==='1';
    const data=god?{...game.state,events:game.events,currentActor:game.state.announced?game.state.order[game.state.cursor]??null:null,...(url.searchParams.get('logs')==='1'||download?{logs:getLogs(id)}:{})}:publicView(game.state,game.events);
    const headers:Record<string,string>={};
    if(download)headers['Content-Disposition']=`attachment; filename="werewolf-${id.slice(0,8)}-${god?'full':'public'}.json"`;
    return json({...data,error:game.error,busy:runningTurns.has(id)},200,headers);
  }
  if(match[2]&&method==='POST'){
    if(runningTurns.has(id))return json({error:'当前对局正在推进，请稍后。'},409);
    runningTurns.add(id);
    try {
      const body=await request.json().catch(()=>({})) as {apiKey?:unknown}|null;
      const result=await advance(game.state,game.events,makeProvider(game.state.config,typeof body?.apiKey==='string'?body.apiKey:''));
      saveStep(id,result);
      return json({ok:true,finished:result.state.stage==='END'});
    } catch(error) {
      const message=error instanceof Error?error.message:'推进失败，请重试。';
      saveError(id,message,error instanceof Error&&error instanceof TurnError?error.logs:[]);
      return json({error:message},502);
    } finally { runningTurns.delete(id); }
  }
  return json({error:'不支持的请求方法。'},405);
}
