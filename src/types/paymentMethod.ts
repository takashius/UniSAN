export interface Bank {
  _id: string;
  name: string;
  code: string;
}

export interface PaymentMethod {
  _id: string;
  userId: string;
  title: string;
  bank: Bank;
  method: 'transferencia' | 'pago_movil';
  idNumber: string;
  accountNumber?: string;
  accountType?: string;
  phoneNumber?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaymentMethodCreate {
  title: string;
  bank: string;
  method: 'transferencia' | 'pago_movil';
  idNumber: string;
  accountNumber?: string;
  accountType?: string;
  phoneNumber?: string;
}

export interface PaymentMethodUpdate extends Partial<PaymentMethodCreate> {
  active?: boolean;
} 