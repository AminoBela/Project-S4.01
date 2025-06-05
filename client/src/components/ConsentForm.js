/**
 * fichier : ConsentForm.js
 * COmposant React pour le formulaire de consentement
 * Il permet à l'utilisateur de saisir son âge, son genre, le nombre de phrases à enregistrer et de donner son consentement.
 */

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Composant ConsentForm
 * @returns {JSX.Element}
 * @constructor
 */
const ConsentForm = () => {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [consent, setConsent] = useState(false);
    const [numSentences, setNumSentences] = useState(3);
    const navigate = useNavigate();

    /**
     * Fonction pour gérer la soumission du formulaire
     * @param e
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!age || !gender || !consent || !numSentences) {
            alert('Veuillez remplir tous les champs et donner votre consentement.');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/auth/consent', { age, gender, consent });
            navigate('/record', { state: { numSentences } });
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données:', error);
            alert('Erreur lors de la soumission.');
        }
    };

    /**
     * Fonction pour gérer l'incrémentation et la décrémentation des champs numériques
     * @param setter
     * @param value
     * @param max
     */
    const handleIncrement = (setter, value, max) => {
        const num = parseInt(value) || 0;
        if (num < max) setter(num + 1);
    };

    /**
     * Fonction pour gérer la décrémentation des champs numériques
     * @param setter
     * @param value
     * @param min
     */
    const handleDecrement = (setter, value, min) => {
        const num = parseInt(value) || 0;
        if (num > min) setter(num - 1);
    };

    // Rendu du formulaire de consentement
    return (
        <div className="consent-form-container">
            <h2>Formulaire de consentement</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Âge :
                    <div className="number-input-container">
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || (parseInt(val) <= 100 && parseInt(val) >= 1)) setAge(val);
                            }}
                            min="1"
                            max="100"
                            required
                        />
                        <div className="number-input-buttons">
                            <button
                                type="button"
                                className="increment"
                                onClick={() => handleIncrement(setAge, age, 100)}
                            />
                            <button
                                type="button"
                                className="decrement"
                                onClick={() => handleDecrement(setAge, age, 1)}
                            />
                        </div>
                    </div>
                </label>
                <label>
                    Genre :
                    <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                        <option value="">Sélectionnez</option>
                        <option value="male">Homme</option>
                        <option value="female">Femme</option>
                    </select>
                </label>
                <label>
                    Nombre de phrases à enregistrer :
                    <div className="number-input-container">
                        <input
                            type="number"
                            value={numSentences}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || (parseInt(val) <= 100 && parseInt(val) >= 1)) setNumSentences(val);
                            }}
                            min="1"
                            max="100"
                            required
                        />
                        <div className="number-input-buttons">
                            <button
                                type="button"
                                className="increment"
                                onClick={() => handleIncrement(setNumSentences, numSentences, 100)}
                            />
                            <button
                                type="button"
                                className="decrement"
                                onClick={() => handleDecrement(setNumSentences, numSentences, 1)}
                            />
                        </div>
                    </div>
                </label>
                <div className="checkbox-container">
                    <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        id="consent"
                        required
                    />
                    <label htmlFor="consent" className="checkbox-text">
                        J'ai lu et j'accepte les termes du consentement
                    </label>
                </div>
                <button type="submit" className="button-with-icon">
                    <span className="icon submit-icon"></span>
                    Soumettre
                </button>
            </form>
        </div>
    );
};

export default ConsentForm;