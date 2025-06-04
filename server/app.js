const express = require('express');
const cors = require('cors');
const recordingRoutes = require('./routes/recordings'); // Assurez-vous que le chemin est correct

const app = express();

// Configurer CORS explicitement
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Utilisez le routeur pour les enregistrements
app.use('/api/recordings', recordingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
