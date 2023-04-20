const gameBoardSize = 10;

let playerBoard = Array.from({length: gameBoardSize}, () => Array(gameBoardSize).fill(0));
let aiBoard = Array.from({length: gameBoardSize}, () => Array(gameBoardSize).fill(0));

const ships = [
  {name: 'Carrier', size: 5},
  {name: 'Battleship', size: 4},
  {name: 'Cruiser', size: 3},
  {name: 'Submarine', size: 3},
  {name: 'Destroyer', size: 2}
];

const DIRECTIONS = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical'
};

function givePlayerPieces() {
  for (const ship of ships) {
    let placed = false;
    while (!placed) {
      let playerDirection = prompt("What direction do you want to place your " + ship.name + "? (V)ertical or (H)orizontal").toUpperCase();
      let row = parseInt(prompt("What row do you want to place your " + ship.name + "?"));
      let col = parseInt(prompt("What column do you want to place your " + ship.name + "?"));

      const direction = playerDirection === 'V' ? DIRECTIONS.VERTICAL : DIRECTIONS.HORIZONTAL;
      placed = placeShip(playerBoard, ship, row, col, direction);
    }
  }
}

function placeShip(board, ship, row, col, direction) {
  if (
    (direction === DIRECTIONS.HORIZONTAL && col + ship.size > gameBoardSize) ||
    (direction === DIRECTIONS.VERTICAL && row + ship.size > gameBoardSize)
  ) {
    console.log("Ship placement out of bounds.");
    return false;
  }

  for (let i = 0; i < ship.size; i++) {
    if (direction === DIRECTIONS.HORIZONTAL) {
      if (board[row][col + i] !== 0) {
        console.log("There's already a ship there. Try again.");
        return false;
      }
    } else {
      if (board[row + i][col] !== 0) {
        console.log("There's already a ship there. Try again.");
        return false;
      }
    }
  }

  for (let i = 0; i < ship.size; i++) {
    if (direction === DIRECTIONS.HORIZONTAL) {
      board[row][col + i] = 1;
    } else {
      board[row + i][col] = 1;
    }
  }

  return true;
}

function createEmptyBoard(boardSize) {
  return Array.from({length: boardSize}, () => Array(boardSize).fill(0));
}

let aiBoardState = createEmptyBoard(gameBoardSize);

let playersTurn = true;

function nextTurn() {
  playersTurn = !playersTurn;
}

function checkPlayerTurn() {
  if (!playersTurn) {
    aiAttack();
  }
}

function attack(board, row, column) {
  if (board[row][column] === 1) {
    console.log("Hit!");
    board[row][column] = 0;
    nextTurn();
  } else {
    console.log("you missed!");
    nextTurn();
  }
}

function aiAttack() {
  const row = Math.floor(Math.random() * gameBoardSize);
  const col = Math.floor(Math.random() * gameBoardSize);
  attack(playerBoard, row, col);
}

function playerAttack(targetRow, targetCol) {
  attack(aiBoard, targetRow, targetCol);
}

givePlayerPieces();
