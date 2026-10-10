import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { AgentLog, GameEvent, GameState, StepResult } from '../lib/werewolf/types.ts';

export const databasePath = resolve(process.env.DATABASE_PATH || 'data/werewolf.sqlite');
mkdirSync(dirname(databasePath), { recursive: true });
const db = new DatabaseSync(databasePath);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY, created_at TEXT NOT NULL, config TEXT NOT NULL,
    state TEXT NOT NULL, status TEXT NOT NULL, result TEXT, last_error TEXT
  );
  CREATE TABLE IF NOT EXISTS events (
    seq INTEGER PRIMARY KEY AUTOINCREMENT, game_id TEXT NOT NULL REFERENCES games(id), payload TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS events_game_idx ON events(game_id);
  CREATE TABLE IF NOT EXISTS player_logs (
    seq INTEGER PRIMARY KEY AUTOINCREMENT, game_id TEXT NOT NULL REFERENCES games(id), payload TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS logs_game_idx ON player_logs(game_id);
`);
function transaction(write:()=>void) {
  db.exec('BEGIN');
  try { write(); db.exec('COMMIT'); }
  catch (error) { db.exec('ROLLBACK'); throw error; }
}
export function insertGame(state:GameState) {
  db.prepare('INSERT INTO games(id,created_at,config,state,status) VALUES(?,?,?,?,?)').run(state.id,state.createdAt,JSON.stringify(state.config),JSON.stringify(state),'running');
}
export function listGames() {
  return db.prepare('SELECT id,created_at,config,status,result,last_error FROM games ORDER BY created_at DESC LIMIT 50').all().map(r=>({id:r.id,createdAt:r.created_at,config:JSON.parse(String(r.config)),status:r.status,result:r.result?JSON.parse(String(r.result)):null,error:r.last_error}));
}
export function loadGame(id:string) {
  const row=db.prepare('SELECT state,last_error FROM games WHERE id=?').get(id);
  if(!row)return null;
  const events=db.prepare('SELECT payload FROM events WHERE game_id=? ORDER BY seq').all(id).map(r=>JSON.parse(String(r.payload)) as GameEvent);
  return {state:JSON.parse(String(row.state)) as GameState,events,error:row.last_error};
}
export function getLogs(id:string):AgentLog[] { return db.prepare('SELECT payload FROM player_logs WHERE game_id=? ORDER BY seq').all(id).map(r=>JSON.parse(String(r.payload))); }
export function saveStep(id:string,result:StepResult) {
  const {state,events,logs}=result;
  transaction(()=>{
    db.prepare('UPDATE games SET state=?,status=?,result=?,last_error=NULL WHERE id=?').run(JSON.stringify(state),state.stage==='END'?'finished':'running',state.result?JSON.stringify(state.result):null,id);
    const eventStatement=db.prepare('INSERT INTO events(game_id,payload) VALUES(?,?)');
    const logStatement=db.prepare('INSERT INTO player_logs(game_id,payload) VALUES(?,?)');
    for(const event of events)eventStatement.run(id,JSON.stringify(event));
    for(const log of logs)logStatement.run(id,JSON.stringify(log));
  });
}
export function saveError(id:string,message:string,logs:AgentLog[]) {
  transaction(()=>{
    db.prepare('UPDATE games SET last_error=? WHERE id=?').run(message,id);
    const statement=db.prepare('INSERT INTO player_logs(game_id,payload) VALUES(?,?)');
    for(const log of logs)statement.run(id,JSON.stringify(log));
  });
}
export function closeDatabase() { db.close(); }
