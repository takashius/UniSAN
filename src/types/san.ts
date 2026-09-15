export type MemberPaymentStatus = 'none' | 'pending' | 'validated' | 'rejected';

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
  isActive: boolean;
  isOpen: boolean;
  currentTurn: number | null;
  myTurn: number | null;
  members: SanMember[];
  totalMembers: number;
  lastPaidTurn: number | null;
  nextPaymentDate: string | null;
  createdAt: string;
  updatedAt: string | null;
}
