export interface Expense {
  id: string;
  date: Date;
  amount: number;
  provider: string;
  details: string;
  proofDocument?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenseRequest {
  date: Date;
  amount: number;
  provider: string;
  details: string;
  proofDocument?: string;
}