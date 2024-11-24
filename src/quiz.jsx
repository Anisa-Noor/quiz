import React, { useState } from "react";
import questions from "./data/questions.json"; 

export default function App() {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [buttonColors, setButtonColors] = useState([]);
  const [answered, setAnswered] = useState(false);  
  const [resultDetails, setResultDetails] = useState([]);
  const [isDivVisible, setIsDivVisible] = useState(false);
  // Handle option selection
 
  const onOptionSelected = (selectedIndex) => {
    if (!answered) {
      setSelectedOptionIndex(selectedIndex);
      
      // Set the button colors (Green for correct, Red for incorrect)
      const updatedButtonColors = questions[currentQIndex].options.map((option, index) => {
        if (index === selectedIndex) {
          return index === questions[currentQIndex].correctOptionIndex
            ? "green" : "red";  
          
        }
        return index === questions[currentQIndex].correctOptionIndex ? "green" : "gray"; // Correct answer but not selected
      });

      setButtonColors(updatedButtonColors);
      setAnswered(true); 

      const updatedResultDetails = [...resultDetails];
      updatedResultDetails[currentQIndex] = {
        question: questions[currentQIndex].statement,
        selectedAnswer: questions[currentQIndex].options[selectedIndex],
        correctAnswer: questions[currentQIndex].options[questions[currentQIndex].correctOptionIndex]
      };
      setResultDetails(updatedResultDetails);
    }
  };

  
  const nextQuestion = () => {
 

    // -------- if the answer is correct, update score
    if (selectedOptionIndex === questions[currentQIndex].correctOptionIndex) {
      setScore(prevScore => prevScore + 1);
    }

    // ----------move to next question or finish quiz
    if (currentQIndex + 1 < questions.length) {
       
        setCurrentQIndex(prevIndex => prevIndex + 1);
        setAnswered(false); 
        setSelectedOptionIndex(null);  
        setButtonColors([]); 
      } else {
        
        setQuizFinished(true);
      }
  };

  //--------------------------------- Restart the quiz
  const restart = () => {
    setCurrentQIndex(0);
    setScore(0);
    setQuizFinished(false);
    setAnswered(false);
    setSelectedOptionIndex(null);
    setButtonColors([]); 
    setResultDetails([]);
  };

  // ------------------------If quiz is finished. show the final score
  if (quizFinished) {
    return (
      
        <div className="container my-5">
          <h1>Online Quiz</h1>
          <h3>Quiz Finished!</h3>
          <p>Your Score: {score} / {questions.length}</p>
          <button onClick={restart}>Restart</button>
  
          {/* Displaying the result details */}
          <button onClick={() => setIsDivVisible(!isDivVisible)}>
        {isDivVisible ? "Hide " : "Show "}Resul Details
      </button>
          <div style={{ display: isDivVisible ? "block" : "none" }}>
            <h4>Results:</h4>
            <ul>
              {resultDetails.map((detail, index) => (
                <li key={index}>
                  <br /><strong>{detail.question}</strong><br />
                  Your answer: <strong>{detail.selectedAnswer} </strong><br />
                  Correct answer: <strong>{detail.correctAnswer}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
  }

  return (
    <div className="container my-5">
      <h1>Online Quiz For Kids</h1>

      <div className="card mb-5" key={questions[currentQIndex]?.id}>
        <div className="card-header">{questions[currentQIndex]?.statement}</div>
        <div className="list-group list-group-flush">
          {questions[currentQIndex]?.options.map((option, index) => {
            // Set the button color based on the buttonColors state
            const buttonStyle = {
              backgroundColor: buttonColors[index] || "white", // Default color is white if no color set
              color: buttonColors[index] === "green" ? "white" : "black", // White text for correct answer, black for others
              borderColor: buttonColors[index] || "black",
              cursor: answered ? "not-allowed" : "pointer", // Disable click after answered
              marginRight: "10px",
              marginTop: "10px",
              marginBottom: "10px",

            };

            return (
              <button
                key={index}
                className="list-group-item list-group-item-action"
                onClick={() => onOptionSelected(index)}
                style={buttonStyle}
                disabled={answered} 
                
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={nextQuestion} disabled={!answered}>Next Question</button>
    </div>
  );
}
