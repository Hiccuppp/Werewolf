import test from 'node:test';
import assert from 'node:assert/strict';
import { advance, createGame, playerContext, publicView, TurnError } from '../lib/werewolf/engine.ts';
import { canShoot, markDeaths, nightDeaths, winner } from '../lib/werewolf/rules.ts';
import { CompatibleProvider, DemoProvider } from '../lib/werewolf/provider.ts';
import type { GameEvent, ModelConfig, Role } from '../lib/werewolf/types.ts';
const config: ModelConfig = {mode:'demo',provider:'demo',model:'演示',baseUrl:'',temperature:0};
const roles: Role[] = ['wolf','wolf','wolf','wolfKing','seer','witch','hunter','guard','villager','villager','villager','villager'];
const setup=()=>createGame(config,roles);

test('固定板型配额与三种胜利条件；人数相等不判胜',()=>{
  const s=setup(); assert.equal(s.players.length,12); assert.equal(s.players.filter(p=>p.role==='wolf').length,3);
  s.players.forEach(p=>{if(p.id<=4)p.alive=false;});assert.equal(winner(s)?.winner,'good');
  const gods=setup(); gods.players.forEach(p=>{if(p.id>=5&&p.id<=8)p.alive=false;});assert.match(winner(gods)!.reason,/屠神/);
  const civs=setup();civs.players.forEach(p=>{if(p.id>=9)p.alive=false;});assert.match(winner(civs)!.reason,/屠民/);
  const equal=setup();[5,6,9,10].forEach(id=>equal.players[id-1].alive=false);assert.equal(winner(equal),null);
});
test('守护、解药、同守同救以及毒刀重合',()=>{
  const s=setup();s.night.kill=7;assert.deepEqual(nightDeaths(s),[{target:7,cause:'WOLF_KILL'}]);
  s.night.guard=7;assert.deepEqual(nightDeaths(s),[]);
  s.night.guard=null;s.night.save=true;assert.deepEqual(nightDeaths(s),[]);
  s.night.guard=7;assert.deepEqual(nightDeaths(s),[{target:7,cause:'WOLF_KILL'}]);
  s.night.poison=7;assert.deepEqual(nightDeaths(s),[{target:7,cause:'WITCH_POISON'}]);
  assert.deepEqual(markDeaths(s,nightDeaths(s)),[]);
});
test('猎人、狼王触发来源与最后成员限制',()=>{
  const s=setup();assert.deepEqual(markDeaths(s,[{target:7,cause:'WOLF_KILL'}]),[7]);
  const king=setup();assert.deepEqual(markDeaths(king,[{target:4,cause:'VOTE_EXECUTION'}]),[4]);
  for(const cause of ['WITCH_POISON','SKILL'] as const){const s=setup();assert.deepEqual(markDeaths(s,[{target:7,cause},{target:4,cause}]),[]);}
  const hunter=setup();[5,6,8].forEach(id=>hunter.players[id-1].alive=false);assert.deepEqual(markDeaths(hunter,[{target:7,cause:'WOLF_KILL'}]),[]);
  const lastWolf=setup();[1,2,3].forEach(id=>lastWolf.players[id-1].alive=false);assert.deepEqual(markDeaths(lastWolf,[{target:4,cause:'WOLF_KILL'}]),[]);
  const simultaneous=setup();[5,6].forEach(id=>simultaneous.players[id-1].alive=false);assert.deepEqual(markDeaths(simultaneous,[{target:7,cause:'WOLF_KILL'},{target:8,cause:'WITCH_POISON'}]),[]);
  assert.equal(canShoot(simultaneous,7),false);
});
test('首夜禁自救、药水消耗、连守与查验自身的可见行动限制',async()=>{
  let s=setup();s.stage='WITCH';s.night.kill=6;
  assert.deepEqual(playerContext(s,s.players[5],[]).task.options,['none','poison']);
  s.round=2;assert.ok((playerContext(s,s.players[5],[]).task.options as string[]).includes('save'));
  s.announced=true;s.order=[6];s.cursor=0;
  const saved=await advance(s,[],{chat:async()=>JSON.stringify({action:'save',judgment:'刀口可以救。'})});assert.equal(saved.state.antidote,false);assert.equal(saved.state.night.save,true);
  s=saved.state;s.stage='WITCH';assert.equal('wolfTarget' in playerContext(s,s.players[5],[]).task,false);
  s.stage='GUARD';s.lastGuard=8;assert.ok(!(playerContext(s,s.players[7],[]).task.targets as number[]).includes(8));
  s.stage='SEER';assert.ok(!(playerContext(s,s.players[4],[]).task.targets as number[]).includes(5));
  s.stage='WOLVES';assert.ok((playerContext(s,s.players[0],[]).task.targets as number[]).includes(1));
});
test('公共接口和玩家上下文不泄露身份、夜晚行动、其他玩家记忆或未公布票',()=>{
  const s=setup();s.players[0].memory='WOLF_PRIVATE_SENTINEL';s.players[4].observations=['SEER_PRIVATE_SENTINEL'];s.night.kill=6;s.stage='VOTE';s.votes=[{voter:1,target:8}];
  const secret:GameEvent={id:'secret',at:'now',round:1,stage:'WOLVES',type:'action',visibility:'private',text:'HIDDEN_NIGHT_SENTINEL',actor:1};
  const context=playerContext(s,s.players[8],[secret]);const text=JSON.stringify(context);
  for(const forbidden of ['WOLF_PRIVATE_SENTINEL','SEER_PRIVATE_SENTINEL','HIDDEN_NIGHT_SENTINEL','wolfTarget','night','votes'])assert.ok(!text.includes(forbidden),forbidden);
  assert.equal('teammates' in context,false);assert.ok(context.players.every(p=>!('role' in p)));
  assert.equal(playerContext(s,s.players[0],[]).teammates?.length,4);
  const pub=publicView(s,[secret]);assert.equal(pub.events.length,0);assert.ok(pub.players.every(p=>!('role' in p)));assert.equal('night' in pub,false);
  s.stage='SEER';s.announced=true;s.order=[5];assert.equal(publicView(s,[]).currentActor,null);assert.equal(publicView(s,[]).stage,'NIGHT');
});
test('平票仅候选人重投，再平票无人出局',async()=>{
  let s=setup();s.stage='EXILE';s.votes=[{voter:1,target:9},{voter:2,target:10}];
  let r=await advance(s,[],new DemoProvider());s=r.state;assert.equal(s.stage,'VOTE');assert.equal(s.voteRound,2);assert.deepEqual(s.candidates,[9,10]);
  assert.deepEqual(playerContext(s,s.players[8],[]).task.targets,[10]);
  s.stage='EXILE';s.announced=false;s.votes=[{voter:1,target:9},{voter:2,target:10}];
  r=await advance(s,[],new DemoProvider());assert.equal(r.state.players.filter(p=>p.alive).length,12);assert.equal(r.state.stage,'JUDGE');
});
test('非法模型输出仅修正一次，失败不推进状态并保留输入输出',async()=>{
  const s=setup();let calls=0;
  await assert.rejects(advance(s,[],{chat:async()=>{calls++;return 'not JSON';}}),e=>e instanceof TurnError&&e.logs.length===2&&e.logs.every(l=>!!l.error));
  assert.equal(calls,2);assert.equal(s.steps,0);assert.equal(s.stage,'NIGHT_START');
});
test('兼容接口发送指定模型/温度/独立 messages，Key 只在请求头',async()=>{
  const original=globalThis.fetch;let captured:RequestInit|undefined;let endpoint='';
  globalThis.fetch=async(url,init)=>{endpoint=String(url);captured=init;return Response.json({choices:[{message:{content:'{"ok":true}'}}]});};
  try{const provider=new CompatibleProvider({mode:'llm',provider:'custom',baseUrl:'https://models.example.com/v1/',model:'test-model',temperature:0.4},'TEST_KEY');
    assert.equal(await provider.chat([{role:'user',content:'isolated'}]),'{"ok":true}');assert.equal(endpoint,'https://models.example.com/v1/chat/completions');
    const body=JSON.parse(String(captured!.body));assert.equal(body.model,'test-model');assert.equal(body.temperature,0.4);assert.equal(body.messages.length,1);assert.ok(!String(captured!.body).includes('TEST_KEY'));
  }finally{globalThis.fetch=original;}
});
test('完整对局：12独立玩家、主持、发言、讨论、投票、终局与12份最终判断',async()=>{
  for(let variant=0;variant<3;variant++){
    let s=createGame(config,[...roles.slice(variant),...roles.slice(0,variant)]);const events:GameEvent[]=[];const agents=new Set<number>();
    while(s.stage!=='END'&&s.steps<650){const r=await advance(s,events,new DemoProvider());s=r.state;events.push(...r.events);for(const l of r.logs)agents.add(l.agent);}
    assert.equal(s.stage,'END');assert.ok(s.result);assert.equal(agents.size,13);assert.equal(s.players.filter(p=>p.finalJudgment).length,12);
    for(const type of ['speech','votes','death','result','complete'])assert.ok(events.some(e=>e.type===type),type);
    assert.ok(events.some(e=>e.type==='speech'&&e.stage==='DISCUSSION'));
    assert.equal(s.result?.winner,winner(s)?.winner);
  }
});
