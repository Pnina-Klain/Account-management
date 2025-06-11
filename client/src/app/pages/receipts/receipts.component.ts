import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReceiptService } from '../../services/receipt.service';
import { Receipt, PaymentMethodLabels } from '../../models/receipt.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-receipts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./receipts.component.css'],
  template: `
    <div class="fade-in">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">קבלות</h1>
          <p class="text-gray-600">ניהול קבלות ללקוחות</p>
        </div>
        <a routerLink="/receipts/new" class="btn btn-primary btn-lg">
          <svg class="small-icon ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          קבלה חדשה
        </a>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">רשימת קבלות</h3>
        </div>
        <div class="card-body p-0">
          <div class="overflow-x-auto">
            <table class="table">
              <thead class="table-header">
                <tr>
                  <th class="table-header-cell">מספר קבלה</th>
                  <th class="table-header-cell">לקוח</th>
                  <th class="table-header-cell">תאריך</th>
                  <th class="table-header-cell">סכום</th>
                  <th class="table-header-cell">אמצעי תשלום</th>
                  <th class="table-header-cell">פרטים</th>
                </tr>
              </thead>
              <tbody class="table-body">
                <tr *ngFor="let receipt of receipts$ | async" class="hover:bg-gray-50 transition-colors duration-150">
                  <td class="table-cell">
                    <span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      #{{ receipt.receiptNumber }}
                    </span>
                  </td>
                  <td class="table-cell">
                    <div class="font-medium text-gray-900">{{ receipt.customerName }}</div>
                  </td>
                  <td class="table-cell">
                    <span class="text-gray-900">{{ receipt.date | date:'dd/MM/yyyy' }}</span>
                  </td>
                  <td class="table-cell">
                    <span class="font-semibold text-success-600">₪{{ receipt.amount | number:'1.0-0' }}</span>
                  </td>
                  <td class="table-cell">
                    <span class="badge" [ngClass]="getPaymentMethodBadgeClass(receipt.paymentMethod)">
                      {{ getPaymentMethodLabel(receipt.paymentMethod) }}
                    </span>
                  </td>
                  <td class="table-cell">
                    <span class="text-gray-600 text-sm">{{ receipt.details }}</span>
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
export class ReceiptsComponent implements OnInit {
  receipts$!: Observable<Receipt[]>;

  constructor(private receiptService: ReceiptService) {}

  ngOnInit() {
    this.receipts$ = this.receiptService.getReceipts();
  }

  getPaymentMethodLabel(method: string): string {
    return PaymentMethodLabels[method as keyof typeof PaymentMethodLabels] || method;
  }

  getPaymentMethodBadgeClass(method: string): string {
    switch (method) {
      case 'cash':
        return 'badge-success';
      case 'credit':
        return 'badge-warning';
      case 'bank_transfer':
        return 'badge-primary';
      default:
        return 'badge-primary';
    }
  }
}
