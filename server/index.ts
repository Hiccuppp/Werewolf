import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApi } from './api.ts';
import { closeDatabase, databasePath } from './repository.ts';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const development=process.argv.includes('--dev');
const dist=resolve(root,'dist');
const port=Number(process.env.PORT||3000), host=process.env.HOST||'127.0.0.1';
if(!development&&!existsSync(resolve(dist,'index.html'))){console.error('请先运行 npm run build，然后 npm start。');closeDatabase();process.exit(1);}
const vite=development?await (await import('vite')).createServer({root,server:{middlewareMode:true},appType:'spa'}):null;
const mime:Record<string,string>={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.woff2':'font/woff2'};
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url||'/','http://localhost');
    if(url.pathname.startsWith('/api/')){
      // Only the local app should initiate writes; normal same-origin browser fetches pass.
      if(req.method==='POST'&&req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host){res.writeHead(403,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'不允许跨站写入。'}));return;}
      const chunks:Buffer[]=[];let size=0;
      for await(const chunk of req){size+=chunk.length;if(size>1024*1024){res.writeHead(413);res.end('Request too large');return;}chunks.push(chunk);}
      const body=Buffer.concat(chunks);
      const response=await handleApi(new Request(url,{method:req.method,headers:{'Content-Type':'application/json'},...(body.length?{body:body.toString('utf8')}:{})}));
      res.writeHead(response.status,Object.fromEntries(response.headers.entries()));res.end(await response.text());return;
    }
    if(vite){vite.middlewares(req,res,()=>{res.writeHead(404);res.end('Not found');});return;}
    if(!['GET','HEAD'].includes(req.method||'')){res.writeHead(405);res.end();return;}
    const pathname=decodeURIComponent(url.pathname);
    const page=pathname==='/'||/^\/game\/[a-f0-9-]+(?:\/god)?\/?$/i.test(pathname);
    const file=page?resolve(dist,'index.html'):resolve(dist,'.'+pathname);
    if(!file.startsWith(dist+sep)){res.writeHead(403);res.end('Forbidden');return;}
    try{const content=await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':page?'no-cache':'public, max-age=3600'});res.end(req.method==='HEAD'?undefined:content);}catch{res.writeHead(404);res.end('Not found');}
  }catch(error){console.error(error instanceof Error?error.message:'Server error');if(!res.headersSent)res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'服务器发生错误，请查看本地终端。'}));}
});
server.listen(port,host,()=>{console.log(`AIWerewolf 本地服务：http://${host}:${(server.address() as AddressInfo).port}`);console.log(`数据库：${databasePath}`);});
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
let closing=false;
async function stop(){if(closing)return;closing=true;server.close();await vite?.close();closeDatabase();process.exit(0);}
process.on('SIGINT',()=>void stop());process.on('SIGTERM',()=>void stop());
