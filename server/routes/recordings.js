const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../models/UserData');

// Configurer Multer pour stocker les fichiers audio
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

router.post('/', upload.single('audio'), (req, res) => {
    const { sentence } = req.body;
    const audioPath = req.file ? req.file.path : null;

    if (!audioPath || !sentence) {
        return res.status(400).json({ error: 'Audio ou phrase manquante' });
    }

    // Sauvegarde les données dans SQLite
    db.run(
        'INSERT INTO recordings (sentence, audio_path) VALUES (?, ?)',
        [sentence, audioPath],
        function (err) {
            if (err) {
                console.error('Erreur lors de l\'insertion:', err);
                return res.status(500).json({ error: 'Erreur serveur' });
            }
            res.json({ message: 'Enregistrement sauvegardé', id: this.lastID });
        }
    );
});

module.exports = router;
