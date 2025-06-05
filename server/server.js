const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('recordings.db', (err) => {
    if (err) console.error('Erreur lors de la connexion à la BD:', err.message);
    else {
        console.log('Connecté à la base de données recordings.db');
        db.run(`CREATE TABLE IF NOT EXISTS recordings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            sentence_index INTEGER NOT NULL,
            saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_age INTEGER,
            user_gender TEXT
        )`);
    }
});

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.get('/test', (req, res) => {
    res.send('Serveur OK');
});

app.post('/api/auth/consent', (req, res) => {
    const { age, gender, consent } = req.body;
    if (!age || !gender || !consent) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }
    res.status(200).json({ message: 'Consentement bien reçu.', age, gender });
});

app.post('/api/recordings', upload.single('audio'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier audio reçu.' });
    }
    const { sentence_index, age, gender } = req.body;
    const filename = req.file.filename;
    db.run(
        `INSERT INTO recordings (filename, sentence_index, user_age, user_gender) VALUES (?, ?, ?, ?)`,
        [filename, sentence_index, age, gender],
        (err) => {
            if (err) {
                console.error('Erreur lors de l\'insertion dans la BD:', err.message);
                return res.status(500).json({ message: 'Erreur serveur.' });
            }
            res.status(200).json({ message: 'Enregistrement sauvegardé avec succès.', filename });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
