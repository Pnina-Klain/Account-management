import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./dashboard.component.css'], // הוסף כאן את קובץ ה-CSS
  template: `
    <div class="fade-in">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">לוח בקרה</h1>
        <p class="text-gray-600">סקירה כללית של המערכת</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" *ngIf="dashboardStats$ | async as stats">
        <div class="card hover:shadow-medium transition-shadow duration-200">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                  <svg class="small-icon text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
              </div>
              <div class="mr-4">
                <p class="text-sm font-medium text-gray-600">סה"כ הכנסות</p>
                <p class="text-2xl font-bold text-gray-900">₪{{ stats.totalIncome | number:'1.0-0' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card hover:shadow-medium transition-shadow duration-200">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-error-100 rounded-lg flex items-center justify-center">
                  <svg class="small-icon text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="mr-4">
                <p class="text-sm font-medium text-gray-600">סה"כ הוצאות</p>
                <p class="text-2xl font-bold text-gray-900">₪{{ stats.totalExpenses | number:'1.0-0' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card hover:shadow-medium transition-shadow duration-200">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg class="small-icon text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
              </div>
              <div class="mr-4">
                <p class="text-sm font-medium text-gray-600">רווח נקי</p>
                <p class="text-2xl font-bold" [class]="stats.totalProfit >= 0 ? 'text-success-600' : 'text-error-600'">
                  ₪{{ stats.totalProfit | number:'1.0-0' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="card hover:shadow-medium transition-shadow duration-200">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                  <svg class="small-icon text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="mr-4">
                <p class="text-sm font-medium text-gray-600">לקוחות</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.totalCustomers }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">פעולות מהירות</h3>
          </div>
          <div class="card-body">
            <div class="space-y-4">
              <a routerLink="/receipts/new" class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div class="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center ml-4">
                  <svg class="small-icon text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">הוצאת קבלה חדשה</p>
                  <p class="text-sm text-gray-600">צור קבלה חדשה ללקוח</p>
                </div>
              </a>

              <a routerLink="/expenses/new" class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div class="w-10 h-10 bg-error-100 rounded-lg flex items-center justify-center ml-4">
                  <svg class="small-icon text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">רישום הוצאה חדשה</p>
                  <p class="text-sm text-gray-600">הוסף הוצאה עסקית חדשה</p>
                </div>
              </a>

              <a routerLink="/customers" class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center ml-4">
                  <svg class="small-icon text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">ניהול לקוחות</p>
                  <p class="text-sm text-gray-600">הוסף או ערוך פרטי לקוחות</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div class="card" *ngIf="dashboardStats$ | async as stats">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">סטטיסטיקות החודש</h3>
          </div>
          <div class="card-body">
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">הכנסות החודש</span>
                <span class="font-semibold text-success-600">₪{{ stats.monthlyIncome | number:'1.0-0' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">הוצאות החודש</span>
                <span class="font-semibold text-error-600">₪{{ stats.monthlyExpenses | number:'1.0-0' }}</span>
              </div>
              <div class="border-t pt-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-900 font-medium">רווח החודש</span>
                  <span class="font-bold text-lg" [class]="(stats.monthlyIncome - stats.monthlyExpenses) >= 0 ? 'text-success-600' : 'text-error-600'">
                    ₪{{ (stats.monthlyIncome - stats.monthlyExpenses) | number:'1.0-0' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">פעילות אחרונה</h3>
        </div>
        <div class="card-body">
          <div class="text-center py-8 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <p class="mt-2">אין פעילות אחרונה להצגה</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  dashboardStats$!: Observable<any>;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.dashboardStats$ = this.reportService.getDashboardStats();
  }
}
