import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Receipt, CreateReceiptRequest, PaymentMethod } from '../models/receipt.model';
import { CustomerService } from './customer.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private receipts: Receipt[] = [
    {
      id: '1',
      receiptNumber: 1001,
      customerId: '1',
      customerName: 'יוסי כהן',
      date: new Date('2024-01-20'),
      amount: 1500,
      paymentMethod: PaymentMethod.CASH,
      details: 'שירותי ייעוץ',
      createdAt: new Date('2024-01-20')
    },
    {
      id: '2',
      receiptNumber: 1002,
      customerId: '2',
      customerName: 'שרה לוי',
      date: new Date('2024-02-15'),
      amount: 2800,
      paymentMethod: PaymentMethod.CREDIT,
      details: 'פיתוח אתר',
      createdAt: new Date('2024-02-15')
    },
    {
      id: '3',
      receiptNumber: 1003,
      customerId: '3',
      customerName: 'דוד אברהם',
      date: new Date('2024-03-10'),
      amount: 950,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      details: 'תחזוקה חודשית',
      createdAt: new Date('2024-03-10')
    }
  ];

  private receiptsSubject = new BehaviorSubject<Receipt[]>(this.receipts);
  public receipts$ = this.receiptsSubject.asObservable();
  private nextReceiptNumber = 1004;

  constructor(private customerService: CustomerService) {}

  getReceipts(): Observable<Receipt[]> {
    return this.receipts$;
  }

  getReceiptById(id: string): Receipt | undefined {
    return this.receipts.find(receipt => receipt.id === id);
  }

  createReceipt(receiptData: CreateReceiptRequest): Receipt {
    const customer = this.customerService.getCustomerById(receiptData.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const newReceipt: Receipt = {
      id: (this.receipts.length + 1).toString(),
      receiptNumber: this.nextReceiptNumber++,
      customerId: receiptData.customerId,
      customerName: customer.name,
      date: receiptData.date,
      amount: receiptData.amount,
      paymentMethod: receiptData.paymentMethod,
      details: receiptData.details,
      createdAt: new Date()
    };

    this.receipts.push(newReceipt);
    this.receiptsSubject.next([...this.receipts]);
    return newReceipt;
  }

  getReceiptsByCustomer(customerId: string): Receipt[] {
    return this.receipts.filter(receipt => receipt.customerId === customerId);
  }

  getReceiptsByDateRange(startDate: Date, endDate: Date): Receipt[] {
    return this.receipts.filter(receipt => 
      receipt.date >= startDate && receipt.date <= endDate
    );
  }

  getTotalIncomeByMonth(year: number, month: number): number {
    return this.receipts
      .filter(receipt => 
        receipt.date.getFullYear() === year && 
        receipt.date.getMonth() === month - 1
      )
      .reduce((total, receipt) => total + receipt.amount, 0);
  }

  getTotalIncomeByYear(year: number): number {
    return this.receipts
      .filter(receipt => receipt.date.getFullYear() === year)
      .reduce((total, receipt) => total + receipt.amount, 0);
  }
}