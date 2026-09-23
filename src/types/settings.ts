export interface SanLevel {
  level: number;
  /** Topes de monto del nivel, no montos exactos. */
  amounts: number[];
}

export interface ReceivingAccount {
  _id: string;
  bankName: string;
  bankCode: string;
  holderName?: string;
  documentId: string;
  phone: string;
  accountNumber?: string;
  accountType?: "ahorro" | "corriente" | null;
  active: boolean;
}

export interface SanSettings {
  autoCreateSans: boolean;
  membersPerSan: number;
  purpose: string;
  frequencies: string[];
  levels: SanLevel[];
  pointsThresholds: Record<string, number>;
  receivingAccounts: ReceivingAccount[];
  fxCurrency?: "usd" | "eur";
  updatedAt?: string;
}

export interface BcvFxRates {
  usd: number;
  eur: number;
  currency: "usd" | "eur";
  rate: number;
  date?: string;
  updatedAt: string;
  stale?: boolean;
}

export type LevelType = "initial" | "intermediate" | "max";
