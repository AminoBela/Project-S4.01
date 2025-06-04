const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

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

app.post('/api/auth/consent', (req, res) => {
    const { age, gender, consent } = req.body;
    if (!age || !gender || !consent) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }
    res.status(200).json({ message: 'Consentement bien reçu.' });
});

app.post('/api/recordings', upload.single('audio'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier audio reçu.' });
    }
    res.status(200).json({ message: 'Enregistrement sauvegardé avec succès.' });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});