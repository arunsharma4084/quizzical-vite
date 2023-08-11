import React from "react"
import './App.css';
import blob1 from "./blob1.png"
import blob2 from "./blob2.png"
import Question from "./components/Question"
import Confetti from "react-confetti"

function App() {
  const [quizData, setQuizData] = React.useState([]);
  const [fetchData, setFetchData] = React.useState(false);
  const [quizScreen, setQuizScreen] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [review, setReview] = React.useState(false)

  React.useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple')
      .then(res => res.json())
      .then(data => {
        data.results.map(result => {
          return setQuizData(prev => [...prev, {
            question: decodeEntities(result.question),
            options: getShuffledOptions([...result.incorrect_answers, result.correct_answer]),
          }])
        })
      }).catch(err => console.log("OOPS", err))
    }, [fetchData])

    function decodeEntities(string){
      let modifiedString;
      let tempEl = document.createElement('p');
      tempEl.innerHTML = string;
      modifiedString = tempEl.textContent || tempEl.innerText;
      tempEl = null;
      return modifiedString;
  }

  function startQuiz(){
    setQuizScreen(true);
    // localStorage.setItem("isQuizScreen", true);
  }

  function getShuffledOptions(array){
      const answer = decodeEntities(array.pop());
      const modifiedArray = array.map(item => decodeEntities(item));
      const randomNumber = Math.floor(Math.random() * 4);
      modifiedArray.splice(randomNumber, 0, answer)
      const optionsArray = modifiedArray.map(item => {
        return {
          value: item,
          isCorrect: item === answer ? true : false,
          isSelected: false
        }
      })
      return optionsArray;
  }

  function onOptionClick(e, selectedOption){
    let isAlreadySelected;
    const selectedQuestion = quizData.find(item => {
      return item.options.find(option => {
        return option.value === selectedOption;
      })
    })

    isAlreadySelected = selectedQuestion.options.find(option => option.isSelected)

    if(!isAlreadySelected || isAlreadySelected.value === selectedOption){
      e.target.classList.toggle("clicked-answer")
      setQuizData(oldData => {
      return oldData.map(item => {
        return {...item, options: item.options.map(option => {
          return option.value === selectedOption ? {...option, isSelected: !option.isSelected} : option
        })}
      })
    })
    }
  }

  function checkAnswers(content){
    if(content === "Play Again"){
      setQuizData([]);
      setFetchData(prev => !prev);
      setQuizScreen(false);
      setCount(0);
      setReview(false);
      //localStorage.removeItem("isQuizScreen");
    } else {
        quizData.forEach(item => {
          item.options.forEach(option => {
            if(option.isSelected && option.isCorrect){
              setCount(prev => prev + 1)
            }
          })
        })
        setReview(true);
      }
  }

  const questionElements = quizData.map(item => {
    return <Question key={item.question}
            question={item.question}
            options={item.options}
            onOptionClick={onOptionClick}
            review={review}/>
  })

  return (
    <div className="container">
      {count > 8 && <Confetti width={window.innerWidth} height={window.innerHeight + 600}/>}
      <img className="blob one" alt="" src={blob1}/>
      <img className="blob two" alt="" src={blob2}/>
      {
        quizScreen 
        // && localStorage.getItem("isQuizScreen")
        ?
        <div className="App Quiz">
          {questionElements}
          <div className="footer">
            {review && <p className="result">{count>8 ? "WOW!!! " : ''}You scored {count}/10 correct answers</p>}
            <button className="quiz-control"
                  onClick={(e) => checkAnswers(e.target.textContent)}>
            {review ? "Play Again" : "Check Answers"}
            </button>
          </div>
        </div>
        :
        <div className="App">
          <h1 className="app-title"> Quizzical</h1>
          <p className="app-desc">How well do you know your Sports? Click below to find out!!!</p>
          <button className="quiz-control"
                  onClick={startQuiz}>
          Start Quiz
          </button>
        </div>
      }
    </div>
  );
}

export default App;
