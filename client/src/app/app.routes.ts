import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'receipts',
    loadComponent: () => import('./pages/receipts/receipts.component').then(m => m.ReceiptsComponent)
  },
  {
    path: 'receipts/new',
    loadComponent: () => import('./pages/receipts/receipt-form/receipt-form.component').then(m => m.ReceiptFormComponent)
  },
  {
    path: 'expenses',
    loadComponent: () => import('./pages/expenses/expenses.component').then(m => m.ExpensesComponent)
  },
  {
    path: 'expenses/new',
    loadComponent: () => import('./pages/expenses/expense-form/expense-form.component').then(m => m.ExpenseFormComponent)
  },
  {
    path: 'customers',
    loadComponent: () => import('./pages/customers/customers.component').then(m => m.CustomersComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];