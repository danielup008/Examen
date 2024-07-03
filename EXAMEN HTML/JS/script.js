const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const timeCount = quiz_box.querySelector(".timer .timer_sec")
const timeLine = quiz_box.querySelector("header .time_line")
const timeOff = quiz_box.querySelector("header .time_text")


const option_list = document.querySelector(".option_list");


/*Mostrar el examen si presiono "empezar*/
start_btn.onclick = ()=>{
    info_box.classList.add("activeInfo");
}
/* Regresar al boton de empezar si presiono salir en la ventana de las reglas*/
exit_btn.onclick = ()=>{
    info_box.classList.remove("activeInfo");
}
/* Iniciar el examen si presiono "continiuar" */
continue_btn.onclick = ()=>{
    info_box.classList.remove("activeInfo");
    quiz_box.classList.add("activeQuiz");
    showQuestionCount();
    showQuestions();
    startTimer(15);
    startTimerLine(0);
}
/* contador de preguntas */
let question_count = 0;
let numb = 1;
let countF = 1;
let counter;
let counterLine;
let timeValue = 15;
let widthValue = 0;
let userScore = 0;


/* arreglo para almacenar las preguntas ya mostradas */
let preguntas_mostradas = [];

const next_btn = quiz_box.querySelector(".next_btn");
const result_box = document.querySelector(".result_box");
const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

restart_quiz.onclick = ()=>{
    quiz_box.classList.add("activeQuiz");
    result_box.classList.remove("activeResult");
    question_count = 0;
    numb = 1;
    countF = 1;
    timeValue = 15;
    widthValue = 0;
    userScore = 0;
    showQuestions(question_count);
    showQuestionCount(countF);
    clearInterval(counter);
    startTimer(timeValue);
    clearInterval(counterLine);
    startTimerLine(widthValue);
    next_btn.style.display = "none";
    timeOff.textContent = "Tiempo restante";
}

quit_quiz.onclick = ()=>{
    window.location.reload();
}
next_btn.onclick = ()=>{
    if(question_count < 9){
        question_count++;
        numb++;
        countF++;
        showQuestions(question_count);
        
        showQuestionCount(countF);

        clearInterval(counter);
        startTimer(timeValue);

        clearInterval(counterLine);
        startTimerLine(widthValue);
        next_btn.style.display = "none";
        timeOff.textContent = "Tiempo restante";
    }else{
        clearInterval(counter);
        clearInterval(counterLine);
        console.log("Se termino campeón");
        showResultBox();
    }
}

/* Mostrar la pregunta*/
function showQuestions(){
    const question_text = document.querySelector(".question_text");

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * preguntas.length);
    } while (preguntas_mostradas.includes(randomIndex) && preguntas_mostradas.length < preguntas.length);

    if (preguntas_mostradas.length < preguntas.length) {
        preguntas_mostradas.push(randomIndex);
    }

    let randomQuestion = preguntas[randomIndex];

    correctAnswer = randomQuestion.answer;

    let question_tag = '<span>'+ numb +'. ' +randomQuestion.question +'</span>';
    let option_tag = '<div class="option">' + randomQuestion.options[0] + '<span></span></div>'
                    + '<div class="option">' + randomQuestion.options[1] + '<span></span></div>'
                    + '<div class="option">' + randomQuestion.options[2] + '<span></span></div>'
                    + '<div class="option">' + randomQuestion.options[3] + '<span></span></div>';
    question_text.innerHTML = question_tag;
    option_list.innerHTML = option_tag;
    const option = option_list.querySelectorAll(".option");
    for(let i = 0; i < option.length; i++){
        option[i].setAttribute("onclick", "optionSelected(this)")
    }
}

let tickIcon = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIcon = '<div class="icon cross"><i class="fas fa-times"></i></div>';

function optionSelected(selectedOption){
    clearInterval(counter);
    clearInterval(counterLine);
    let allOptions = option_list.children.length;
    let userAnswer = selectedOption.textContent.trim();
    if (userAnswer === correctAnswer){
        userScore += 1;
        console.log(userScore);
        selectedOption.classList.add("correct");
        console.log("Respuesta correcta");
        selectedOption.insertAdjacentHTML("beforeend", tickIcon);
    } else {
        selectedOption.classList.add("incorrect");
        console.log("Respuesta incorrecta");
        selectedOption.insertAdjacentHTML("beforeend", crossIcon);

        /* mostrar respuesta correcta en caso de elegir una opcion incorrecta */
        for(let i = 0; i < allOptions; i++){
            if(option_list.children[i].textContent == correctAnswer){
                option_list.children[i].setAttribute("class", "option correct")
                option_list.children[i].insertAdjacentHTML("beforeend", tickIcon);
            }
        }
    }
    /* desactivar las demas opciones al seleccionar alguna */
    for(let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
        next_btn.style.display = "block";
    }
}

function showResultBox(){
    info_box.classList.remove("activeInfo");
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.add("activeResult");
    const scoreText = result_box.querySelector(".score_text");
    if(userScore > 7){
        let scoreTag = '<span>¡Felicitaciones, obtuviste <p>'+ userScore +'</p> de <p>'+ (preguntas.length - 20) + '!' +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else if(userScore > 4 && userScore < 8){
        let scoreTag = '<span>Que bien, obtuviste <p>'+ userScore +'</p> de <p>'+ (preguntas.length - 20) +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else{
        let scoreTag = '<span>Lo siento, obtuviste <p>'+ userScore +'</p> de <p>'+ (preguntas.length - 20) +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }

}

function startTimer(time){
    counter = setInterval(timer, 1000);
    function timer(){
        timeCount.textContent = time;
        time--;
        if(time < 9){
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero;
        }
        if(time < 0){
            clearInterval(counter);
            timeCount.textContent = "00";
            timeOff.textContent = "Tiempo agotado";
            disableOptions();
        }
    }
}

function disableOptions() {
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.add("disabled");
        option.disabled = true;
    });
    next_btn.style.display = "block";
}


const allOptions = document.querySelectorAll('.option');

for (let i = 0; i < allOptions.length; i++) {
    allOptions[i].addEventListener('click', function() {
        disableOptions();
    });
}

function startTimerLine(time){
    counterLine = setInterval(timer, 29);
    function timer(){
        time += 1;
        timeLine.style.width = time + "px";
        if(time > 545){
            clearInterval(counterLine);
        }
    }
}











function showQuestionCount(){
    const bottom_question_counter = quiz_box.querySelector(".total_question");
    let totalQuestionCountTag = '<span><p>'+ countF +'</p>de<p>'+ (preguntas.length - 20) +'</p>Preguntas</span>';
    bottom_question_counter.innerHTML = totalQuestionCountTag;
}