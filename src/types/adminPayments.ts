export interface PaymentUserRef {
  _id: string;
  name?: string;
  lastName?: string;
  email?: string;
}

export interface PaymentSanRef {
  _id: string;
  name?: string;
  amount?: number;
}

export interface PaymentBankRef {
  _id: string;
  name?: string;
  code?: string;
}

export interface AdminPayment {
  _id: string;
  user: PaymentUserRef | null;
  san: PaymentSanRef | null;
  bank: PaymentBankRef | null;
  amount: number;
  baseAmount?: number;
  lateFeeAmount?: number;
  lateFeePercent?: number;
  date: string;
  paymentDateIndex: number;
  operationReference: number;
  status: string;
  paymentStatus: string;
  operationImage?: string | null;
}

export interface AdminPaymentListResponse {
  results: AdminPayment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ValidatePaymentResponse {
  transaction: AdminPayment;
  pointsEarned: number;
  pointsLost: number;
  newPoints: number;
  newLevel: number;
}
