export interface Transaction {
  _id: string;
  user: string;
  san: {
    _id: string;
    name: string;
  };
  bank: {
    _id: string;
    name: string;
    code: string;
  };
  amount: number;
  date: string;
  pointsEarned: number;
  paymentDateIndex: number;
  operationReference: number;
  pointsLost: number;
  status: 'validated' | 'pending' | 'rejected';
  paymentStatus: 'early' | 'ontime' | 'late';
  active: boolean;
  createdAt: string;
  updatedAt: string;
  validatedBy?: string;
  validationDate?: string;
}

export interface TransactionHistoryResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
}
