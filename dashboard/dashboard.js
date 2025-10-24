function loadStats() {
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
  
  var winRate = stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0;
  
  document.getElementById('totalWins').textContent = stats.totalWins;
  document.getElementById('gamesPlayed').textContent = stats.totalGames;
  document.getElementById('winRate').textContent = winRate + '%';
}

loadStats();