const gameBoardSize = 10;

let playerBoard = Array.from({length: gameBoardSize}, () => Array(gameBoardSize).fill(0));
let aiBoard = Array.from({length: gameBoardSize}, () => Array(gameBoardSize).fill(0));
//this creates the game board for the A.I. and the player


const ships = [
  {name: 'Carrier', size: 5},
  {name: 'Battleship', size: 4},
  {name: 'Cruiser', size: 3},
  {name: 'Submarine', size: 3},
  {name: 'Destroyer', size: 2}
];
//this creates the ships

const DIRECTIONS = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical'
};
//this defines the directions

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
//this gives the player their pieces

function placeShip(board, ship, row, col, direction) {
  if (
    (direction === DIRECTIONS.HORIZONTAL && col + ship.size > gameBoardSize) ||
    (direction === DIRECTIONS.VERTICAL && row + ship.size > gameBoardSize)
  ) {
    console.log("Ship placement out of bounds.");
    return false;
  }//sentinel code

  for (let i = 0; i < ship.size; i++) {
    if (direction === DIRECTIONS.HORIZONTAL) {
      if (board[row][col + i] !== 0) {
        console.log("There's already a ship there. Try again.");
        return false;
      }//sentinel code
    } else {
      if (board[row + i][col] !== 0) {
        console.log("There's already a ship there. Try again.");
        return false;
      }
    }
  }//sentinel code

  for (let i = 0; i < ship.size; i++) {
    if (direction === DIRECTIONS.HORIZONTAL) {
      board[row][col + i] = 1;
    } else {
      board[row + i][col] = 1;
    }
  }

  return true;
}//places ships

let playersTurn = true;

function nextTurn() {
  playersTurn = !playersTurn;
}

function checkPlayerTurn() {
  if (!playersTurn) {
    aiAttack();
  }
}//this code checks whos turn it is


function canPlaceShip(board, ship, row, col, direction) {
  if (
    (direction === DIRECTIONS.HORIZONTAL && col + ship.size > gameBoardSize) ||
    (direction === DIRECTIONS.VERTICAL && row + ship.size > gameBoardSize)
  ) {
    return false;
  }

  for (let i = 0; i < ship.size; i++) {
    if (direction === DIRECTIONS.HORIZONTAL) {
      if (board[row][col + i] !== 0) {
        return false;
      }
    } else {
      if (board[row + i][col] !== 0) {
        return false;
      }
    }
  }

  return true;
}

function aiPlaceShip() {
  for (const ship of ships) {
    let placed = false;
    while (!placed) {
      let row = Math.floor(Math.random() * gameBoardSize);
      let col = Math.floor(Math.random() * gameBoardSize);
      let direction = Math.random() < 0.5 ? DIRECTIONS.HORIZONTAL : DIRECTIONS.VERTICAL;

      if (canPlaceShip(aiBoard, ship, row, col, direction)) {
        for (let i = 0; i < ship.size; i++) {
          if (direction === DIRECTIONS.HORIZONTAL) {
            aiBoard[row][col + i] = 1;
          } else {
            aiBoard[row + i][col] = 1;
          }
        }
        placed = true;
      }
    }
  }
}// all of this code creates ship placements for the A.I.s board


function attack(board, row, column) {
  if (board[row][column] === 1) {
    console.log("Hit!");
    board[row][column] = 0;
    nextTurn();
  } else {
    console.log("you missed!");
    nextTurn();
  }
}// this is the attack function for the player

function aiAttack() {
  const row = Math.floor(Math.random() * gameBoardSize);
  const col = Math.floor(Math.random() * gameBoardSize);
  attack(playerBoard, row, col);
} //this is the attack function for the A.I.

function playerAttack(targetRow, targetCol) {
  attack(aiBoard, targetRow, targetCol);
}//this is the player attack function


function validInput(input, min, max) {
  return !isNaN(input) && input >= min && input <= max;
}

// this checks for the winner
function isWinner(board) {
  return board.every(row => row.every(cell => cell === 0));
}




// This is the main game loop
function gameLoop() {
  while (!isWinner(playerBoard) && !isWinner(aiBoard)) {
    let row = parseInt(prompt("Enter the row you want to attack:"));
    let col = parseInt(prompt("Enter the column you want to attack:"));

    if (validInput(row, 0, gameBoardSize - 1) && validInput(col, 0, gameBoardSize - 1)) {
      playerAttack(row, col);
      checkPlayerTurn();
    } else {
      console.log("Invalid input. Please try again.");
    }
  }

  if (isWinner(playerBoard)) {
    console.log("AI wins!");
  } else {
    console.log("Player wins!");
  }
}






givePlayerPieces();
aiPlaceShip();
gameLoop();
