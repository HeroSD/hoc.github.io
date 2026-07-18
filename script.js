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

function checkAnswer(selected) {
    const fb = document.getElementById('feedback');
    fb.className = (selected === currentHerb.name) ? 'card correct' : 'card incorrect';
    fb.classList.remove('card'); // Class đã dùng trên thẻ chứa
    fb.innerHTML = `<strong>${selected === currentHerb.name ? 'Chính xác!' : 'Sai rồi!'}</strong><br>
                    Tên: ${currentHerb.name}<br>Bộ phận: ${currentHerb.part}<br>Công dụng: ${currentHerb.use}
                    <br><button onclick="nextQuestion()">Tiếp theo</button>`;
}
nextQuestion();