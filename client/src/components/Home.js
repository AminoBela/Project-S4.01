import React from 'react';

const Home = () => {
	return (
		<div>
			<h1>Application collecte audios</h1>
			<p>Bienvenue, faites un click pour commencer a enregistrer.</p>
			<button onClick={() => window.location.href = '/consent'}>Démarrer</button>
		</div>

	);
};

export default Home;



