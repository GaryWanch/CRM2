const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static frontend files from "public" folder
app.use(express.static('public'));

// ---------- API Endpoints ----------

// GET all records
app.get('/api/records', (req, res) => {
  try {
    const records = db.getAllRecords();
    // Parse JSON strings back to objects
    const parsed = records.map(record => ({
      ...record,
      partnerContacts: JSON.parse(record.partnerContacts || '[]'),
      otherContacts: JSON.parse(record.otherContacts || '[]'),
      maintenanceBlocks: JSON.parse(record.maintenanceBlocks || '[]')
    }));
    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET single record
app.get('/api/records/:id', (req, res) => {
  try {
    const record = db.getRecordById(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found' });
    const parsed = {
      ...record,
      partnerContacts: JSON.parse(record.partnerContacts || '[]'),
      otherContacts: JSON.parse(record.otherContacts || '[]'),
      maintenanceBlocks: JSON.parse(record.maintenanceBlocks || '[]')
    };
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new record
app.post('/api/records', (req, res) => {
  try {
    const result = db.createRecord(req.body);
    res.status(201).json({ id: result.lastInsertRowid, ...req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update record
app.put('/api/records/:id', (req, res) => {
  try {
    const result = db.updateRecord(req.params.id, req.body);
    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE record
app.delete('/api/records/:id', (req, res) => {
  try {
    const result = db.deleteRecord(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});