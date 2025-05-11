export interface SanMember {
  id: string;
  name: string;
  lastName: string;
  photo: string;
  position: number;
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
  createdAt: string;
  updatedAt: string | null;
}
