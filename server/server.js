/**
 * FIchier : Server.js
 * Serveur Express pour gérer les enregistrements audio, partie backend de l'application
 * Ce serveur gère les requêtes pour l'enregistrement audio, le consentement des utilisateurs et la sauvegarde des données dans une base de données SQLite.
 * Il utilise Express pour le routage, Multer pour la gestion des fichiers uploadés, et SQLite pour la base de données.
 * Il est configuré pour écouter sur le port 5000 et permet les requêtes CORS.
 * Il crée une base de données SQLite si elle n'existe pas, avec une table pour stocker les enregistrements audio.
 * Il gère les routes pour tester le serveur, enregistrer le consentement des utilisateurs, et sauvegarder les enregistrements audio.
 */

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

// Configuration de la base de données SQLite
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

// Configuration de Multer pour le téléchargement de fichiers
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuration de Multer pour stocker les fichiers audio
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Initialisation de Multer avec la configuration de stockage
const upload = multer({ storage: storage });


// Route de test pour vérifier que le serveur fonctionne
app.post('/api/auth/consent', (req, res) => {
    const { age, gender, consent } = req.body;
    if (!age || !gender || !consent) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }
    res.status(200).json({ message: 'Consentement bien reçu.', age, gender });
});

// Route pour enregistrer les enregistrements audio
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

// Route pour récupérer tous les enregistrements
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
