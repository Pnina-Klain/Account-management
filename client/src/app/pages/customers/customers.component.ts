import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fade-in">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">לקוחות</h1>
          <p class="text-gray-600">ניהול פרטי לקוחות</p>
        </div>
        <button (click)="toggleCustomerForm()" class="btn btn-primary btn-lg">
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          לקוח חדש
        </button>
      </div>

      <!-- Add Customer Form -->
      <div class="card mb-6" *ngIf="showCustomerForm">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">הוספת לקוח חדש</h3>
        </div>
        <div class="card-body">
          <form [formGroup]="customerForm" (ngSubmit)="onAddCustomer()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label">שם *</label>
                <input type="text" formControlName="name" class="form-input" placeholder="שם הלקוח">
                <div *ngIf="customerForm.get('name')?.invalid && customerForm.get('name')?.touched" 
                     class="text-error-600 text-sm mt-1">
                  יש להזין שם לקוח
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">טלפון</label>
                <input type="tel" formControlName="phone" class="form-input" placeholder="050-1234567">
              </div>

              <div class="form-group">
                <label class="form-label">אימייל</label>
                <input type="email" formControlName="email" class="form-input" placeholder="example@email.com">
                <div *ngIf="customerForm.get('email')?.invalid && customerForm.get('email')?.touched" 
                     class="text-error-600 text-sm mt-1">
                  יש להזין כתובת אימייל תקינה
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">כתובת</label>
                <input type="text" formControlName="address" class="form-input" placeholder="כתובת מלאה">
              </div>
            </div>

            <div class="flex justify-end space-x-4 mt-6">
              <button type="button" (click)="toggleCustomerForm()" class="btn btn-secondary btn-md">
                ביטול
              </button>
              <button type="submit" [disabled]="customerForm.invalid" class="btn btn-success btn-md">
                הוסף לקוח
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Customers List -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">רשימת לקוחות</h3>
        </div>
        <div class="card-body p-0">
          <div class="overflow-x-auto">
            <table class="table">
              <thead class="table-header">
                <tr>
                  <th class="table-header-cell">שם</th>
                  <th class="table-header-cell">טלפון</th>
                  <th class="table-header-cell">אימייל</th>
                  <th class="table-header-cell">כתובת</th>
                  <th class="table-header-cell">תאריך הוספה</th>
                  <th class="table-header-cell">פעולות</th>
                </tr>
              </thead>
              <tbody class="table-body">
                <tr *ngFor="let customer of customers$ | async" class="hover:bg-gray-50 transition-colors duration-150">
                  <td class="table-cell">
                    <div class="font-medium text-gray-900">{{ customer.name }}</div>
                  </td>
                  <td class="table-cell">
                    <span class="text-gray-600">{{ customer.phone || '-' }}</span>
                  </td>
                  <td class="table-cell">
                    <span class="text-gray-600">{{ customer.email || '-' }}</span>
                  </td>
                  <td class="table-cell">
                    <span class="text-gray-600 text-sm">{{ customer.address || '-' }}</span>
                  </td>
                  <td class="table-cell">
                    <span class="text-gray-600">{{ customer.createdAt | date:'dd/MM/yyyy' }}</span>
                  </td>
                  <td class="table-cell">
                    <div class="flex space-x-2">
                      <button class="text-primary-600 hover:text-primary-700 text-sm font-medium" (click)="editCustomer(customer)">
                        ערוך
                      </button>
                      <button class="text-error-600 hover:text-error-700 text-sm font-medium" (click)="deleteCustomer(customer.id)">
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

      <!-- Edit Customer Modal -->
      <div *ngIf="editingCustomer" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" (click)="closeEditModal()">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" (click)="$event.stopPropagation()">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">עריכת לקוח</h3>
            <form [formGroup]="editForm" (ngSubmit)="onUpdateCustomer()">
              <div class="space-y-4">
                <div class="form-group">
                  <label class="form-label">שם *</label>
                  <input type="text" formControlName="name" class="form-input">
                </div>
                <div class="form-group">
                  <label class="form-label">טלפון</label>
                  <input type="tel" formControlName="phone" class="form-input">
                </div>
                <div class="form-group">
                  <label class="form-label">אימייל</label>
                  <input type="email" formControlName="email" class="form-input">
                </div>
                <div class="form-group">
                  <label class="form-label">כתובת</label>
                  <input type="text" formControlName="address" class="form-input">
                </div>
              </div>
              <div class="flex justify-end space-x-4 mt-6">
                <button type="button" (click)="closeEditModal()" class="btn btn-secondary btn-sm">
                  ביטול
                </button>
                <button type="submit" [disabled]="editForm.invalid" class="btn btn-primary btn-sm">
                  שמור שינויים
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CustomersComponent implements OnInit {
  customers$!: Observable<Customer[]>;
  customerForm!: FormGroup;
  editForm!: FormGroup;
  showCustomerForm = false;
  editingCustomer: Customer | null = null;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.customers$ = this.customerService.getCustomers();
    this.initializeForms();
  }

  initializeForms() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      phone: [''],
      address: ['']
    });

    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      phone: [''],
      address: ['']
    });
  }

  toggleCustomerForm() {
    this.showCustomerForm = !this.showCustomerForm;
    if (!this.showCustomerForm) {
      this.customerForm.reset();
    }
  }

  onAddCustomer() {
    if (this.customerForm.valid) {
      this.customerService.createCustomer(this.customerForm.value);
      this.customerForm.reset();
      this.showCustomerForm = false;
    }
  }

  editCustomer(customer: Customer) {
    this.editingCustomer = customer;
    this.editForm.patchValue({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || ''
    });
  }

  onUpdateCustomer() {
    if (this.editForm.valid && this.editingCustomer) {
      this.customerService.updateCustomer(this.editingCustomer.id, this.editForm.value);
      this.closeEditModal();
    }
  }

  closeEditModal() {
    this.editingCustomer = null;
    this.editForm.reset();
  }

  deleteCustomer(id: string) {
    if (confirm('האם אתה בטוח שברצונך למחוק לקוח זה?')) {
      this.customerService.deleteCustomer(id);
    }
  }
}