let currentHerb = null;
let score = 0;
let totalQuestions = 0;
let timeLeft;
let timerInterval;

// Hàm khởi tạo đồng hồ
function startTimer() {
    timeLeft = 10; 
    const timerDisplay = document.getElementById('timer');
    if (timerDisplay) timerDisplay.innerText = `Thời gian: ${timeLeft}s`;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timerDisplay) timerDisplay.innerText = `Thời gian: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            checkAnswer(null); // Hết giờ thì coi như chọn sai (null)
        }
    }, 1000);
}

function nextQuestion() {
    clearInterval(timerInterval); // Dừng đồng hồ cũ
    startTimer(); // Chạy đồng hồ mới cho câu hỏi tiếp theo
    
    // 1. Chọn ngẫu nhiên 1 vị thuốc
    currentHerb = herbsData[Math.floor(Math.random() * herbsData.length)];
    
    // 2. Cập nhật hình ảnh
    document.getElementById('herb-image').src = currentHerb.image;
    document.getElementById('feedback').className = 'hidden';
    
    // 3. Tạo 4 đáp án
    let options = [currentHerb.name];
    while(options.length < 4) {
        let rand = herbsData[Math.floor(Math.random() * herbsData.length)].name;
        if(!options.includes(rand)) options.push(rand);
    }
    options.sort(() => Math.random() - 0.5);
    
    // 4. Hiển thị đáp án
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
    clearInterval(timerInterval); // Dừng đồng hồ khi đã chọn
    totalQuestions++;
    
    const fb = document.getElementById('feedback');
    const isCorrect = (selected === currentHerb.name);
    
    if (isCorrect) score++;
    
    fb.className = isCorrect ? 'card correct' : 'card incorrect';
    fb.classList.remove('hidden'); // Hiển thị khung phản hồi
    
    fb.innerHTML = `<strong>${isCorrect ? 'Chính xác!' : (selected === null ? 'Hết giờ!' : 'Sai rồi!')}</strong><br>
                    Điểm: ${score}/${totalQuestions}<br>
                    Tên: ${currentHerb.name}<br>Bộ phận: ${currentHerb.part}<br>Công dụng: ${currentHerb.use}
                    <br><button onclick="nextQuestion()">Tiếp theo</button>`;
}

// Chạy câu hỏi đầu tiên khi tải trang
nextQuestion();