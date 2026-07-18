let currentHerb = null;
let score = 0;
let totalQuestions = 0;
let timeLeft;
let timerInterval;
let gameMode = 'quiz';

// Hàm bỏ dấu tiếng Việt để so sánh chuỗi linh hoạt
function normalizeString(str) {
    return str.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '');
}

function startGame(mode) {
    gameMode = mode;
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
    nextQuestion();
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = (gameMode === 'fill') ? 20 : 10; // 20s cho điền chữ, 10s cho trắc nghiệm
    document.getElementById('timer').innerText = `Thời gian: ${timeLeft}s`;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Thời gian: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameMode === 'fill' ? checkInput() : checkAnswer(null);
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
        const inputField = document.getElementById('answer-input');
        inputField.value = "";
        inputField.focus(); // Tự động chọn ô input trên máy tính
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
    const input = document.getElementById('answer-input').value;
    const isCorrect = normalizeString(input) === normalizeString(currentHerb.name);
    // Ẩn bàn phím ảo trên điện thoại sau khi kiểm tra
    document.getElementById('answer-input').blur(); 
    checkAnswer(isCorrect ? currentHerb.name : input);
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
    fb.classList.remove('hidden');
    fb.innerHTML = `<strong>${isCorrect ? 'Chính xác!' : 'Sai rồi!'}</strong><br>
                    Điểm: ${score}/${totalQuestions}<br>Tên: ${currentHerb.name}<br>
                    Bộ phận: ${currentHerb.part}<br>Công dụng: ${currentHerb.use}
                    <br><button onclick="nextQuestion()">Tiếp theo</button>`;
}

// Hỗ trợ phím Enter cho máy tính
document.getElementById('answer-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') checkInput();
});

// Xử lý sự kiện phóng to ảnh
const herbImg = document.getElementById('herb-image');

herbImg.addEventListener('click', function() {
    // Tạo một lớp phủ (overlay) để hiển thị ảnh to
    const overlay = document.createElement('div');
    overlay.className = 'zoomed';
    
    const largeImg = document.createElement('img');
    largeImg.src = this.src;
    
    overlay.appendChild(largeImg);
    document.body.appendChild(overlay);
    
    // Nhấn vào bất cứ đâu trên màn hình để đóng phóng to
    overlay.addEventListener('click', function() {
        this.remove();
    });
});