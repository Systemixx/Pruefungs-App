import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [questions, setQuestions] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 Minuten in Sekunden
  const [quizStarted, setQuizStarted] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);

  // Lade alle Fragen aus der JSON-Datei
  useEffect(() => {
    fetch("/questions.json")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  // Timer für das Quiz
  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setShowResults(true);
    }
  }, [quizStarted, timeLeft]);

  // Quiz starten
  const startQuiz = () => {
    const selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 48);
    setQuizQuestions(selectedQuestions);
    setQuizStarted(true);
  };

  // Antwort verarbeiten
  const handleAnswerClick = (answer) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (answer === currentQuestion.correct) {
      setScore(score + 1);
    } else {
      // Füge die falsch beantwortete Frage zur Übersicht hinzu
      setIncorrectQuestions([
        ...incorrectQuestions,
        {
          question: currentQuestion.question,
          answers: currentQuestion.answers,
          selected: answer,
          correct: currentQuestion.correct,
        },
      ]);
    }
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < quizQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setShowResults(true);
    }
  };

  // Timer-Anzeige formatieren
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Bestanden oder nicht bestanden prüfen
  const resultText = score >= 40 ? "Bestanden" : "Nicht bestanden";
  const resultColor = score >= 40 ? "green" : "red";

  return (
    <div className="App">
      <h1>Sachkundeprüfungs Terraristik §2</h1>
      {!quizStarted ? (
        <div>
          <button onClick={startQuiz}>Prüfung starten</button>
        </div>
      ) : showResults ? (
        <div className="results">
          <h2>Ergebnis</h2>
          <p>
            Du hast {score} von {quizQuestions.length} Punkten erreicht.
          </p>
          <h3 style={{ color: resultColor, fontWeight: "bold" }}>{resultText}</h3>
          {incorrectQuestions.length > 0 && (
            <div className="incorrect-questions">
              <h3>Falsch beantwortete Fragen:</h3>
              <ul>
                {incorrectQuestions.map((item, index) => (
                  <li key={index} className="question-overview">
                    <strong>Frage:</strong> {item.question} <br />
                    <strong>Antwortmöglichkeiten:</strong>
                    <ul>
                      {item.answers.map((answer, idx) => (
                        <li key={idx}>{answer}</li>
                      ))}
                    </ul>
                    <strong>Deine Antwort:</strong> {item.selected} <br />
                    <strong>Korrekte Antwort:</strong> {item.correct}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={() => window.location.reload()}>Quiz neu starten</button>
        </div>
      ) : (
        <div>
          <div className="timer">
            <p>Zeit verbleibend: {formatTime(timeLeft)}</p>
          </div>
          <h2>{quizQuestions[currentQuestionIndex].question}</h2>
          <div className="quiz-options">
            {quizQuestions[currentQuestionIndex].answers.map((answer, index) => (
              <button key={index} onClick={() => handleAnswerClick(answer)}>
                {answer}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
