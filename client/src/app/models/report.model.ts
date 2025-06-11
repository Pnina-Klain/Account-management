export interface MonthlyReport {
  month: number;
  year: number;
  income: number;
  expenses: number;
  profit: number;
}

export interface YearlyReport {
  year: number;
  income: number;
  expenses: number;
  profit: number;
}

export interface DateRangeReport {
  startDate: Date;
  endDate: Date;
  income: number;
  expenses: number;
  profit: number;
}

export interface CustomerReport {
  customerId: string;
  customerName: string;
  totalIncome: number;
  receiptCount: number;
}

export interface ReportFilters {
  startDate?: Date;
  endDate?: Date;
  customerId?: string;
  year?: number;
  month?: number;
}