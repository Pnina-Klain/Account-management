import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer, CreateCustomerRequest } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customers: Customer[] = [
    {
      id: '1',
      name: 'יוסי כהן',
      email: 'yossi@example.com',
      phone: '050-1234567',
      address: 'רחוב הרצל 123, תל אביב',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'שרה לוי',
      email: 'sara@example.com',
      phone: '052-9876543',
      address: 'רחוב בן גוריון 45, חיפה',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10')
    },
    {
      id: '3',
      name: 'דוד אברהם',
      email: 'david@example.com',
      phone: '054-5555555',
      address: 'רחוב יפו 78, ירושלים',
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-03-05')
    }
  ];

  private customersSubject = new BehaviorSubject<Customer[]>(this.customers);
  public customers$ = this.customersSubject.asObservable();

  getCustomers(): Observable<Customer[]> {
    return this.customers$;
  }

  getCustomerById(id: string): Customer | undefined {
    return this.customers.find(customer => customer.id === id);
  }

  createCustomer(customerData: CreateCustomerRequest): Customer {
    const newCustomer: Customer = {
      id: (this.customers.length + 1).toString(),
      ...customerData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.customers.push(newCustomer);
    this.customersSubject.next([...this.customers]);
    return newCustomer;
  }

  updateCustomer(id: string, customerData: Partial<CreateCustomerRequest>): Customer | null {
    const index = this.customers.findIndex(customer => customer.id === id);
    if (index === -1) return null;

    this.customers[index] = {
      ...this.customers[index],
      ...customerData,
      updatedAt: new Date()
    };

    this.customersSubject.next([...this.customers]);
    return this.customers[index];
  }

  deleteCustomer(id: string): boolean {
    const index = this.customers.findIndex(customer => customer.id === id);
    if (index === -1) return false;

    this.customers.splice(index, 1);
    this.customersSubject.next([...this.customers]);
    return true;
  }
}