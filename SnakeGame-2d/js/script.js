// design: Derya Acar
// github: https://github.com/deryaxacar

const canvas = document.getElementById('snakeCanvas'); // Canvas elementini seç
const ctx = canvas.getContext('2d'); // 2D çizim bağlamını al
const scoreElement = document.getElementById('score'); // Skor elementini seç

const box = 20; // Yılan ve yiyecek kutusunun boyutu
let snake = [{ x: 10 * box, y: 10 * box }]; // Yılanın başlangıç konumu
let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box, type: 'strawberry' }; // İlk yiyecek
let d; // Yılanın hareket yönü
let gameOver = false; // Oyun bitişi durumu
let hunger = 100; // Beslenme durumu
let difficulty = 0; // Zorluk seviyesi
let score = 0; // Oyuncunun skoru

document.addEventListener('keydown', direction); // Klavye olayları için dinleyici ekle

function direction(event) {
  if (gameOver) return;

  // Klavye tuşlarına göre yönü belirle
  if (event.keyCode == 37 && d != 'RIGHT') {
    d = 'LEFT';
  } else if (event.keyCode == 38 && d != 'DOWN') {
    d = 'UP';
  } else if (event.keyCode == 39 && d != 'LEFT') {
    d = 'RIGHT';
  } else if (event.keyCode == 40 && d != 'UP') {
    d = 'DOWN';
  }
}

function updateHungerAndDifficulty() {
  if (snake.length > difficulty) {
    hunger += 5;
    difficulty += 1;
  }

  // Beslenme durumu 0'a ulaştığında oyunu bitir
  if (hunger <= 0) {
    gameOver = true;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    // Yılanı çiz
    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? '#FF69B4' : '#FF1493'; // Baş ve gövde rengi
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
      ctx.strokeStyle = '#bdc3c7';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Gölge rengi
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Yiyeceği çiz
    ctx.fillStyle = '#e74c3c';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Gölge rengi
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillRect(food.x, food.y, box, box);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeRect(food.x, food.y, box, box);

    // Yılanın başını hareket ettir
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'DOWN') snakeY += box;

    // Yılanın sınırlara çarpmasını kontrol et
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height) {
      gameOver = true;
    }

    // Yılanın kendine çarpmasını kontrol et
    for (let i = 1; i < snake.length; i++) {
      if (snakeX === snake[i].x && snakeY === snake[i].y) {
        gameOver = true;
      }
    }

    // Yiyeceği yediyse
    if (snakeX === food.x && snakeY === food.y) {
      food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box, type: 'strawberry' };
      hunger += 10; // Yem yendikçe beslenme durumunu arttır
      score += 10; // Skoru arttır
      scoreElement.textContent = 'Score: ' + score;
    } else {
      snake.pop();
      hunger -= 1; // Her adımda beslenme durumunu azalt
    }

    // Yılanın yeni başını ekle
    const newHead = { x: snakeX, y: snakeY };
    snake.unshift(newHead);
  }
}

function game() {
  draw();
  updateHungerAndDifficulty();

  // Oyun bittiyse ekrana mesaj yaz
  if (gameOver) {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#e74c3c';
    ctx.fillText('Game Over! Press any key to restart.', 25, canvas.height / 2);
    document.addEventListener('keydown', resetGame);
  } else {
    setTimeout(game, 100);
  }
}

function resetGame() {
  // Oyunu sıfırla
  snake = [{ x: 10 * box, y: 10 * box }];
  d = undefined;
  food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box, type: 'strawberry' };
  gameOver = false;
  hunger = 100;
  difficulty = 0;
  score = 0;
  scoreElement.textContent = 'Score: ' + score;
  document.removeEventListener('keydown', resetGame);
  game();
}

game(); // Oyunu başlat
