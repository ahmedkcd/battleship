const playerBoard = document.getElementById('player-board');
const aiBoard = document.getElementById('ai-board');

const boardSize = 5;
const ships = [

  {name: 'Carrier', size: 5 },
  {name: 'Battleship', size: 4 },
  {name: 'Cruiser', size: 3 },
  {name: 'Submarine', size: 3},
  {name: 'Destroyer', size: 2}

];

const DIRECTIONS = {
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical',
};

let playerBoardState = createEmptyBoard(boardSize);
let aiBoardState = createEmptyBoard(boardSize);

initalizeBoards(playerBoardState, aiBoardState);

renderBoard(playerBoard, playerBoardState, true);

renderBoard(aiBoard, aiBoardState, false);

function initializeBoards(playerBoard, aiBoard) {
    for (const ship of ships) {
        placeShipsRandomly(playerBoard, ship);
        placeShipsRandomly(aiBoard, ship);
    }
}

function placeShipsRandomly(board, ship) {
    let placed = false;
    while(!placed) {
        const direction = Math.random() < 0.5 ? DIRECTIONS.HORIZONTAL : DIRECTIONS.VERTICAL;
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        placed = placeShip(board, ship, direction, row, col);
    
    }   
}

function createEmptyBoard(size) {
    const board =[];
    for(let i=0; i< size; i++) {
        const row = [];
        for(let j=0; j< size; j++) {
            row.push('')
        }
        board.push(row);
    }
    return board;
}

function placeShip(board, ship, direction, row, col) {
    const size = ship.size;
  
    if (direction === DIRECTIONS.HORIZONTAL) {
      if (col + size > BOARD_SIZE) {
        return false;
      }
      for (let i = col; i < col + size; i++) {
        if (board[row][i] !== '') {
          return false;
        }
      }
      for (let i = col; i < col + size; i++) {
        board[row][i] = ship.name;
      }
      return true;
    } else if (direction === DIRECTIONS.VERTICAL) {
      if (row + size > BOARD_SIZE) {
        return false;
      }
      for (let i = row; i < row + size; i++) {
        if (board[i][col] !== '') {
          return false;
        }
      }
      for (let i = row; i < row + size; i++) {
        board[i][col] = ship.name;
      }
      return true;
    }
    return false;
  }






function renderBoard(container, boardState, isPlayerBoard ) {
  for(let row = 0; row < boardState.length; row++) {
    for(let col = 0; col < boardState[row].length; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if(isPlayerBoard) {
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.addEventListener('click', () => {
            handleCellClick(row, col);
        });
      }
      cell.innerText = isPlayerBoard ? boardState[row][col] : ';'
      container.appendChild(cell);
    }
  }
}
