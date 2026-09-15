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
  accountType?: 'ahorro' | 'corriente' | null;
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
  updatedAt?: string;
}

export type LevelType = 'initial' | 'intermediate' | 'max';
