declare class LimitX {
  constructor(options?: LimitX.Options);
  consume(key: string, weight?: number): LimitX.ConsumeResult;
  getTokens(key: string): number;
  reset(key: string): void;
  stop(): void;
}

declare namespace LimitX {
  interface Options {
    capacity?: number;
    refillRate?: number;
    idleTTL?: number;
    cleanupInterval?: number;
    onAllow?: (key: string, info: HookInfo) => void;
    onReject?: (key: string, info: HookInfo) => void;
    onRefill?: (info: HookInfo) => void;
  }

  interface HookInfo {
    tokens: number;
    capacity?: number;
    consumed?: number;
  }

  interface ConsumeResult {
    allowed: boolean;
    remaining: number;
  }
}

export = LimitX;
