let currentHerb = null;

function nextQuestion() {
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
    const fb = document.getElementById('feedback');
    fb.className = (selected === currentHerb.name) ? 'card correct' : 'card incorrect';
    fb.classList.remove('card'); // Class đã dùng trên thẻ chứa
    fb.innerHTML = `<strong>${selected === currentHerb.name ? 'Chính xác!' : 'Sai rồi!'}</strong><br>
                    Tên: ${currentHerb.name}<br>Bộ phận: ${currentHerb.part}<br>Công dụng: ${currentHerb.use}
                    <br><button onclick="nextQuestion()">Tiếp theo</button>`;
}
nextQuestion();