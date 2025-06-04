const express = require('express');
const router = express.Router();
const db = require('../models/UserData');

router.post('/consent', (req, res) => {
  const { age, gender, consent } = req.body;
  if (!age || !gender || !consent) {
    return res.status(400).json({ error: 'Données incomplètes' });
  }

  db.run(
      'INSERT INTO user_data (age, gender, consent) VALUES (?, ?, ?)',
      [age, gender, consent],
      function (err) {
        if (err) {
          console.error('Erreur lors de l\'insertion:', err);
          return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json({ message: 'Consentement enregistré', id: this.lastID });
      }
  );
});

module.exports = router;