// Real local HTTP server + real SQLite file, with the explicit offline demo provider.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const temporary=await mkdtemp(join(tmpdir(),'werewolf-test-'));
const dbPath=join(temporary,'test.sqlite');
function launch(){return new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,['--experimental-strip-types','server/index.ts'],{cwd:root,env:{...process.env,PORT:'0',HOST:'127.0.0.1',DATABASE_PATH:dbPath},stdio:['ignore','pipe','pipe']});
  let output='',errors='',ready=false;
  const timer=setTimeout(()=>{child.kill();reject(new Error('Local server did not start: '+errors));},15000);
  child.stdout.on('data',data=>{output+=data;const match=output.match(/http:\/\/127\.0\.0\.1:\d+/);if(match&&!ready){ready=true;clearTimeout(timer);resolve({child,base:match[0]});}});
  child.stderr.on('data',data=>{errors+=data;});
  child.once('error',error=>{clearTimeout(timer);reject(error);});
  child.once('exit',code=>{if(!ready){clearTimeout(timer);reject(new Error('Server exited '+code+': '+errors));}});
});}
let app;
async function stop(){if(app){const child=app.child;app=null;const exited=once(child,'exit');child.kill('SIGTERM');await exited;}}
async function api(path,body){const response=await fetch(app.base+path,body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});assert.equal(response.ok,true,`${response.status} ${path}`);return response;}
try{
  app=await launch();
  assert.match(await (await api('/')).text(),/id="root"/);
  const {id}=await (await api('/api/games',{mode:'demo'})).json();
  let finished=false;
  for(let i=0;i<650;i++){const next=await (await api(`/api/games/${id}/step`,{})).json();if(next.finished){finished=true;break;}}
  assert.ok(finished,'Game must finish');
  const pub=await (await api(`/api/games/${id}`)).json();
  assert.equal(pub.stage,'END');assert.ok(pub.result);assert.equal('night' in pub,false);assert.equal('logs' in pub,false);
  assert.ok(pub.players.every(p=>!('role' in p)));assert.ok(pub.events.every(e=>e.visibility==='public'));
  const download=await api(`/api/games/${id}?view=god&download=1`);
  assert.match(download.headers.get('content-disposition'),/attachment/);
  const full=await download.json();
  assert.equal(full.players.filter(p=>p.finalJudgment).length,12);
  assert.equal(new Set(full.logs.map(log=>log.agent)).size,13);
  assert.ok(full.events.some(e=>e.type==='votes'));assert.ok(full.events.some(e=>e.type==='speech'&&e.stage==='DISCUSSION'));
  assert.ok((await stat(dbPath)).size>0);
  for(const path of [`/game/${id}`,`/game/${id}/god`])assert.match(await (await api(path)).text(),/id="root"/);
  await stop();
  app=await launch();
  const restored=await (await api(`/api/games/${id}?view=god&logs=1`)).json();
  assert.equal(restored.stage,'END');assert.deepEqual(restored.result,full.result);assert.equal(restored.logs.length,full.logs.length);assert.equal(restored.events.length,full.events.length);
  console.log(JSON.stringify({passed:true,rounds:full.round,steps:full.steps,events:full.events.length,agentLogs:full.logs.length,finalJudgments:12,restartPersistence:true,publicInformationIsolation:true,jsonExport:true},null,2));
}finally{await stop();await rm(temporary,{recursive:true,force:true});}
