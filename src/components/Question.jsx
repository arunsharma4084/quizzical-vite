import React from "react"
import "../App.css"

function Question(props) {

  function setClassName(option){
    if(props.review){
      if(option.isSelected && !option.isCorrect){
        return "btn-option btn-option-selected"
      } else if(option.isCorrect){
        return "btn-option btn-option-correct"
      } else{
        return "btn-option btn-option-notSelected"
      }
    } else{
      return "btn-option"
    }
  }

  const optionElements = props.options.map(option => {
    return (<button className={setClassName(option)} 
                    key={option.value}
                    onClick={(event) => props.onOptionClick(event, option.value)}>
                    {option.value}
                    </button>)
  })

  return (
    <div className="question-container">
      <h2 className="question">{props.question}</h2>
      <div className="answers">
       {optionElements}
      </div>
    </div>
  );
}

export default Question;
