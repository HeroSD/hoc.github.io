let currentHerb = null;
let score = 0;
let totalQuestions = 0;
let timeLeft;
let timerInterval;

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    const timerDisplay = document.getElementById('timer');
    timerDisplay.innerText = `Thời gian: ${timeLeft}s`;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Thời gian: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            checkAnswer(null);
        }
    }, 1000);
}

function nextQuestion() {
    clearInterval(timerInterval);
    startTimer();
    
    currentHerb = herbsData[Math.floor(Math.random() * herbsData.length)];
    document.getElementById('herb-image').src = currentHerb.image;
    document.getElementById('feedback').className = 'hidden';
    
    let options = [currentHerb.name];
    while(options.length < 4) {
        let rand = herbsData[Math.floor(Math.random() * herbsData.length)].name;
        if(!options.includes(rand)) options.push(rand);
    }
    options.sort(() => Math.random() - 0.5);
    
    const grid = document.getElementById('options-grid');
    grid.innerHTML = "";
    options.forEach(opt => {
        let btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt);
        grid.appendChild(btn);
    });
}

function checkAnswer(selected) {
    clearInterval(timerInterval);
    totalQuestions++;
    
    const isCorrect = (selected === currentHerb.name);
    if (isCorrect) {
        score++;
        // Tự động đọc đầy đủ thông tin
        const speech = new SpeechSynthesisUtterance();
        speech.text = `Chính xác! Đây là ${currentHerb.name}. Bộ phận dùng: ${currentHerb.part}. Công dụng: ${currentHerb.use}`;
        speech.lang = 'vi-VN';
        window.speechSynthesis.speak(speech);
    }
    
    const fb = document.getElementById('feedback');
    fb.className = isCorrect ? 'card correct' : 'card incorrect';
    fb.classList.remove('hidden');
    
    fb.innerHTML = `<strong>${isCorrect ? 'Chính xác!' : (selected === null ? 'Hết giờ!' : 'Sai rồi!')}</strong><br>
                    Điểm: ${score}/${totalQuestions}<br>
                    Tên: ${currentHerb.name}<br>Bộ phận dùng: ${currentHerb.part}<br>Công dụng: ${currentHerb.use}
                    <br><button onclick="nextQuestion()">Tiếp theo</button>`;
}

nextQuestion();