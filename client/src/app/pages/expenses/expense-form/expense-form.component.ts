import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpenseService } from '../../../services/expense.service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./expense-form.component.css'],
  template: `
    <div class="fade-in">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">הוצאה חדשה</h1>
        <p class="text-gray-600">רישום הוצאה עסקית חדשה</p>
      </div>

      <div class="max-w-2xl">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">פרטי ההוצאה</h3>
          </div>
          <div class="card-body">
            <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label class="form-label">תאריך *</label>
                  <input 
                    type="date" 
                    formControlName="date" 
                    class="form-input"
                    [value]="getCurrentDate()"
                  >
                  <div *ngIf="expenseForm.get('date')?.invalid && expenseForm.get('date')?.touched" 
                       class="text-error-600 text-sm mt-1">
                    יש להזין תאריך
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">סכום *</label>
                  <div class="relative">
                    <input 
                      type="number" 
                      formControlName="amount" 
                      class="form-input pl-8"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    >
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 text-sm">₪</span>
                    </div>
                  </div>
                  <div *ngIf="expenseForm.get('amount')?.invalid && expenseForm.get('amount')?.touched" 
                       class="text-error-600 text-sm mt-1">
                    יש להזין סכום תקין
                  </div>
                </div>

                <div class="form-group md:col-span-2">
                  <label class="form-label">ספק/נותן שירות *</label>
                  <input 
                    type="text" 
                    formControlName="provider" 
                    class="form-input"
                    placeholder="שם הספק או נותן השירות"
                  >
                  <div *ngIf="expenseForm.get('provider')?.invalid && expenseForm.get('provider')?.touched" 
                       class="text-error-600 text-sm mt-1">
                    יש להזין שם ספק
                  </div>
                </div>

                <div class="form-group md:col-span-2">
                  <label class="form-label">פרטים *</label>
                  <textarea 
                    formControlName="details" 
                    class="form-input"
                    rows="3"
                    placeholder="תיאור ההוצאה..."
                  ></textarea>
                  <div *ngIf="expenseForm.get('details')?.invalid && expenseForm.get('details')?.touched" 
                       class="text-error-600 text-sm mt-1">
                    יש להזין פרטים
                  </div>
                </div>

                <div class="form-group md:col-span-2">
                  <label class="form-label">אסמכתא</label>
                  <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors duration-200">
                    <div class="space-y-1 text-center">
                      <svg class="mx-auto small-icon" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <div class="flex text-sm text-gray-600">
                        <label class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                          <span>העלה קובץ</span>
                          <input type="file" class="sr-only" (change)="onFileSelected($event)" accept="image/*,.pdf">
                        </label>
                        <p class="pr-1">או גרור ושחרר</p>
                      </div>
                      <p class="text-xs text-gray-500">PNG, JPG, PDF עד 10MB</p>
                    </div>
                  </div>
                  <div *ngIf="selectedFile" class="mt-2 text-sm text-gray-600">
                    קובץ נבחר: {{ selectedFile.name }}
                  </div>
                </div>
              </div>

              <div class="flex justify-end space-x-4 mt-8">
                <button 
                  type="button" 
                  (click)="onCancel()" 
                  class="btn btn-secondary btn-md"
                >
                  ביטול
                </button>
                <button 
                  type="submit" 
                  [disabled]="expenseForm.invalid || isSubmitting"
                  class="btn btn-primary btn-md"
                >
                  <span *ngIf="isSubmitting" class="inline-flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 small-icon text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    שומר...
                  </span>
                  <span *ngIf="!isSubmitting">שמור הוצאה</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ExpenseFormComponent implements OnInit {
  expenseForm!: FormGroup;
  isSubmitting = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.expenseForm = this.fb.group({
      date: [this.getCurrentDate(), Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      provider: ['', Validators.required],
      details: ['', Validators.required]
    });
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      this.isSubmitting = true;
      
      const formValue = this.expenseForm.value;
      const expenseData = {
        ...formValue,
        date: new Date(formValue.date),
        amount: parseFloat(formValue.amount),
        proofDocument: this.selectedFile ? this.selectedFile.name : undefined
      };

      try {
        this.expenseService.createExpense(expenseData);
        this.router.navigate(['/expenses']);
      } catch (error) {
        console.error('Error creating expense:', error);
        this.isSubmitting = false;
      }
    }
  }

  onCancel() {
    this.router.navigate(['/expenses']);
  }
}
