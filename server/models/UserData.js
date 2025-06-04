const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.NODE_ENV === 'docker' ? '/app/database/audio_collection.db' : path.join(__dirname, '../../database/audio_collection.db');
console.log('Chemin de la base de données:', dbPath);
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture de la base de données:', err);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS user_data (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     age INTEGER NOT NULL,
     gender TEXT NOT NULL,
     consent BOOLEAN NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS recordings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sentence TEXT NOT NULL,
      audio_path TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;