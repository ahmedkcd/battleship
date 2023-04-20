const gameBoardSize = 10;

let playerBoard = Array.from({length: gameBoardSize}, () => Array(gameBoardSize).fill(0));
let aiBoard = Array.from({length: gameBoardSize}, () => Array(gameBoardSize).fill(0));
//this code defines the game board for the A.I. and the player

const ships = [
  {name: 'Carrier', size: 5},
  {name: 'Battleship', size: 4},
  {name: 'Cruiser', size: 3},
  {name: 'Submarine', size: 3},
  {name: 'Destroyer', size: 2}
];//This part defines the ships

const DIRECTIONS = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical'
};// this code defines the directions

function givePlayerPieces() {
  for (const ship of ships) {
    let placed = false;
    while (!placed) {
      let playerDirection = prompt("What direction do you want to place your " + ship.name + "? (V)ertical or (H)orizontal").toUpperCase();
      let row = parseInt(prompt("What row do you want to place your " + ship.name + "?"));
      let col = parseInt(prompt("What column do you want to place your " + ship.name + "?"));

      const direction = playerDirection === 'V' ? DIRECTIONS.VERTICAL : DIRECTIONS.HORIZONTAL;
      placed = placeShip(ship, row, col, direction); 
// this code specifically places the ships after the player tells us where they want the ships at
    }
  }
}//this code asks the player about the placement of their ships and all

function placeShip(ship, row, col, direction) {
  if (
    (direction === DIRECTIONS.HORIZONTAL && col + ship.size > gameBoardSize) ||
    (direction === DIRECTIONS.VERTICAL && row + ship.size > gameBoardSize)
  ) {
    console.log("Ship placement out of bounds.");
    return false;
  }// this is sentinel code

  for (let i = 0; i < ship.size; i++)
 {
    if (direction === DIRECTIONS.HORIZONTAL) {
      if (gameBoard[row][col + i] !== 0) {
        console.log("There's already a ship at the specified location. Try again.");
        return false;
      }//this is more sentinel code
    } else {
      if (gameBoard[row + i][col] !== 0) {
        console.log("There's already a ship at the specified location. Try again.");
        return false;
      }//this is more sentinel code
    }
  }

  for (let i = 0; i < ship.size; i++) {
    if (direction === DIRECTIONS.HORIZONTAL) {
      gameBoard[row][col + i] = 1;
    } else {
      gameBoard[row + i][col] = 1;
    }//This code places the ships in the array as a value of 1 accross the length of the ship
}

  return true;
}




givePlayerPieces();
