import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecordingInterface = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [sentences, setSentences] = useState([]);
    const [recordings, setRecordings] = useState([]);
    const [isSaved, setIsSaved] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const lobatoPhrases = [
        "¡Atención llegamos a la recta de atrás! Fernando a por los McLaren. ¡VELOCIDAD TOTAL! ¡Wau! Tercero Fernando.",
        "¡No queremos ver esas imágenes, lo que queremos ver es la batalla de Fernando Alonso por el primer puesto!",
        "Ahora mismo está en el P2, que nadie piense mal, lo decía porque está en la posición dos.",
        "Esto es patinaje sobre agua.",
        "Alonso va volando, bueno más bien nadando.",
        "¡Vemos a los coches haciendo el trenecito!",
        "Bajo el agua, bajo el cielo diabólico de Spa-Francorchamps.",
        "¡Me quitaría el sombrero pero no tengo sombrero!",
        "Oigamos como suenan las ruedas.",
        "Aquí las compañías de seguros van a echar a más de uno...",
        "¡Sato, Super Sato! ¡Super Sato acaba de pasar a Ralf Schumacher!",
        "Hamilton se ha llevado a alguien, se ha llevado a Hamilton.",
        "Ha hecho un plano y se ha dejado 50 euros en neumáticos en la frenada.",
        "No quiero decir nada, pero mis espías anuncian lluvia en una vuelta.",
        "Estamos en Nurburgring, un circuito que ya tuvo lugar en muchos lugares.",
        "Y se sale Hamilton.",
        "Vamos a explicarles lo que son las fuerzas G, van a ver que no tiene nada que ver con el sexo.",
        "Hay que echarle un par de bemoles.",
        "Esto está muy bien pero lo que tenemos que ver ahora es la carrera.",
        "¡Fernando se ha desesperado de esperar, se ha desesperado de esperar!",
        "Nick Heidfeld, que cambió el motor de su motor.",
        "Va cayendo suciedad a la cámara subjetiva de la cámara del finlandés Kimi Räikkönen.",
        "Le ha pasado hasta el apuntador.",
        "Aquí, en Nurburgring, la penalización por cada 10 kilos de combustible es de 39 décimas.",
        "Lo ahora es que el cielo se está poniendo más negro que la axila de un grillo.",
        "¡Si parpadean, se lo van a perder!",
        "El sol se ha nublado.",
        "Las circunstancias meteóricas no eran adecuadas.",
        "Grampi grampi gran premio de Gran Bretaña.",
        "¡Me levanto de la silla porque es impresionante lo que he visto!",
        "Atención a la parrilla virtual que es muy real.",
        "Aquí en este gran premio de España.",
        "Ha hecho un tiempo estratosférico, de otra galaxia.",
        "Esto parece el Tour de Francia.",
        "Tengo previsión de lluvia de dos equipos, que no voy a decir cuáles son.",
        "Los equipos son Toyota y Renault.",
        "Le saca una ventaja de 12 segundos, y quedan trece segundos para el final de la carrera.",
        "Estamos en Spa, un circuito para hombres de pelo en pecho.",
        "Un marcapasos para Flavio y otro para mí.",
        "Como no tenemos a Alonso que está haciendo pipí, vamos con su vuelta de clasificación.",
        "¡Tiempazo de Kimi Räikkönen que consigue una nueva pole!",
        "Aún vemos a 'Barba' Trulli.",
        "Le están rozando la parte de atrás con un spray.",
        "Alonso bastante atrás en el 11º, suponemos que se trata de alguna estrategia del equipo.",
        "Cae suciedad a la cámara subjetiva que lleva en su cámara el piloto finlandés.",
        "¡Visualmente se puede ver la lluvia!",
        "Cuidado con los monoplazas que son unos bólidos que son lo que es lo que son.",
        "Confirmado, el abandono de Alonso se debió a un problema en los cambios.",
        "Las temperaturas meteorológicas... eh... situación meteorológica.",
        "Si los Bridgestone fuesen bien en la clasificación pondrían a Schumacher en la Extra-Pole.",
        "La B y la M no significa que los pilotos sean buenos o malos, sino que son sus marcas de neumáticos.",
        "Sale Jacqs Villenif.",
        "Se estaban colocando sarro...",
        "Yo estoy ya caliente y aquí Gonzalo también está calentándose...",
        "¡A (algún piloto) le van a poner neumáticos de tacos porque se pasa más tiempo fuera que dentro de la pista!",
        "Cámara dura... huy cámara dura, ¡ya no sé lo que digo! Rueda dura.",
        "Ahí vemos a Massa delante de los 2 Ferrari.",
        "Webber es un perro... digo un hueso duro de roer...",
        "Como ha cambiado todo dio... como ha cambiado todo esto dios mío, como ha cambiado en 20 metros.",
        "Estamos regalando un mini-couper a todos los participantes... bueno, a todos no.",
        "Si esto es un sueño, que nadie me despierte.",
        "El riesgo forma parte de la vida de Takuma Sato.",
        "Fernando no hace prisioneros. Si tiene que pasar por encima de quien tenga que pasar, lo hará.",
        "¡Fernando Alonso va a ir a por Checo Pérez en la salida a muerte!",
        "Todas nuestras miradas están fijadas en estos momentos en ese monoplaza, pilotado por (algún piloto).",
        "Artur Mas ha tenido que pasarlo mal escuchando el himno de España, qué papelón...",
        "Muchísimas gracias por estar con nosotros (risas) Pedro que me quiere matar.",
        "Formula 1 en estado puro.",
        "Miren como se retuercen las carcasas de los neumáticos.",
        "Los hachazos que van metiendo...",
        "El segundo es el primero de los tontos.",
        "Thank you, KIMI.",
        "¡Está utilizando la técnica de la boa constrictor!",
        "Ahora empieza el baile.",
        "¡Vaya jarro de agua fría para los españoles!",
        "Sacando las garras como un felino.",
        "Arañando segundos poco a poco.",
        "La policía reforzó exponencialmente la seguridad.",
        "En Fórmula 1 es muy importante los frenos.",
        "Mañana mismo con estos nervios me voy al médico.",
        "Button, atracado por unos asaltantes armados.",
        "Escuchen como animan a Fernando... tengo que corregir, antes no animaban a Fernando, lo insultaban.",
        "Que disfrute de la carrera, que sufra.",
        "Un marcapasos para Flavio y otro para mí.",
        "Al menos sabemos que el día que el Samurai tenga una buena espada, nadie podrá derrotarle.",
        "No es ninguno de los nuestros.",
        "¡Peligroooo japoneeees!",
        "¡Pollitooo la que has liadooo!",
        "En casa del ciego, el tuerto es el rey."
    ];
