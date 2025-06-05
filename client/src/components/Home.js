/**
 * FIchier : RecordingInterface.js
 * Composant React pour l'interface d'enregistrement audio
 */
import React from 'react';

const Home = () => {
	return (
		<div className="home-page-container">
			<div className="home-content">
				<h1 className="home-title">Bienvenue dans Audio Collection</h1>
				<p className="home-description">
					Contribuez à l'amélioration des technologies vocales en enregistrant quelques phrases simples. Votre voix compte pour façonner l'avenir de l'IA !
				</p>
				<button
					onClick={() => window.location.href = '/consent'}
					className="home-button button-with-icon"
				>
					<span className="icon record-icon"></span>
					Commencer l'enregistrement
				</button>
			</div>
		</div>
	);
};

export default Home;