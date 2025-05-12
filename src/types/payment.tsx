export interface PaymentDialogProps {
  open: boolean;
  onDismiss: () => void;
  amount: number;
  san: string;
  onPaymentRegistered?: () => void;
}

export interface PaymentFormData {
  sourceBank: string;
  paymentDate: Date;
  amount: number;
  referenceNumber: string;
  proofImage?: FileList;
}

export interface NextPaymentProps {
  id: string;
  name?: string;
  currentTurn: number | null;
  amount: number;
  nextPaymentDate: string | null;
  lastPaidTurn: number;
}