useEffect(() => {
        const numSentences = state?.numSentences || 5;
        const generateSentences = () => {
            const result = [];
            while (result.length < numSentences) {
                const shuffledPhrases = lobatoPhrases.sort(() => 0.5 - Math.random());
                result.push(...shuffledPhrases.slice(0, Math.min(numSentences - result.length, lobatoPhrases.length)));
            }
            return result.slice(0, numSentences);
        };
        setSentences(generateSentences());
        setRecordings(new Array(numSentences).fill(null));
        setIsSaved(new Array(numSentences).fill(false));
    }, [state?.numSentences]);

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                    const url = URL.createObjectURL(audioBlob);
                    setAudioURL(url);
                    setRecordings(prev => {
                        const newRecordings = [...prev];
                        newRecordings[currentSentenceIndex] = audioBlob;
                        return newRecordings;
                    });
                };

                mediaRecorder.start();
                setIsRecording(true);
            })
            .catch(err => console.error('Erreur lors de l\'accès au micro:', err));
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const saveRecording = async () => {
        if (recordings[currentSentenceIndex] && !isSaved[currentSentenceIndex]) {
            const formData = new FormData();
            formData.append('audio', recordings[currentSentenceIndex], `recording_${currentSentenceIndex}.wav`);
            formData.append('sentence_index', currentSentenceIndex);
            formData.append('age', state?.age || '');
            formData.append('gender', state?.gender || '');
            try {
                const response = await axios.post('http://localhost:5000/api/recordings', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                console.log(response.data.message);
                setIsSaved(prev => {
                    const newIsSaved = [...prev];
                    newIsSaved[currentSentenceIndex] = true;
                    return newIsSaved;
                });
            } catch (error) {
                console.error('Erreur lors de la sauvegarde:', error);
            }
        }
    };

    const reRecord = () => {
        setAudioURL(null);
        setIsSaved(prev => {
            const newIsSaved = [...prev];
            newIsSaved[currentSentenceIndex] = false;
            return newIsSaved;
        });
        startRecording();
    };

    const nextSentence = () => {
        if (currentSentenceIndex < (state?.numSentences || 5) - 1) {
            setCurrentSentenceIndex(prev => prev + 1);
            setAudioURL(null);
            setIsSaved(prev => {
                const newIsSaved = [...prev];
                newIsSaved[currentSentenceIndex] = false; // Réinitialiser pour la prochaine phrase
                return newIsSaved;
            });
        } else {
            navigate('/');
        }
    };

    const earlyExit = async () => {
        for (let i = 0; i < recordings.length; i++) {
            if (recordings[i] && !isSaved[i]) {
                const formData = new FormData();
                formData.append('audio', recordings[i], `recording_${i}.wav`);
                formData.append('sentence_index', i);
                formData.append('age', state?.age || '');
                formData.append('gender', state?.gender || '');
                try {
                    await axios.post('http://localhost:5000/api/recordings', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    setIsSaved(prev => {
                        const newIsSaved = [...prev];
                        newIsSaved[i] = true;
                        return newIsSaved;
                    });
                } catch (error) {
                    console.error(`Erreur lors de la sauvegarde de l'enregistrement ${i}:`, error);
                }
            }
        }
        navigate('/');
    };

    const progress = ((currentSentenceIndex + 1) / (state?.numSentences || 5)) * 100;

    return (
        <div className="recording-page-container">
            <h2>Enregistrement de la voix</h2>
            <div className="recording-interface">
                {sentences.length > 0 && (
                    <>
                        <p className="fixed-phrase">Phrase : {sentences[currentSentenceIndex]}</p>
                        <p>Progression : Phrase {currentSentenceIndex + 1} sur {state?.numSentences || 5}</p>
                        <p>Statut : {isSaved[currentSentenceIndex] ? 'Sauvegardé' : 'Non sauvegardé'}</p>
                        <div style={{ width: '100%', background: '#333', height: '10px', borderRadius: '5px', margin: '10px 0' }}>
                            <div style={{ width: `${progress}%`, background: '#00f2fe', height: '100%', borderRadius: '5px', transition: 'width 0.3s' }}></div>
                        </div>
                    </>
                )}
                <div className="button-group">
                    {!isRecording && !audioURL && (
                        <button onClick={startRecording} className="button-with-icon">
                            <span className="icon record-icon"></span>
                            Enregistrer
                        </button>
                    )}
                    {isRecording && (
                        <button onClick={stopRecording} className="button-with-icon">
                            <span className="icon stop-icon"></span>
                            Arrêter
                        </button>
                    )}
                    {audioURL && (
                        <>
                            <button onClick={() => {
                                const audio = new Audio(audioURL);
                                audio.play().catch(err => console.error('Erreur de lecture:', err));
                            }} className="button-with-icon">
                                <span className="icon record-icon"></span>
                                Réécouter
                            </button>
                            <button onClick={reRecord} className="button-with-icon">
                                <span className="icon record-icon"></span>
                                Réenregistrer
                            </button>
                            <button onClick={saveRecording} className="button-with-icon" disabled={isSaved[currentSentenceIndex]}>
                                <span className="icon submit-icon"></span>
                                Sauvegarder
                            </button>
                        </>
                    )}
                    <button onClick={nextSentence} className="button-with-icon">
                        <span className="icon next-icon"></span>
                        Phrase suivante
                    </button>
                    <button onClick={earlyExit} className="button-with-icon">
                        <span className="icon exit-icon"></span>
                        Quitter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecordingInterface;
