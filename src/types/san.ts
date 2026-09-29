export type MemberPaymentStatus = "none" | "pending" | "validated" | "rejected";

export interface SanMember {
  id: string;
  name: string;
  lastName: string;
  photo: string;
  position: number;
  currentPaymentStatus?: MemberPaymentStatus;
  hasPaidCurrentTurn: boolean;
  hasReceivedMoney: boolean;
}

export interface SanDetail {
  id: string;
  sanName: string;
  amount: number;
  startDate: string | null;
  frequency: string;
  fxCurrency?: "usd" | "eur" | null;
  joinMode?: "paid" | "free" | null;
  startMode?: "auto" | "manual" | null;
  installmentAmount?: number;
  adminFeePercent?: number;
  payoutKind?: "cash" | "goods" | null;
  isActive: boolean;
  isOpen: boolean;
  chatEnabled?: boolean;
  createdBy?: string | null;
  currentTurn: number | null;
  nextPaymentTurn?: number | null;
  myTurn: number | null;
  members: SanMember[];
  totalMembers: number;
  membersPerSan?: number;
  lastPaidTurn: number | null;
  nextPaymentDate: string | null;
  paymentAmount?: number;
  baseAmount?: number;
  lateFeeAmount?: number;
  lateFeePercent?: number;
  paymentStatus?: "early" | "ontime" | "late";
  createdAt: string;
  updatedAt: string | null;
  receivingAccount?: {
    _id?: string;
    bankName: string;
    bankCode: string;
    holderName?: string;
    documentId: string;
    phone: string;
    accountNumber?: string;
    accountType?: "ahorro" | "corriente" | null;
    active: boolean;
    isGeneral?: boolean;
  } | null;
}
