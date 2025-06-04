import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import ConsentForm from './components/ConsentForm';
import RecordingInterface from './components/RecordingInterface';
import './styles/App.css';

function App() {
    return (
        <Router>
            <header>
                <Header />
            </header>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/consent" element={<ConsentForm />} />
                    <Route path="/record" element={<RecordingInterface />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;