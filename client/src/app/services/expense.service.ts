import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Expense, CreateExpenseRequest } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private expenses: Expense[] = [
    {
      id: '1',
      date: new Date('2024-01-25'),
      amount: 500,
      provider: 'חברת החשמל',
      details: 'חשבון חשמל',
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25')
    },
    {
      id: '2',
      date: new Date('2024-02-20'),
      amount: 1200,
      provider: 'משרד עורכי דין',
      details: 'ייעוץ משפטי',
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-02-20')
    },
    {
      id: '3',
      date: new Date('2024-03-15'),
      amount: 800,
      provider: 'חברת ניקיון',
      details: 'שירותי ניקיון משרד',
      createdAt: new Date('2024-03-15'),
      updatedAt: new Date('2024-03-15')
    }
  ];

  private expensesSubject = new BehaviorSubject<Expense[]>(this.expenses);
  public expenses$ = this.expensesSubject.asObservable();

  getExpenses(): Observable<Expense[]> {
    return this.expenses$;
  }

  getExpenseById(id: string): Expense | undefined {
    return this.expenses.find(expense => expense.id === id);
  }

  createExpense(expenseData: CreateExpenseRequest): Expense {
    const newExpense: Expense = {
      id: (this.expenses.length + 1).toString(),
      ...expenseData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.expenses.push(newExpense);
    this.expensesSubject.next([...this.expenses]);
    return newExpense;
  }

  updateExpense(id: string, expenseData: Partial<CreateExpenseRequest>): Expense | null {
    const index = this.expenses.findIndex(expense => expense.id === id);
    if (index === -1) return null;

    this.expenses[index] = {
      ...this.expenses[index],
      ...expenseData,
      updatedAt: new Date()
    };

    this.expensesSubject.next([...this.expenses]);
    return this.expenses[index];
  }

  deleteExpense(id: string): boolean {
    const index = this.expenses.findIndex(expense => expense.id === id);
    if (index === -1) return false;

    this.expenses.splice(index, 1);
    this.expensesSubject.next([...this.expenses]);
    return true;
  }

  getExpensesByDateRange(startDate: Date, endDate: Date): Expense[] {
    return this.expenses.filter(expense => 
      expense.date >= startDate && expense.date <= endDate
    );
  }

  getTotalExpensesByMonth(year: number, month: number): number {
    return this.expenses
      .filter(expense => 
        expense.date.getFullYear() === year && 
        expense.date.getMonth() === month - 1
      )
      .reduce((total, expense) => total + expense.amount, 0);
  }

  getTotalExpensesByYear(year: number): number {
    return this.expenses
      .filter(expense => expense.date.getFullYear() === year)
      .reduce((total, expense) => total + expense.amount, 0);
  }
}