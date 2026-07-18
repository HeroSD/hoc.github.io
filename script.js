let currentHerb = null;

function nextQuestion() {
    // 1. Chọn ngẫu nhiên 1 vị thuốc làm đáp án đúng
    currentHerb = herbsData[Math.floor(Math.random() * herbsData.length)];
    
    // 2. Cập nhật hình ảnh
    document.getElementById('herb-image').src = currentHerb.image;
    document.getElementById('feedback').className = 'hidden';
    
    // 3. Tạo danh sách 4 đáp án (1 đúng, 3 nhiễu)
    let options = [currentHerb.name];
    while(options.length < 4) {
        let randomHerb = herbsData[Math.floor(Math.random() * herbsData.length)].name;
        // Kiểm tra để không bị trùng đáp án
        if(!options.includes(randomHerb)) {
            options.push(randomHerb);
        }
    }
    
    // 4. Xáo trộn vị trí 4 đáp án trên giao diện
    options.sort(() => Math.random() - 0.5);
    
    // 5. Hiển thị lên màn hình
    const grid = document.getElementById('options-grid');
    grid.innerHTML = "";
    options.forEach(opt => {
        let btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt);
        grid.appendChild(btn);
    });
}

let score = 0; // Biến lưu điểm
let totalQuestions = 0; // Biến lưu tổng số câu đã làm

nextQuestion();

function checkAnswer(selected) {
    totalQuestions++; // Tăng tổng số câu
    const fb = document.getElementById('feedback');
    const isCorrect = (selected === currentHerb.name);
    
    if (isCorrect) {
        score++; // Tăng điểm nếu đúng
    }
    
    fb.className = isCorrect ? 'card correct' : 'card incorrect';
    fb.classList.remove('card');
    fb.innerHTML = `<strong>${isCorrect ? 'Chính xác!' : 'Sai rồi!'}</strong><br>
                    Điểm số: ${score}/${totalQuestions}<br>
                    Tên: ${currentHerb.name}<br>Bộ phận: ${currentHerb.part}<br>Công dụng: ${currentHerb.use}
                    <br><button onclick="nextQuestion()">Tiếp theo</button>`;
}
