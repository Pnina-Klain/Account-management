const Customer = require('../models/customer.model');

exports.getAllCustomers = async (req, res) => {
    const customers = await Customer.find();
    res.json(customers);
};

exports.getCustomerById = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
};

exports.createCustomer = async (req, res) => {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json(newCustomer);
};

exports.updateCustomer = async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true }); 
    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer); 
}    

exports.deleteCustomer = async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(204).send(); 
}   
