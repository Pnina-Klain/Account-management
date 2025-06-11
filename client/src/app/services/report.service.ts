import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { ReceiptService } from './receipt.service';
import { ExpenseService } from './expense.service';
import { CustomerService } from './customer.service';
import { MonthlyReport, YearlyReport, DateRangeReport, CustomerReport, ReportFilters } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(
    private receiptService: ReceiptService,
    private expenseService: ExpenseService,
    private customerService: CustomerService
  ) {}

  getMonthlyReports(year: number): Observable<MonthlyReport[]> {
    return combineLatest([
      this.receiptService.getReceipts(),
      this.expenseService.getExpenses()
    ]).pipe(
      map(([receipts, expenses]) => {
        const reports: MonthlyReport[] = [];
        
        for (let month = 1; month <= 12; month++) {
          const monthlyIncome = receipts
            .filter(r => r.date.getFullYear() === year && r.date.getMonth() === month - 1)
            .reduce((sum, r) => sum + r.amount, 0);
          
          const monthlyExpenses = expenses
            .filter(e => e.date.getFullYear() === year && e.date.getMonth() === month - 1)
            .reduce((sum, e) => sum + e.amount, 0);
          
          reports.push({
            month,
            year,
            income: monthlyIncome,
            expenses: monthlyExpenses,
            profit: monthlyIncome - monthlyExpenses
          });
        }
        
        return reports;
      })
    );
  }

  getYearlyReports(): Observable<YearlyReport[]> {
    return combineLatest([
      this.receiptService.getReceipts(),
      this.expenseService.getExpenses()
    ]).pipe(
      map(([receipts, expenses]) => {
        const yearlyData = new Map<number, { income: number; expenses: number }>();
        
        receipts.forEach(receipt => {
          const year = receipt.date.getFullYear();
          const data = yearlyData.get(year) || { income: 0, expenses: 0 };
          data.income += receipt.amount;
          yearlyData.set(year, data);
        });
        
        expenses.forEach(expense => {
          const year = expense.date.getFullYear();
          const data = yearlyData.get(year) || { income: 0, expenses: 0 };
          data.expenses += expense.amount;
          yearlyData.set(year, data);
        });
        
        return Array.from(yearlyData.entries()).map(([year, data]) => ({
          year,
          income: data.income,
          expenses: data.expenses,
          profit: data.income - data.expenses
        })).sort((a, b) => b.year - a.year);
      })
    );
  }

  getDateRangeReport(startDate: Date, endDate: Date): Observable<DateRangeReport> {
    return combineLatest([
      this.receiptService.getReceipts(),
      this.expenseService.getExpenses()
    ]).pipe(
      map(([receipts, expenses]) => {
        const income = receipts
          .filter(r => r.date >= startDate && r.date <= endDate)
          .reduce((sum, r) => sum + r.amount, 0);
        
        const expensesTotal = expenses
          .filter(e => e.date >= startDate && e.date <= endDate)
          .reduce((sum, e) => sum + e.amount, 0);
        
        return {
          startDate,
          endDate,
          income,
          expenses: expensesTotal,
          profit: income - expensesTotal
        };
      })
    );
  }

  getCustomerReports(): Observable<CustomerReport[]> {
    return combineLatest([
      this.receiptService.getReceipts(),
      this.customerService.getCustomers()
    ]).pipe(
      map(([receipts, customers]) => {
        return customers.map(customer => {
          const customerReceipts = receipts.filter(r => r.customerId === customer.id);
          const totalIncome = customerReceipts.reduce((sum, r) => sum + r.amount, 0);
          
          return {
            customerId: customer.id,
            customerName: customer.name,
            totalIncome,
            receiptCount: customerReceipts.length
          };
        }).sort((a, b) => b.totalIncome - a.totalIncome);
      })
    );
  }

  getDashboardStats(): Observable<{
    totalIncome: number;
    totalExpenses: number;
    totalProfit: number;
    totalCustomers: number;
    totalReceipts: number;
    monthlyIncome: number;
    monthlyExpenses: number;
  }> {
    return combineLatest([
      this.receiptService.getReceipts(),
      this.expenseService.getExpenses(),
      this.customerService.getCustomers()
    ]).pipe(
      map(([receipts, expenses, customers]) => {
        const totalIncome = receipts.reduce((sum, r) => sum + r.amount, 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyIncome = receipts
          .filter(r => r.date.getMonth() === currentMonth && r.date.getFullYear() === currentYear)
          .reduce((sum, r) => sum + r.amount, 0);
        
        const monthlyExpenses = expenses
          .filter(e => e.date.getMonth() === currentMonth && e.date.getFullYear() === currentYear)
          .reduce((sum, e) => sum + e.amount, 0);
        
        return {
          totalIncome,
          totalExpenses,
          totalProfit: totalIncome - totalExpenses,
          totalCustomers: customers.length,
          totalReceipts: receipts.length,
          monthlyIncome,
          monthlyExpenses
        };
      })
    );
  }
}