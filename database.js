const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists (for Railway volume)
const dataDir = process.env.DB_PATH ? path.dirname(process.env.DB_PATH) : path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DB_PATH || path.join(dataDir, 'crm.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    companyName TEXT NOT NULL,
    address TEXT,
    website TEXT,
    partnerCompanyName TEXT,
    partnerContacts TEXT,      -- JSON array
    contactName TEXT NOT NULL,
    contactTitle TEXT,
    contactPhone TEXT,
    contactMobile TEXT,
    contactEmail TEXT NOT NULL,
    otherContacts TEXT,        -- JSON array
    totalConsole INTEGER DEFAULT 0,
    totalPremium INTEGER DEFAULT 0,
    totalBasic INTEGER DEFAULT 0,
    totalOtherText TEXT,
    maintenanceBlocks TEXT,    -- JSON array
    licenseNote TEXT,
    monitoringTypes TEXT,
    compNetworks TEXT,
    compStorage TEXT,
    compVm TEXT,
    compDatabase TEXT,
    compContainer TEXT,
    compApplication TEXT,
    compOther TEXT,
    currentTechNotes TEXT,
    planToChangeNotes TEXT,
    upsellingOpportunities TEXT,
    timestamp TEXT
  )
`);

// Helper functions for CRUD
function getAllRecords() {
  const stmt = db.prepare('SELECT * FROM records ORDER BY timestamp DESC');
  return stmt.all();
}

function getRecordById(id) {
  const stmt = db.prepare('SELECT * FROM records WHERE id = ?');
  return stmt.get(id);
}

function createRecord(record) {
  const stmt = db.prepare(`
    INSERT INTO records (
      companyName, address, website, partnerCompanyName, partnerContacts,
      contactName, contactTitle, contactPhone, contactMobile, contactEmail,
      otherContacts, totalConsole, totalPremium, totalBasic, totalOtherText,
      maintenanceBlocks, licenseNote, monitoringTypes,
      compNetworks, compStorage, compVm, compDatabase, compContainer,
      compApplication, compOther, currentTechNotes, planToChangeNotes,
      upsellingOpportunities, timestamp
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);
  return stmt.run(
    record.companyName, record.address, record.website, record.partnerCompanyName,
    JSON.stringify(record.partnerContacts || []),
    record.contactName, record.contactTitle, record.contactPhone, record.contactMobile, record.contactEmail,
    JSON.stringify(record.otherContacts || []),
    record.totalConsole, record.totalPremium, record.totalBasic, record.totalOtherText,
    JSON.stringify(record.maintenanceBlocks || []),
    record.licenseNote, record.monitoringTypes,
    record.compNetworks, record.compStorage, record.compVm, record.compDatabase, record.compContainer,
    record.compApplication, record.compOther, record.currentTechNotes, record.planToChangeNotes,
    record.upsellingOpportunities, record.timestamp || new Date().toISOString()
  );
}

function updateRecord(id, record) {
  const stmt = db.prepare(`
    UPDATE records SET
      companyName=?, address=?, website=?, partnerCompanyName=?, partnerContacts=?,
      contactName=?, contactTitle=?, contactPhone=?, contactMobile=?, contactEmail=?,
      otherContacts=?, totalConsole=?, totalPremium=?, totalBasic=?, totalOtherText=?,
      maintenanceBlocks=?, licenseNote=?, monitoringTypes=?,
      compNetworks=?, compStorage=?, compVm=?, compDatabase=?, compContainer=?,
      compApplication=?, compOther=?, currentTechNotes=?, planToChangeNotes=?,
      upsellingOpportunities=?, timestamp=?
    WHERE id=?
  `);
  return stmt.run(
    record.companyName, record.address, record.website, record.partnerCompanyName,
    JSON.stringify(record.partnerContacts || []),
    record.contactName, record.contactTitle, record.contactPhone, record.contactMobile, record.contactEmail,
    JSON.stringify(record.otherContacts || []),
    record.totalConsole, record.totalPremium, record.totalBasic, record.totalOtherText,
    JSON.stringify(record.maintenanceBlocks || []),
    record.licenseNote, record.monitoringTypes,
    record.compNetworks, record.compStorage, record.compVm, record.compDatabase, record.compContainer,
    record.compApplication, record.compOther, record.currentTechNotes, record.planToChangeNotes,
    record.upsellingOpportunities, new Date().toISOString(),
    id
  );
}

function deleteRecord(id) {
  const stmt = db.prepare('DELETE FROM records WHERE id = ?');
  return stmt.run(id);
}

module.exports = {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord
};