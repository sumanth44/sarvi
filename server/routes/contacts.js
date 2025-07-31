// routes/contacts.js
import express from 'express';
import Contact from '../models/contact.js';

const router = express.Router();

// POST /api/contacts - Save a new contact
router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const contact = new Contact({ name, email, phone });
    await contact.save();
    res.status(201).json({ message: 'Contact saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save contact' });
  }
});

// GET /api/contacts - Retrieve all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

export default router;
