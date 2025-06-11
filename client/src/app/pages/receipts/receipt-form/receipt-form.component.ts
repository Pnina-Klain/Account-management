import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReceiptService } from '../../../services/receipt.service';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';
import { PaymentMethod, PaymentMethodLabels } from '../../../models/receipt.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-receipt-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./receipt-form.component.css'],
  template: `
    <div class="fade-in">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">קבלה חדשה</h1>
        <p class="text-gray-600">הוצאת קבלה ללקוח</p>
      </div>

      <div class="max-w-2xl">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">פרטי הקבלה</h3>
          </div>
          <div class="card-body">
            <form [formGroup]="receiptForm" (ngSubmit)="onSubmit()">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group md:col-span-2">
                  <label class="form-label">לקוח *</label>
                  <select formControlName="customerId" class="form-select">
                    <option value="">בחר לקוח</option>
                    <option *ngFor="let customer of customers$ | async" [value]="customer.id">
                      {{ customer.name }}
                    </option>
                  </select>
                  <div *ngIf="receiptForm.get('customerId')?.invalid && receiptForm.get('customerId')?.touched" 
                       class="text-error-600 text-sm mt-1">
                    יש לבחור לקוח
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">תאריך *</label>
                  <input 
                    type="date" 
                    formControlName="date" 
                    class="form-input"
                    [value]="getCurrentDate()"
                  >
                  <div *ngIf="receiptForm.get('date')?.invalid && receiptForm.get('date')?.touched" 
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
                  <div *ngIf="receiptForm.get('amount')?.invalid && receiptForm.get('amount')?.touched" 
                       class="text-error-600 text-sm mt-1">
                    יש להזין סכום תקין
                  </div>
                </div>

                <div class="form-group md:col-span-2">
                  <label class="form-label">אמצעי תשלום *</label>
                  <select formControlName="paymentMethod" class="form-select">
                    <option value="">בחר אמצעי תשלום</option>
                    <option *ngFor="let method of paymentMethods" [value]="method.value">
                      {{ method.label }}
                    </option>
                  </select>
                  <div *ngIf="receiptForm.get('paymentMethod')?.invalid && receiptForm.get('paymentMethod')?.touched" 
                       class="text-error-600 text-sm mt-1">
                    יש לבחור אמצעי תשלום
                  </div>
                </div>

                <div class="form-group md:col-span-2">
                  <label class="form-label">פרטים</label>
                  <textarea 
                    formControlName="details" 
                    class="form-input"
                    rows="3"
                    placeholder="תיאור השירות או המוצר..."
                  ></textarea>
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
                  [disabled]="receiptForm.invalid || isSubmitting"
                  class="btn btn-primary btn-md"
                >
                  <span *ngIf="isSubmitting" class="inline-flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 small-icon text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    שומר...
                  </span>
                  <span *ngIf="!isSubmitting">הוצא קבלה</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Customer Quick Add -->
        <div class="card mt-6" *ngIf="showCustomerForm">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">הוספת לקוח חדש</h3>
          </div>
          <div class="card-body">
            <form [formGroup]="customerForm" (ngSubmit)="onAddCustomer()">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label class="form-label">שם *</label>
                  <input type="text" formControlName="name" class="form-input" placeholder="שם הלקוח">
                </div>
                <div class="form-group">
                  <label class="form-label">טלפון</label>
                  <input type="tel" formControlName="phone" class="form-input" placeholder="050-1234567">
                </div>
                <div class="form-group md:col-span-2">
                  <label class="form-label">אימייל</label>
                  <input type="email" formControlName="email" class="form-input" placeholder="example@email.com">
                </div>
              </div>
              <div class="flex justify-end space-x-4 mt-4">
                <button type="button" (click)="toggleCustomerForm()" class="btn btn-secondary btn-sm">
                  ביטול
                </button>
                <button type="submit" [disabled]="customerForm.invalid" class="btn btn-success btn-sm">
                  הוסף לקוח
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="mt-4" *ngIf="!showCustomerForm">
          <button (click)="toggleCustomerForm()" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
            + הוסף לקוח חדש
          </button>
        </div>
      </div>
    </div>
  `
})
export class ReceiptFormComponent implements OnInit {
  receiptForm!: FormGroup;
  customerForm!: FormGroup;
  customers$!: Observable<Customer[]>;
  isSubmitting = false;
  showCustomerForm = false;

  paymentMethods = [
    { value: PaymentMethod.CASH, label: PaymentMethodLabels[PaymentMethod.CASH] },
    { value: PaymentMethod.CREDIT, label: PaymentMethodLabels[PaymentMethod.CREDIT] },
    { value: PaymentMethod.BANK_TRANSFER, label: PaymentMethodLabels[PaymentMethod.BANK_TRANSFER] }
  ];

  constructor(
    private fb: FormBuilder,
    private receiptService: ReceiptService,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForms();
    this.customers$ = this.customerService.getCustomers();
  }

  initializeForms() {
    this.receiptForm = this.fb.group({
      customerId: ['', Validators.required],
      date: [this.getCurrentDate(), Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      paymentMethod: ['', Validators.required],
      details: ['']
    });

    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      phone: ['']
    });
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.receiptForm.valid) {
      this.isSubmitting = true;
      
      const formValue = this.receiptForm.value;
      const receiptData = {
        ...formValue,
        date: new Date(formValue.date),
        amount: parseFloat(formValue.amount)
      };

      try {
        this.receiptService.createReceipt(receiptData);
        this.router.navigate(['/receipts']);
      } catch (error) {
        console.error('Error creating receipt:', error);
        this.isSubmitting = false;
      }
    }
  }

  onAddCustomer() {
    if (this.customerForm.valid) {
      const customer = this.customerService.createCustomer(this.customerForm.value);
      this.receiptForm.patchValue({ customerId: customer.id });
      this.toggleCustomerForm();
      this.customerForm.reset();
    }
  }

  toggleCustomerForm() {
    this.showCustomerForm = !this.showCustomerForm;
    if (!this.showCustomerForm) {
      this.customerForm.reset();
    }
  }

  onCancel() {
    this.router.navigate(['/receipts']);
  }
}
