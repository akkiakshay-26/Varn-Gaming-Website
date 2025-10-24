var board = document.getElementById("board");
var status = document.getElementById("status");
var resetBtn = document.getElementById("resetBtn");

var cells = document.querySelectorAll(".cell");
var currentPlayer = "X";
var gameActive = true;
var boardState = ["", "", "", "", "", "", "", "", ""];

var winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function checkWinner() {
  for (var i = 0; i < winningCombos.length; i++) {
    var a = winningCombos[i][0];
    var b = winningCombos[i][1];
    var c = winningCombos[i][2];
    if (boardState[a] && boardState[a] == boardState[b] && boardState[a] == boardState[c]) {
      gameActive = false;
      var statusElement = document.getElementById("status");
      if (statusElement) {
        statusElement.textContent = "Player " + currentPlayer + " wins!";
        statusElement.style.color = "green";
        statusElement.style.fontWeight = "bold";
        statusElement.style.display = "block";
      }
      alert("Player " + currentPlayer + " wins!");
      if (typeof updateGameStats === 'function') {
        updateGameStats("ticTacToe", true);
      }
      return true;
    }
  }
  var hasEmpty = false;
  for (var j = 0; j < boardState.length; j++) {
    if (boardState[j] == "") {
      hasEmpty = true;
      break;
    }
  }
  if (!hasEmpty) {
    gameActive = false;
    var statusElement = document.getElementById("status");
    if (statusElement) {
      statusElement.textContent = "It's a draw!";
      statusElement.style.color = "orange";
      statusElement.style.fontWeight = "bold";
      statusElement.style.display = "block";
    }
    alert("It's a draw!");
    if (typeof updateGameStats === 'function') {
      updateGameStats("ticTacToe", false);
    }
    return true;
  }
  return false;
}

function handleCellClick(e) {
  var index = e.target.getAttribute("data-index");
  if (boardState[index] != "" || !gameActive) return;

  boardState[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWinner()) {
    return;
  }

  if (gameActive) {
    if (currentPlayer == "X") {
      currentPlayer = "O";
    } else {
      currentPlayer = "X";
    }
    var statusElement = document.getElementById("status");
    if (statusElement) {
      statusElement.textContent = "Player " + currentPlayer + "'s turn";
    }
  }
}

function resetTicTacToe() {
  boardState = ["", "", "", "", "", "", "", "", ""];
  for (var i = 0; i < cells.length; i++) {
    cells[i].textContent = "";
  }
  currentPlayer = "X";
  gameActive = true;
  var statusElement = document.getElementById("status");
  if (statusElement) {
    statusElement.textContent = "Player " + currentPlayer + "'s turn";
    statusElement.style.color = "#333";
    statusElement.style.fontWeight = "normal";
    statusElement.style.display = "block";
  }
}

for (var i = 0; i < cells.length; i++) {
  cells[i].addEventListener("click", handleCellClick);
}
resetBtn.addEventListener("click", resetTicTacToe);

var statusElement = document.getElementById("status");
if (statusElement) {
  statusElement.textContent = "Player " + currentPlayer + "'s turn";
  statusElement.style.display = "block";
}

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 1;
var dy = -1;
var ballRadius = 10;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

var score = 0;
var gameRunning = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score = score + 1;
          document.getElementById("score").textContent = "Score: " + score;
          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN!");
            updateGameStats("brickBreaker", true);
            stopGame();
          }
        }
      }
    }
  }
}

function draw() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  x = x + dx;
  y = y + dy;

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      alert("GAME OVER");
      updateGameStats("brickBreaker", false);
      stopGame();
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX = paddleX + 5;
  } else if (leftPressed && paddleX > 0) {
    paddleX = paddleX - 5;
  }

  requestAnimationFrame(draw);
}

function startGame() {
  if (!gameRunning) {
    gameRunning = true;
    draw();
  }
}

function stopGame() {
  gameRunning = false;
}

function resetBrickBreaker() {
  stopGame();
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 1;
  dy = -1;
  paddleX = (canvas.width - paddleWidth) / 2;
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      bricks[c][r].status = 1;
    }
  }
  score = 0;
  document.getElementById("score").textContent = "Score: " + score;
  document.getElementById("startGameBtn").disabled = false;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
}

document.getElementById("startGameBtn").addEventListener("click", function() {
  startGame();
  document.getElementById("startGameBtn").disabled = true;
});
document.getElementById("resetGameBtn").addEventListener("click", resetBrickBreaker);

resetBrickBreaker();

function updateGameStats(game, won) {
  var stats = localStorage.getItem('gameStats');
  if (stats) {
    stats = JSON.parse(stats);
  } else {
    stats = {
      totalWins: 0,
      totalGames: 0,
      ticTacToeWins: 0,
      ticTacToeGames: 0,
      brickBreakerWins: 0,
      brickBreakerGames: 0
    };
  }
  
  stats.totalGames = stats.totalGames + 1;
  if (won) {
    stats.totalWins = stats.totalWins + 1;
  }
  
  if (game == "ticTacToe") {
    stats.ticTacToeGames = stats.ticTacToeGames + 1;
    if (won) {
      stats.ticTacToeWins = stats.ticTacToeWins + 1;
    }
  } else if (game == "brickBreaker") {
    stats.brickBreakerGames = stats.brickBreakerGames + 1;
    if (won) {
      stats.brickBreakerWins = stats.brickBreakerWins + 1;
    }
  }
  
  localStorage.setItem('gameStats', JSON.stringify(stats));
}
