const Contact = require('../model/Contact.Model');

// Create a new contact
const createContact = async (req, res) => {
  try {
    const { name, phone, email, city, message } = req.body;

    if (!name || !phone || !email || !city || !message) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const existingData = await Contact.findOne({ email });

    if (existingData) {
      return res.status(400).json({ message: 'This contact already exists' });
    }

    const newContact = new Contact({
      name,
      phone,
      email,
      city,
      message,
    });

    await newContact.save();

    res.status(201).json({
      message: 'Contact is successfully created',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// Get all contacts
const getallContact = async (req, res) => {
  try {
    const contacts = await Contact.find();

    if (!contacts.length) {
      return res.status(404).json({ message: 'No contact records found' });
    }

    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = {
  createContact,
  getallContact,
};
