import React, { useState, useEffect } from "react";

const questions = [
  {
    id: 1,
    word: "Apple",
    image: "https://via.placeholder.com/100",
    options: ["Apple", "Banana", "Orange"],
    answer: "Apple",
  },
  {
    id: 2,
    word: "Dog",
    image: "https://via.placeholder.com/100",
    options: ["Cat", "Dog", "Rabbit"],
    answer: "Dog",
  },
];

const TestVocabulary = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 giây cho bài test

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      alert(`Hết giờ! Bạn được ${score} điểm.`);
    }
  }, [timeLeft]);

  const handleAnswerClick = (option) => {
    setSelectedAnswer(option);
    if (option === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        alert(`Hoàn thành! Bạn được ${score + 1} điểm.`);
      }
    }, 500);
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial" }}>
      <h2>Test Từ Vựng</h2>
      <p>Thời gian còn lại: {timeLeft}s</p>
      <img
        src={questions[currentQuestion].image}
        alt={questions[currentQuestion].word}
        style={{ width: 100 }}
      />
      <h3>{questions[currentQuestion].word}</h3>
      {questions[currentQuestion].options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleAnswerClick(option)}
          style={{
            display: "block",
            margin: "10px auto",
            padding: "10px",
            backgroundColor: selectedAnswer === option ? "lightgreen" : "white",
            border: "1px solid black",
            cursor: "pointer",
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default TestVocabulary;
