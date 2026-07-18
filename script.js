let currentHerb = null;
let score = 0;
let totalQuestions = 0;
let timeLeft;
let timerInterval;
let gameMode = 'quiz';

function startGame(mode) {
    gameMode = mode;
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
    nextQuestion();
}

function startTimer() {
    clearInterval(timerInterval);
    
    // Nếu là chế độ điền chữ (fill), thời gian là 20s, nếu là trắc nghiệm (quiz) thì 10s
    timeLeft = (gameMode === 'fill') ? 20 : 10; 
    
    const timerDisplay = document.getElementById('timer');
    timerDisplay.innerText = `Thời gian: ${timeLeft}s`;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Thời gian: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // Tự động kiểm tra đáp án khi hết giờ
            if (gameMode === 'quiz') {
                checkAnswer(null); // Trắc nghiệm: truyền null để báo sai
            } else {
                checkInput(); // Điền chữ: gọi hàm kiểm tra ô input
            }
        }
    }, 1000);
}

function nextQuestion() {
    startTimer();
    currentHerb = herbsData[Math.floor(Math.random() * herbsData.length)];
    document.getElementById('herb-image').src = currentHerb.image;
    document.getElementById('feedback').className = 'hidden';

    if (gameMode === 'quiz') {
        document.getElementById('quiz-options').classList.remove('hidden');
        document.getElementById('fill-options').classList.add('hidden');
        renderQuiz();
    } else {
        document.getElementById('quiz-options').classList.add('hidden');
        document.getElementById('fill-options').classList.remove('hidden');
        document.getElementById('answer-input').value = "";
    }
}

function renderQuiz() {
    let options = [currentHerb.name];
    while(options.length < 4) {
        let rand = herbsData[Math.floor(Math.random() * herbsData.length)].name;
        if(!options.includes(rand)) options.push(rand);
    }
    options.sort(() => Math.random() - 0.5);
    const grid = document.getElementById('quiz-options');
    grid.innerHTML = "";
    options.forEach(opt => {
        let btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt);
        grid.appendChild(btn);
    });
}

function checkInput() {
    const input = document.getElementById('answer-input').value.trim();
    checkAnswer(input);
}

function checkAnswer(selected) {
    clearInterval(timerInterval);
    totalQuestions++;
    const isCorrect = selected !== null && selected.toLowerCase() === currentHerb.name.toLowerCase();
    if (isCorrect) {
        score++;
        const speech = new SpeechSynthesisUtterance(`Chính xác! Đây là ${currentHerb.name}. Bộ phận dùng: ${currentHerb.part}. Công dụng: ${currentHerb.use}`);
        speech.lang = 'vi-VN';
        window.speechSynthesis.speak(speech);
    }
    const fb = document.getElementById('feedback');
    fb.className = isCorrect ? 'card correct' : 'card incorrect';
    fb.innerHTML = `<strong>${isCorrect ? 'Chính xác!' : 'Sai rồi!'}</strong><br>
                    Điểm: ${score}/${totalQuestions}<br>Tên: ${currentHerb.name}<br>
                    Bộ phận: ${currentHerb.part}<br>Công dụng: ${currentHerb.use}
                    <br><button onclick="nextQuestion()">Tiếp theo</button>`;
}