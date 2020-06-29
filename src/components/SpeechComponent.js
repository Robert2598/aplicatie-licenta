import React from 'react';

const SpeechComponent = (props) => {
    let expressions = Object.keys(props.messages);
    let counts = Object.values(props.messages)
    let goal = 1;

    if(counts.length > 0) {
    let closest = counts.reduce(function (prev, curr) {
        return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
    });
    let position = counts.indexOf(closest)
    let voice = new SpeechSynthesisUtterance(expressions[position])
    speechSynthesis.speak(voice)
    console.log(expressions[position])
}
    
    return (
        <div></div>
    )
}

export default SpeechComponent;