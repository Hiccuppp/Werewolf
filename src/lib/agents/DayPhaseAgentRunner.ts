export interface SpeechContext {
  playerId: number;
  visibleEvents: unknown[];
  memory: unknown;
  belief: unknown;
}

export interface SpeechResult {
  playerId: number;
  content: string;
}

export interface VoteResult {
  playerId: number;
  targetId?: number;
}

export interface DayPhaseAgentRunner {
  generateSpeech(context: SpeechContext): Promise<SpeechResult>;
  generateVote(context: SpeechContext): Promise<VoteResult>;
}
