import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { CustomerService } from '../../services/customer.service';
import { MonthlyReport, YearlyReport, DateRangeReport, CustomerReport } from '../../models/report.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./report.component.css'],
  template: `
    <div class="fade-in">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">דוחות</h1>
        <p class="text-gray-600">ניתוח נתונים פיננסיים</p>
      </div>

      <!-- Report Filters -->
      <div class="card mb-6">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">מסנני דוחות</h3>
        </div>
        <div class="card-body">
          <form [formGroup]="filterForm">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="form-group">
                <label class="form-label">סוג דוח</label>
                <select formControlName="reportType" class="form-select" (change)="onReportTypeChange()">
                  <option value="monthly">דוח חודשי</option>
                  <option value="yearly">דוח שנתי</option>
                  <option value="dateRange">טווח תאריכים</option>
                  <option value="customer">דוח לקוחות</option>
                </select>
              </div>

              <div class="form-group" *ngIf="filterForm.get('reportType')?.value === 'monthly'">
                <label class="form-label">שנה</label>
                <select formControlName="year" class="form-select" (change)="loadMonthlyReport()">
                  <option *ngFor="let year of availableYears" [value]="year">{{ year }}</option>
                </select>
              </div>

              <div class="form-group" *ngIf="filterForm.get('reportType')?.value === 'dateRange'">
                <label class="form-label">מתאריך</label>
                <input type="date" formControlName="startDate" class="form-input" (change)="loadDateRangeReport()">
              </div>

              <div class="form-group" *ngIf="filterForm.get('reportType')?.value === 'dateRange'">
                <label class="form-label">עד תאריך</label>
                <input type="date" formControlName="endDate" class="form-input" (change)="loadDateRangeReport()">
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Monthly Report -->
      <div class="card mb-6" *ngIf="filterForm.get('reportType')?.value === 'monthly' && (monthlyReports$ | async) as reports">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">דוח חודשי - {{ filterForm.get('year')?.value }}</h3>
        </div>
        <div class="card-body p-0">
          <div class="overflow-x-auto">
            <table class="table">
              <thead class="table-header">
                <tr>
                  <th class="table-header-cell">חודש</th>
                  <th class="table-header-cell">הכנסות</th>
                  <th class="table-header-cell">הוצאות</th>
                  <th class="table-header-cell">רווח</th>
                </tr>
              </thead>
              <tbody class="table-body">
                <tr *ngFor="let report of reports" class="hover:bg-gray-50 transition-colors duration-150">
                  <td class="table-cell">
                    <span class="font-medium">{{ getMonthName(report.month) }}</span>
                  </td>
                  <td class="table-cell">
                    <span class="font-semibold text-success-600">₪{{ report.income | number:'1.0-0' }}</span>
                  </td>
                  <td class="table-cell">
                    <span class="font-semibold text-error-600">₪{{ report.expenses | number:'1.0-0' }}</span>
                  </td>
                  <td class="table-cell">
                    <span class="font-semibold" [class]="report.profit >= 0 ? 'text-success-600' : 'text-error-600'">
                      ₪{{ report.profit | number:'1.0-0' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Yearly Report -->
      <div class="card mb-6" *ngIf="filterForm.get('reportType')?.value === 'yearly' && (yearlyReports$ | async) as reports">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">דוח שנתי</h3>
        </div>
        <div class="card-body p-0">
          <div class="overflow-x-auto">
            <table class="table">
              <thead class="table-header">
                <tr>
                  <th class="table-header-cell">שנה</th>
                  <th class="table-header-cell">הכנסות</th>
                  <th class="table-header-cell">הוצאות</th>
                  <th class="table-header-cell">רווח</th>
                </tr>
              </thead>
              <tbody class="table-body">
                <tr *ngFor="let report of reports" class="hover:bg-gray-50 transition-colors duration-150">
                  <td class="table-cell">
                    <span class="font-medium">{{ report.year }}</span>
                  </td>
                  <td class="table-cell">
                    <span class="font-semibold text-success-600">₪{{ report.income | number:'1.0-0' }}</span>
                  </td>
                  <td class="table-cell">
                    <span class="font-semibold text-error-600">₪{{ report.expenses | number:'1.0-0' }}</span>
                  </td>
                  <td class="table-cell">
                    <span class="font-semibold" [class]="report.profit >= 0 ? 'text-success-600' : 'text-error-600'">
                      ₪{{ report.profit | number:'1.0-0' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Date Range Report -->
      <div class="card mb-6" *ngIf="filterForm.get('reportType')?.value === 'dateRange' && dateRangeReport">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">
            דוח טווח תאריכים - {{ dateRangeReport.startDate | date:'dd/MM/yyyy' }} עד {{ dateRangeReport.endDate | date:'dd/MM/yyyy' }}
          </h3>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-success-600">₪{{ dateRangeReport.income | number:'1.0-0' }}</div>
              <div class="text-sm text-gray-600">סה"כ הכנסות</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-error-600">₪{{ dateRangeReport.expenses | number:'1.0-0' }}</div>
              <div class="text-sm text-gray-600">סה"כ הוצאות</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold" [class]="dateRangeReport.profit >= 0 ? 'text-success-600' : 'text-error-600'">
                ₪{{ dateRangeReport.profit | number:'1.0-0' }}
              </div>
              <div class="text-sm text-gray-600">רווח נקי</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Report -->
      <div class="card mb-6" *ngIf="filterForm.get('reportType')?.value === 'customer' && (customerReports$ | async) as reports">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">דוח לקוחות</h3>
        </div>
        <div class="card-body p-0">
          <div class="overflow-x-auto">
            <table class="table">
              <thead class="table-header">
                <tr>
                  <th class="table-header-cell">לקוח</th>
                  <th class="table-header-cell">מספר קבלות</th>
                  <th class="table-header-cell">סה"כ הכנסות</th>
                </tr>
              </thead>
              <tbody class="table-body">
                <tr *ngFor="let report of reports" class="hover:bg-gray-50 transition-colors duration-150">
                  <td class="table-cell">
                    <span class="font-medium">{{ report.customerName }}</span>
                  </td>
                  <td class="table-cell">
                    <span class="text-gray-600">{{ report.receiptCount }}</span>
                  </td>
                  <td class="table-cell">
                    <span class="font-semibold text-success-600">₪{{ report.totalIncome | number:'1.0-0' }}</span>
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
export class ReportsComponent implements OnInit {
  filterForm!: FormGroup;
  monthlyReports$!: Observable<MonthlyReport[]>;
  yearlyReports$!: Observable<YearlyReport[]>;
  customerReports$!: Observable<CustomerReport[]>;
  dateRangeReport: DateRangeReport | null = null;
  availableYears: number[] = [];

  monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  constructor(
    private reportService: ReportService,
    private customerService: CustomerService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.initializeAvailableYears();
    this.loadInitialReports();
  }

  initializeForm() {
    const currentYear = new Date().getFullYear();
    this.filterForm = this.fb.group({
      reportType: ['monthly'],
      year: [currentYear],
      startDate: [''],
      endDate: ['']
    });
  }

  initializeAvailableYears() {
    const currentYear = new Date().getFullYear();
    this.availableYears = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
  }

  loadInitialReports() {
    this.loadMonthlyReport();
    this.yearlyReports$ = this.reportService.getYearlyReports();
    this.customerReports$ = this.reportService.getCustomerReports();
  }

  onReportTypeChange() {
    const reportType = this.filterForm.get('reportType')?.value;
    
    switch (reportType) {
      case 'monthly':
        this.loadMonthlyReport();
        break;
      case 'yearly':
        // Already loaded
        break;
      case 'customer':
        // Already loaded
        break;
      case 'dateRange':
        this.dateRangeReport = null;
        break;
    }
  }

  loadMonthlyReport() {
    const year = this.filterForm.get('year')?.value;
    if (year) {
      this.monthlyReports$ = this.reportService.getMonthlyReports(year);
    }
  }

  loadDateRangeReport() {
    const startDate = this.filterForm.get('startDate')?.value;
    const endDate = this.filterForm.get('endDate')?.value;
    
    if (startDate && endDate) {
      this.reportService.getDateRangeReport(new Date(startDate), new Date(endDate))
        .subscribe(report => {
          this.dateRangeReport = report;
        });
    }
  }

  getMonthName(month: number): string {
    return this.monthNames[month - 1] || '';
  }
}
