export type NightActionType =
  | 'wolf_kill'
  | 'seer_check'
  | 'witch_save'
  | 'witch_poison'
  | 'guard_protect';

export interface NightActionRequest {
  playerId: string;
  role: string;
  action: NightActionType;
  targetId?: string;
}

export interface NightActionResult {
  playerId: string;
  action: NightActionType;
  targetId?: string;
  success: boolean;
  metadata?: Record<string, unknown>;
}

export class NightActionRuntime {
  async execute(request: NightActionRequest): Promise<NightActionResult> {
    return {
      playerId: request.playerId,
      action: request.action,
      targetId: request.targetId,
      success: true,
      metadata: {
        role: request.role,
      },
    };
  }

  async executeBatch(
    requests: NightActionRequest[],
  ): Promise<NightActionResult[]> {
    return Promise.all(requests.map((request) => this.execute(request)));
  }
}

export async function executeNightActions(
  requests: NightActionRequest[],
): Promise<NightActionResult[]> {
  return new NightActionRuntime().executeBatch(requests);
}
