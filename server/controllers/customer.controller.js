const { isValidObjectId } = require('mongoose');
const Customer = require('../models/customer.model');

exports.getAllCustomers = async (req, res) => {
    const customers = await Customer.find();
    res.json(customers);
};

exports.getCustomerById = async (req, res) => {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid customer ID format' });
    }
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
};

exports.createCustomer = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.phone || !req.body.address) {
        return res.status(400).json({ message: 'Name and email are required' });
    }
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json(newCustomer);
};

exports.updateCustomer = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Customer ID is required' });
    }
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid customer ID format' });
    }
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true }); 
    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer); 
}    

exports.deleteCustomer = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Customer ID is required' });
    }
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid customer ID format' });
    }
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(204).send(); 
}   
