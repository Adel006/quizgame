//Declaring variables
let answerLabel = document.querySelectorAll('.answers .span-answer label'),
    checkBox = document.querySelectorAll('.answers .span-answer input'),
    answerArea = document.querySelector('.answers-area'),
    title = document.querySelector('.answers-area h2'),
    btn = document.querySelector('button'),
    qNumber = document.querySelector('.app-info .q-number'),
    bulletSpan = document.querySelector('.bullets-span'),
    resultDiv = document.querySelector('.result'),
    resultMessage = document.querySelector('.result p'),
    bulletsCoundownDiv = document.querySelector('.bullets-coundown-div'),
    timer = document.querySelector('.countdown-timer span');

var index = 0;
var nbOfRightAnswers = 0;
var countDownTimerInterval;
var arrayImages = ["Images/Bad.png", "Images/Good.png", "Images/Perfect.png"];



//Check right answers and show it in the resultMessage div depending on your rightAnswers number
function checkAnswer(data, index, nbOfQuestions) {

    let choosenAnswer, rightAnswer;

    if (index < nbOfQuestions) {

        checkBox.forEach((element) => {

            if (element.checked) {
                choosenAnswer = answerLabel[element.dataset.index].innerHTML;
                rightAnswer = data[index].rightAnswer;
            }
        })

        if (choosenAnswer === rightAnswer) {
            nbOfRightAnswers ++;
        }

        if (index == nbOfQuestions-1) {

            answerArea.remove();
            btn.remove();
            bulletsCoundownDiv.remove();

            //create reset button
            let resetBtn = document.createElement("button"),
                imageDiv = document.createElement("div"),
                img = document.createElement("img");
            
            resetBtn.className = "reset-btn";
            resetBtn.innerHTML = "Reset Game";
            resultDiv.appendChild(resetBtn);

            imageDiv.className = "image";
            imageDiv.appendChild(img);

            resultDiv.insertBefore(imageDiv, resultMessage);
            
            //action performed after resetButton being clicked
            resetBtn.onclick = function() {
                window.location.reload();
            }

            if (nbOfRightAnswers < (nbOfQuestions/2)) {
               
                img.setAttribute("src", arrayImages[0]);
                resultMessage.innerHTML = "<span class='red'>Bad,</span> You answerd " + nbOfRightAnswers + " From " + nbOfQuestions;

            } else if(nbOfRightAnswers >= (nbOfQuestions/2) && nbOfRightAnswers < nbOfQuestions) {

                img.setAttribute("src", arrayImages[1]);
                resultMessage.innerHTML = "<span class='green'>Good,</span> You answerd " + nbOfRightAnswers + " From " + nbOfQuestions;

            } else {
                img.setAttribute("src", arrayImages[2]);
                resultMessage.innerHTML = "<span class='blue'>Perfect,</span> You answerd " + nbOfRightAnswers + " From " + nbOfQuestions;

            }

        }
    }
}

//Http request to bring data from json file
function AjaxRequest() {

    const ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function () {

        if (ajax.readyState === 4 && ajax.status === 200) {

            let data = JSON.parse(this.responseText),
                nbOfQuestions = data.length;

        //set number of questions
            qNumber.innerHTML = nbOfQuestions;

            setQuestions(data, index, nbOfQuestions);
            setClassBullet(index);
            countDownTimer(20, nbOfQuestions);
            
            btn.onclick = function () {
                checkAnswer(data, index, nbOfQuestions);
                index++;
                setQuestions(data, index, nbOfQuestions);
                setClassBullet(index, nbOfQuestions);
                clearInterval(countDownTimerInterval);
                countDownTimer(20, nbOfQuestions);
            }
        }
    }

    ajax.open("GET", "data.json");
    ajax.send();
}

AjaxRequest();

//Set questions
function setQuestions(data, index, nbOfQuestions) {

    "use strict";

    if (index < nbOfQuestions) {

        title.innerHTML = data[index].question;
        answerLabel[0].innerHTML = data[index].answer1;
        answerLabel[1].innerHTML = data[index].answer2;
        answerLabel[2].innerHTML = data[index].answer3;
        answerLabel[3].innerHTML = data[index].answer4;
    }
}

//Set class on bullets
function setClassBullet(index, nbOfQuestions) {
    if (index < nbOfQuestions) {
        for (var i = 0; i <= index; i++) {
            bulletSpan.children[i].classList.add('on');
        }
    }
}

//CountDownTimer
function countDownTimer(duration, nbOfQuestions) {

    if (index < nbOfQuestions) {

        countDownTimerInterval = setInterval(function () {
    
            let minutes = parseInt(duration/60);
            let secondes = parseInt(duration%60);
        
            minutes = minutes < 10 ? "0"+minutes : minutes;
            secondes = secondes < 10 ? "0"+secondes : secondes;
        
            timer.innerHTML = `${minutes} : ${secondes}`;
        
            duration--;
    
            if (duration < 0) {
                clearInterval(countDownTimerInterval);
                btn.click();
            }

        }, 1000)
    }
}


