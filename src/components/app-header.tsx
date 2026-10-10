import { MoonStar, ArrowUpRight } from 'lucide-react';
export function AppHeader() { return <header className="site-header"><a className="brand" href="/"><span className="brand-icon"><MoonStar size={22}/></span><span>夜局<span className="brand-en">WEREWOLF LAB</span></span><span className="version">MVP</span></a><a className="header-link" href="/">AI 狼人杀实验台 <ArrowUpRight size={14}/></a></header>; }
