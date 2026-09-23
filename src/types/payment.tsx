export interface PaymentDialogProps {
  open: boolean;
  onDismiss: () => void;
  amount: number;
  san: string;
  fxCurrency?: 'usd' | 'eur' | null;
  isJoin?: boolean;
  baseAmount?: number;
  lateFeeAmount?: number;
  lateFeePercent?: number;
  onPaymentRegistered?: () => void;
}

export interface PaymentFormData {
  sourceBank: string;
  paymentDate: Date;
  amount: number;
  referenceNumber: string;
}

export interface NextPaymentProps {
  id: string;
  name?: string;
  currentTurn: number | null;
  amount: number;
  nextPaymentDate: string | null;
  lastPaidTurn: number;
  fxCurrency?: 'usd' | 'eur' | null;
  paymentAmount?: number;
  baseAmount?: number;
  lateFeeAmount?: number;
  lateFeePercent?: number;
}