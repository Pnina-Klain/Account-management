export interface Receipt {
  id: string;
  receiptNumber: number;
  customerId: string;
  customerName: string;
  date: Date;
  amount: number;
  paymentMethod: PaymentMethod;
  details: string;
  createdAt: Date;
}

export interface CreateReceiptRequest {
  customerId: string;
  date: Date;
  amount: number;
  paymentMethod: PaymentMethod;
  details: string;
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT = 'credit',
  BANK_TRANSFER = 'bank_transfer'
}

export const PaymentMethodLabels = {
  [PaymentMethod.CASH]: 'מזומן',
  [PaymentMethod.CREDIT]: 'אשראי',
  [PaymentMethod.BANK_TRANSFER]: 'העברה בנקאית'
};