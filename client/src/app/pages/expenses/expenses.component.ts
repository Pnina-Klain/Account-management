import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';
import { Observable } from 'rxjs';
import './expenses.component.css'; // הוסף את שורת הייבוא הזו

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./expenses.component.css'],
  template: `
    <div class="fade-in">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">הוצאות</h1>
          <p class="text-gray-600">ניהול הוצאות עסקיות</p>
        </div>
        <a routerLink="/expenses/new" class="btn btn-primary btn-lg">
          <svg class="small-icon ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          הוצאה חדשה
        </a>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">רשימת הוצאות</h3>
        </div>
        <div class="card-body p-0">
          <div class="overflow-x-auto">
            <table class="table">
              <thead class="table-header">
                <tr>
                  <th class="table-header-cell">תאריך</th>
                  <th class="table-header-cell">סכום</th>
                  <th class="table-header-cell">ספק</th>
                  <th class="table-header-cell">פרטים</th>
                  <th class="table-header-cell">אסמכתא</th>
                  <th class="table-header-cell">פעולות</th>
                </tr>
              </thead>
              <tbody class="table-body">
                <tr *ngFor="let expense of expenses$ | async" class="hover:bg-gray-50 transition-colors duration-150">
                  <td class="table-cell">
                    <span class="text-gray-900">{{ expense.date | date:'dd/MM/yyyy' }}</span>
                  </td>
                  <td class="table-cell">
                    <span class="font-semibold text-error-600">₪{{ expense.amount | number:'1.0-0' }}</span>
                  </td>
                  <td class="table-cell">
                    <div class="font-medium text-gray-900">{{ expense.provider }}</div>
                  </td>
                  <td class="table-cell">
                    <span class="text-gray-600 text-sm">{{ expense.details }}</span>
                  </td>
                  <td class="table-cell">
                    <span *ngIf="expense.proofDocument" class="badge badge-success">
                      <svg class="small-icon ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      קיים
                    </span>
                    <span *ngIf="!expense.proofDocument" class="badge bg-gray-100 text-gray-600">
                      לא קיים
                    </span>
                  </td>
                  <td class="table-cell">
                    <div class="flex space-x-2">
                      <button class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        ערוך
                      </button>
                      <button class="text-error-600 hover:text-error-700 text-sm font-medium" (click)="deleteExpense(expense.id)">
                        מחק
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ExpensesComponent implements OnInit {
  expenses$!: Observable<Expense[]>;

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.expenses$ = this.expenseService.getExpenses();
  }

  deleteExpense(id: string) {
    if (confirm('האם אתה בטוח שברצונך למחוק הוצאה זו?')) {
      this.expenseService.deleteExpense(id);
    }
  }
}
