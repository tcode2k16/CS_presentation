// slideshow @ https://slides.com/alanchang/minimax/live#/

const BOT = O;
const PLAYER = X;

function score(grid) {
  let winner = game.getWinner(grid);
  if (winner === BOT)
    return 10;
  else if (winner === PLAYER)
    return -10;
  else
    return 0;
}

function minimax({grid, turn}, depth = 0) {
  if (game.getWinner(grid) !== EMPTY)
    return score(grid);

  let moves = game.getMoves(grid);
  let scores = moves.map(m => {
    return minimax(game.setBlock({ grid, turn }, m), depth + 1);
  });

  let index = 0;
  
  if (turn === BOT)
    index = maxIndex(scores);
  else
    index = minIndex(scores);

  let bestMove = moves[index];
  let currentScore = scores[index];
  
  if (depth === 0) {
    game.userClick(bestMove);
  }
  
  return currentScore;
}

bot = minimax;