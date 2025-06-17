const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app'); 
const Customer = require('../models/customer.model');
const Expense = require('../models/expense.model');
const Receipt = require('../models/receipt.model');



let server;

beforeAll(async () => {
    server = app.listen(3001); 
});

afterAll(async () => {
    await mongoose.connection.close(); 
    server.close();
});


describe('Customer API', () => {
    let customerId;

    describe('POST /customers', () => {
        it('should return 201 and create a customer', async () => {
            const customer = {
                name: 'John Doe',
                email: 'jd1234@gmail.com',
                address: '123 Main St',
                phone: '123-456-7890'
            };

            const response = await request(app)
                .post('/api/customers')
                .send(customer)
                .expect(201);

            customerId = response.body._id; 
            expect(response.body).toHaveProperty('name', customer.name);
            expect(response.body).toHaveProperty('email', customer.email);
        });

        it('should return 400 if name or email is missing', async () => {
            const response = await request(app)
                .post('/api/customers')
                .send({ email: 'test@gmail.com' })
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Name and email are required');
        });
    });

    describe('GET /customers', () => {
        it('should return 200 and a list of customers', async () => {
            const response = await request(app)
                .get('/api/customers')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('GET /customers/:id', () => {
        it('should return 200 and the customer data', async () => {
            const response = await request(app)
                .get(`/api/customers/${customerId}`)
                .expect(200);

            expect(response.body).toHaveProperty('_id', customerId);
            expect(response.body).toHaveProperty('name', 'John Doe');
        });

        it('should return 400 for a invalid customer ID', async () => {
            const response = await request(app)
                .get('/api/customers/nonexistingid')
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Invalid customer ID format');
        });

        it('should return 404 for a non-existing customer', async () => {
            const response = await request(app)
                .get('/api/customers/60d5f484f1b2c8b1c8b8b8b8') // Example of a non-existing ID
                .expect(404);
            expect(response.body).toHaveProperty('message', 'Customer not found');
        });
    });

    describe('PUT /customers/:id', () => {
        it('should update the customer and return 200', async () => {
            const updatedCustomer = {
                name: 'Jane Doe',
                email: 'jane.doe@gmail.com',
                address: '456 Elm St',
                phone: '987-654-3210'
            };

            const response = await request(app)
                .put(`/api/customers/${customerId}`)
                .send(updatedCustomer)
                .expect(200);

            expect(response.body).toHaveProperty('name', updatedCustomer.name);
        });

        it('should return 400 for a invalid customer ID', async () => {
            const updatedCustomer = { name: 'Non Existing' };
            const response = await request(app)
                .put('/api/customers/nonexistingid')
                .send(updatedCustomer)
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Invalid customer ID format');
        });

        it('should return 400 if customer ID is missing', async () => {
            const response = await request(app)
                .put('/api/customers/')
                .send({ name: 'Test' })
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Customer ID is required');
        });

        it('should return 404 for a non-existing customer', async () => {
            const updatedCustomer = { name: 'Non Existing' };
            const response = await request(app)
                .put('/api/customers/60d5f484f1b2c8b1c8b8b8b8') // Example of a non-existing ID
                .send(updatedCustomer)
                .expect(404);
            expect(response.body).toHaveProperty('message', 'Customer not found');
        });
    });

    describe('DELETE /customers/:id', () => {
        it('should delete the customer and return 204', async () => {
            await request(app)
                .delete(`/api/customers/${customerId}`)
                .expect(204);
        });

        it('should return 400 for a invalid customer ID', async () => {
            const response = await request(app)
                .delete('/api/customers/nonexistingid')
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Invalid customer ID format');
        });

        it('should return 404 for a deleted customer', async () => {
            const response = await request(app)
                .get(`/api/customers/${customerId}`)
                .expect(404);
            expect(response.body).toHaveProperty('message', 'Customer not found');
        });

        it('should return 400 if customer ID is missing', async () => {
            const response = await request(app)
                .delete('/api/customers/')
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Customer ID is required');
        });

        it('should return 404 for a non-existing customer', async () => {
            const response = await request(app)
                .get('/api/customers/60d5f484f1b2c8b1c8b8b8b8') // Example of a non-existing ID
                .expect(404);
            expect(response.body).toHaveProperty('message', 'Customer not found');
        } );
    });
});

describe('Expense API', () => {
    let expenseId;

    describe('POST /expenses', () => {
        it('should create a new expense and return 201', async () => {
            const expenseData = {
                date: new Date(),
                amount: 100,
                provider: 'Provider A',
                details: 'Details about the expense'
            };

            const response = await request(app)
                .post('/api/expenses')
                .send(expenseData)
                .expect(201);

            expenseId = response.body._id;
            expect(response.body).toHaveProperty('amount', expenseData.amount);
            expect(response.body).toHaveProperty('provider', expenseData.provider);
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/expenses')
                .send({ amount: 100 })
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Date, amount, provider, and details are required');
        });
    });

    describe('GET /expenses', () => {
        it('should return 200 and a list of expenses', async () => {
            const response = await request(app)
                .get('/api/expenses')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('GET /expenses/:id', () => {
        it('should retrieve an expense by ID and return 200', async () => {
            const response = await request(app)
                .get(`/api/expenses/${expenseId}`)
                .expect(200);

            expect(response.body).toHaveProperty('_id', expenseId);
            expect(response.body).toHaveProperty('provider', 'Provider A');
        });

        it('should return 400 for a invalid expense ID', async () => {
            const response = await request(app)
                .get('/api/expenses/nonexistingid')
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Invalid expense ID format');
        });
    });

    describe('PUT /expenses/:id', () => {
        it('should update an expense and return 200', async () => {
            const updatedData = { amount: 150 };

            const response = await request(app)
                .put(`/api/expenses/${expenseId}`)
                .send(updatedData)
                .expect(200);

            expect(response.body).toHaveProperty('amount', updatedData.amount);
        });

        it('should return 400 for a invalid expense ID', async () => {
            const updatedData = { amount: 200 };
            const response = await request(app)
                .put('/api/expenses/nonexistingid')
                .send(updatedData)
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Invalid expense ID format');
        });

        it('should return 400 if expense ID is missing', async () => {
            const response = await request(app)
                .put('/api/expenses/')
                .send({ amount: 200 })
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Expense ID is required');
        });

        it('should return 404 for a non-existing expense', async () => {
            const updatedData = { amount: 200 };
            const response = await request(app)
                .put('/api/expenses/60d5f484f1b2c8b1c8b8b8b8') // Example of a non-existing ID
                .send(updatedData)
                .expect(404);
            expect(response.body).toHaveProperty('message', 'Expense not found');
        } );
    });

    describe('DELETE /expenses/:id', () => {
        it('should delete an expense and return 204', async () => {
            await request(app)
                .delete(`/api/expenses/${expenseId}`)
                .expect(204);
        });

        it('should return 404 for a deleted expense', async () => {
            const response = await request(app)
                .get(`/api/expenses/${expenseId}`)
                .expect(404);
            expect(response.body).toHaveProperty('message', 'Expense not found');
        });

        it('should return 400 for a invalid expense ID', async () => {
            const response = await request(app)
                .delete('/api/expenses/nonexistingid')
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Invalid expense ID format');
        });

        it('should return 400 if expense ID is missing', async () => {
            const response = await request(app)
                .delete('/api/expenses/')
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Expense ID is required');
        });

    });
});

describe('Receipt API', () => {
    let receiptId;
    let customerId;

    beforeAll(async () => {
        const customerData = {
            name: 'Customer A',
            email: 'customerA@gmail.com',
            address: '123 Customer St',
            phone: '123-456-7890'
        };
        const customerResponse = await request(app)
            .post('/api/customers')
            .send(customerData);
        customerId = customerResponse.body._id;
    });

    describe('POST /receipts', () => {
        it('should create a new receipt and return 201', async () => {
            const receiptData = {
                receiptNumber: 12345,
                customerId: customerId,
                date: new Date(),
                amount: 200,
                paymentMethod: 'Credit Card',
                details: 'Payment for services'
            };

            const response = await request(app)
                .post('/api/receipts')
                .send(receiptData)
                .expect(201);

            receiptId = response.body._id; 
            expect(response.body).toHaveProperty('amount', receiptData.amount);
            expect(response.body).toHaveProperty('receiptNumber', receiptData.receiptNumber);
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/receipts')
                .send({ amount: 200 })
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Receipt number, customer ID, date, amount, payment method, and details are required');
        });
    });

    describe('GET /receipts', () => {
        it('should return 200 and a list of receipts', async () => {
            const response = await request(app)
                .get('/api/receipts')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('GET /receipts/:id', () => {
        it('should retrieve a receipt by ID and return 200', async () => {
            const response = await request(app)
                .get(`/api/receipts/${receiptId}`)
                .expect(200);

            expect(response.body).toHaveProperty('_id', receiptId);
            expect(response.body).toHaveProperty('receiptNumber', 12345);
        });

        it('should return 400 for a invalid receipt', async () => {
            const response = await request(app)
                .get('/api/receipts/nonexistingid')
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Invalid receipt ID format');
        });
    });

    describe('PUT /receipts/:id', () => {
        it('should update a receipt and return 200', async () => {
            const updatedData = { amount: 250 };

            const response = await request(app)
                .put(`/api/receipts/${receiptId}`)
                .send(updatedData)
                .expect(200);

            expect(response.body).toHaveProperty('amount', updatedData.amount);
        });

        it('should return 400 for a invalid receipt ID', async () => {
            const updatedData = { amount: 300 };
            const response = await request(app)
                .put('/api/receipts/nonexistingid')
                .send(updatedData)
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Invalid receipt ID format');
        });

        it('should return 400 if receipt ID is missing', async () => {
            const response = await request(app)
                .put('/api/receipts/')
                .send({ amount: 300 })
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Receipt ID is required');
        });

        it('should return 404 for a non-existing receipt', async () => {
            const updatedData = { amount: 300 };
            const response = await request(app)
                .put('/api/receipts/60d5f484f1b2c8b1c8b8b8b8') // Example of a non-existing ID
                .send(updatedData)
                .expect(404);
            expect(response.body).toHaveProperty('message', 'Receipt not found');
        } );
    });

    describe('DELETE /receipts/:id', () => {
        it('should delete a receipt and return 204', async () => {
            await request(app)
                .delete(`/api/receipts/${receiptId}`)
                .expect(204);
        });

        it('should return 404 for a deleted receipt', async () => {
            const response = await request(app)
                .get(`/api/receipts/${receiptId}`)
                .expect(404);
            expect(response.body).toHaveProperty('message', 'Receipt not found');
        });

        it('should return 400 if receipt ID is missing', async () => {
            const response = await request(app)
                .delete('/api/receipts/')
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Receipt ID is required');
        });
        it('should return 400 for a invalid receipt ID', async () => {
            const response = await request(app)
                .delete('/api/receipts/nonexistingid')
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Invalid receipt ID format');
        });
    });
});
