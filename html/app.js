//APW Javascript Section 4 Anthony Pfau, Ahmed Kaced, Christopher Martinez, Christian Betia

/*
document.querySelector returns the first element that matches
. used to grab class attribute, # used to grab id attribute
gb-container = gameboard
ship-container = Your ships container
rotate button
start button
turnInfo = info regarding result of moves 
turnDisplay = who's turn is it
username = username from server
*/

const gbContainer = document.querySelector('#gb-container')
const shipContainer = document.querySelector('.ship-container')
const rotateButton = document.querySelector('#rotate-button')
const startButton = document.querySelector('#start-button')
const turnInfo = document.querySelector('#info')
const turnDisplay = document.querySelector('#turn-display')
const username = document.querySelector('#username span');

//Fetches Users username from server, display it on gamepage
fetch('/getUsername')
  .then(res => res.text())
  .then(data => username.textContent = data);


/*
function to rotate user ships, if angle of ship is equal to 0 degrees, then rotate to 90
works vice-versa, if ship angle is 90 degrees, rotates back to 0
*/

let angle = 0
function rotate() {
  const shipOption = Array.from(shipContainer.children)
  if (angle === 0) {
    angle = 90;
  } else {
    angle = 0;
  }

  shipOption.forEach(optionShip => optionShip.style.transform = `rotate(${angle}deg)`)
}
rotateButton.addEventListener('click', rotate)


/*create gameboard, each board composed of 100 squares. Each square holds an id of i
block id is used later to determine if block is taken by ship, helps to register
hits or misses which then get added to an array
*/

const width = 10

function createBoard(user) {
  const gameBoardContainer = document.createElement('div')
  gameBoardContainer.classList.add('game-board')
  gameBoardContainer.id = user

  for (let i = 0; i < width * width; i++) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.id = i
    gameBoardContainer.append(block)
  }

  gbContainer.append(gameBoardContainer)
}
createBoard('player')
createBoard('computer')

//class def for creating ship objects
class Ship {
  constructor(name, length) {
    this.name = name
    this.length = length
  }
}

const destroyer = new Ship('destroyer', 2)
const submarine = new Ship('submarine', 3)
const cruiser = new Ship('cruiser', 3)
const battleship = new Ship('battleship', 4)
const carrier = new Ship('carrier', 5)
const ships = [destroyer, submarine, cruiser, battleship, carrier]


/*checks the placement of the player ships, whether or not its a valid space.
if horizontal, checks that the ship has enough space to the right of the start index,
if not, the start index gets moved by the difference of ship length and available space.
For example: carrier = ship.length 5 , so start index must be width of board - 5, the first available space
would be 5 blocks left of the right side of the gameboard.

if vertical, checks whether ship can fit in space below startIndex, if not moves the start
index up by the difference of ship length and width of the game board and the available space.

function also generates array of shipBlocks that correspond with starting index, and the space
it would occupy based on length.

ensures that no two ships overlap, and that ships cannot fit outside the gameboard,
returns object with shipBlocks valid and notTaken.

function makes it so a ship can't be split between two rows or split between two columns.

function called in add ship piece, and in highlight placement function
https://stackoverflow.com/questions/65619113/validating-a-battleship-board-2d-array-how-to-check-possibilities-for-boards-v
*/

function checkShipPlacement(allBoardBlocks, shipOrientation, startIndex, ship) {
  let validStart;
  /*If the ship is horizontal, the starting index should not exceed maximum index in 
  row where the ship ends. If ship is vertical, starting index should 
   not exceed maximum index in the column where the ship ends.*/
  if (shipOrientation) {
    if (startIndex <= width * width - ship.length) {
      validStart = startIndex;
    } else {
      validStart = width * width - ship.length;
    }
  } else {
    if (startIndex <= width * width - width * ship.length) {
      validStart = startIndex;
    } else {
      validStart = startIndex - ship.length * width + width;
    }
  }

  let shipBlocks = [];
  for (let i = 0; i < ship.length; i++) {
    if (shipOrientation) {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
    } else {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i * width]);
    }
  }

   /*checks if the ship blocks are valid. If the ship is horizontal, uses every method to check
   each block for given ship is in the same row. does this by comparing the modulus of the 
   block's ID with width of board. If modulo != width - (shipBlocks.length - (index + 1)),
   function sets the valid variable to true and returns true. otherwise false.
   
   if ship is vertical, ensures each ship block is in same column.
   */
  let valid;
  if (shipOrientation) {
    shipBlocks.every((_shipBlock, index) => {
      if (shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1))) {
        valid = true;
        return true;
      } else {
        valid = false;
        return false;
      }
    });

  } else {
    shipBlocks.every((_shipBlock, index) => {
      if (shipBlocks[0].id < 90 + (width * index + 1)) {
        valid = true;
        return true;
      } else {
        valid = false;
        return false;
      }
    });
  }
  //checks if all the ship blocks are not taken by looking for taken class
  const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'));
  return { shipBlocks, valid, notTaken };
}



/*function to add ship piece to gameboard, does so for both computer and player pieces
uses random boolean to determine if it should be horizontal or vertical
calls checkShipPlacement, to ensure placement is valid
If the ship placement is valid and the blocks are not taken, the function 
adds the ship class and the taken class to each of the ship blocks.
For computer, if placement is NOT valid, recursively calls itself to try a new start location
*/

let notDropped
function addShipPiece(user, ship, startId) {
  const allBoardBlocks = document.querySelectorAll(`#${user} div`);
  let randomBoolean = Math.random() < 0.5;
  let shipOrientation;
  if (user === 'player') {
    shipOrientation = angle === 0;
  } else {
    shipOrientation = randomBoolean;
  }
  let randomStartIndex = Math.floor(Math.random() * width * width);
  let startIndex;
  if (startId) {
    startIndex = startId;
  } else {
    startIndex = randomStartIndex;
  }
  const { shipBlocks, valid, notTaken } = checkShipPlacement(allBoardBlocks, shipOrientation, startIndex, ship);
  if (valid && notTaken) {
    shipBlocks.forEach(shipBlock => {
      shipBlock.classList.add(ship.name);
      shipBlock.classList.add('taken');
    });
  } else {
    if (user === 'computer') {
      addShipPiece(user, ship, startId);
    }
    if (user === 'player') {
      notDropped = true;
    }
  }
}
ships.forEach(ship => addShipPiece('computer', ship))


//Functions allowing player to drag ships to gameboard
//https://www.javascripttutorial.net/web-apis/javascript-drag-and-drop/

let draggedShip
const shipOption = Array.from(shipContainer.children)
shipOption.forEach(shipOption => shipOption.addEventListener('dragstart', dragStart))

const allPlayerBlocks = document.querySelectorAll('#player div')
allPlayerBlocks.forEach(playerBlock => {
  playerBlock.addEventListener('dragover', dragOver)
  playerBlock.addEventListener('drop', dragEnd)
})

function dragStart(e) {
  notDropped = false
  draggedShip = e.target
}

function dragOver(e) {
  e.preventDefault()
  const ship = ships[draggedShip.id]
  highlightArea(e.target.id, ship)
}

function dragEnd(e) {
  const startId = e.target.id
  const ship = ships[draggedShip.id]
  addShipPiece('player', ship, startId)
  if (!notDropped) {
    draggedShip.remove()
  }
}

/* function to Highlight placement of the ship, shows where it will be placed on the board
Check ship placement function called here to act as visual indicator for valid/invalid spots on gameboard */

function highlightArea(startIndex, ship) {
  const allBoardBlocks = document.querySelectorAll('#player div')
  let shipOrientation = angle === 0

  const { shipBlocks, valid, notTaken } = checkShipPlacement(allBoardBlocks, shipOrientation, startIndex, ship)

  if (valid && notTaken) {
    shipBlocks.forEach(shipBlock => {
      shipBlock.classList.add('highlight')
      setTimeout(() => shipBlock.classList.remove('highlight'), 500)
    })
  }
}

//THIS SECTION INCLUDES ALL THE GAME LOGIC FUNCTIONS //

/* start game function, Will only work if all player ships have been placed on board
Listener waits for player click on startGame button
*/

startButton.addEventListener('click', startGame)
let gameOver = false
let playerTurn
let playerHits = []
let computerHits = []
const playerSunkShips = []
const computerSunkShips = []


function startGame() {
  if (playerTurn === undefined) {
    if (shipContainer.children.length != 0) {
      turnInfo.textContent = 'Please place all your ships first!'
    } else {
      const allBoardBlocks = document.querySelectorAll('#computer div')
      allBoardBlocks.forEach(block => block.addEventListener('click', playerClick))
      playerTurn = true
      turnDisplay.textContent = 'Its Your Turn!'
      turnInfo.textContent = 'The game has started! Make your move!'
    }

  }

}



/*
Event handler function for when player Clicks on computer board,
if clicked block contains 'taken' class, registers successful hit, otherwise registers as miss class
extracts classes of block, then adds to playerHits array or computerHits array.
After click on board, sets players turn to false, making it the computers turn.
*/

function playerClick(e) {

  if (!gameOver) {
    if (e.target.classList.contains('taken')) {
      e.target.classList.add('hit')
      turnInfo.textContent = 'You hit the computers ship!'
      let classes = Array.from(e.target.classList)
      classes = classes.filter(className => className !== 'block')
      classes = classes.filter(className => className !== 'hit')
      classes = classes.filter(className => className !== 'taken')
      playerHits.push(...classes)
      checkGameOver('player', playerHits, playerSunkShips)

    }
    if (!e.target.classList.contains('taken')) {
      turnInfo.textContent = 'You hit Nothing this time X .'
      e.target.classList.add('miss')
    }
    playerTurn = false
    const allBoardBlocks = document.querySelectorAll('#computer div')
    allBoardBlocks.forEach(block => block.replaceWith(block.cloneNode(true)))
    setTimeout(computerTurn, 3000)
  }
}

/* Function defines computer AI, currently Computer only randomly selects spaces.
Very first thing it checks is if game is over, if NOT then the computer's move begins.
setTimeout simulates computer thinking, then the game chooses a random number between 0 and
100 to decide which space to attack. IF space has hit and taken class = space already hit, -
-> calls itself to select new space. if space has taken class but NOT hit class = computer hit
player ship. checkGameOver() keeps tracker of computerHits and computerSunkShips.
setTimeout used to simulate computer "thinking", takes a couple seconds before performing move.
*/

function computerTurn() {
  if (!gameOver) {
    turnDisplay.textContent = 'Computers Turn!'
    turnInfo.textContent = 'The computer is thinking...'

    setTimeout(() => {
      let randomGo = Math.floor(Math.random() * width * width)
      const allBoardBlocks = document.querySelectorAll('#player div')

      if (allBoardBlocks[randomGo].classList.contains('taken') && allBoardBlocks[randomGo].classList.contains('hit')) {
        computerTurn()
        return
      } else if (
        allBoardBlocks[randomGo].classList.contains('taken') && !allBoardBlocks[randomGo].classList.contains('hit')) {
        allBoardBlocks[randomGo].classList.add('hit')
        turnInfo.textContent = 'The Computer hit your ship!'
        let classes = Array.from(allBoardBlocks[randomGo].classList)
        classes = classes.filter(className => className !== 'block')
        classes = classes.filter(className => className !== 'hit')
        classes = classes.filter(className => className !== 'taken')
        computerHits.push(...classes)
        checkGameOver('computer', computerHits, computerSunkShips)
      } else {
        turnInfo.textContent = 'The computer didnt hit anything.'
        allBoardBlocks[randomGo].classList.add('miss')
      }
    }, 2000)

    setTimeout(() => {
      playerTurn = true
      turnDisplay.textContent = 'Your Turn!'
      turnInfo.textContent = 'Please take your turn.'
      const allBoardBlocks = document.querySelectorAll('#computer div')
      allBoardBlocks.forEach(block => block.addEventListener('click', playerClick))
    }, 6000)
  }
}

/*
Function to "Check Status of game", checks if ships have been sunk, and updates accordingly.
checkShip function uses filter method to check if number of hits on ship == to ship length.
This determines if ship is sunk, then pushes ship name to userSunkShips array.

if all ships have been sunk, AKA if shipsSunk = 5, then GAME OVER.
Tried to push wins + losses to mongo user collection, but doesn't work at the moment
*/

function checkGameOver(user, userHits, userSunkShips) {
  function checkShip(shipName, shipLength) {
    if (
      userHits.filter(storedShipName => storedShipName === shipName).length === shipLength
    ) {

      if (user === 'player') {
        turnInfo.textContent = `you sunk the computer's ${shipName}`
        playerHits = userHits.filter(storedShipName => storedShipName !== shipName)
      }
      if (user === 'computer') {
        turnInfo.textContent = `The computer sunk your ${shipName}`
        computerHits = userHits.filter(storedShipName => storedShipName !== shipName)
      }
      userSunkShips.push(shipName)
    }

  }
  checkShip('destroyer', 2)
  checkShip('submarine', 3)
  checkShip('cruiser', 3)
  checkShip('battleship', 4)
  checkShip('carrier', 5)


  if (playerSunkShips.length === 5) {
    turnInfo.textContent = 'You Sunk all the Computers Ships. YOU WIN'
    gameOver = true
    updateWinLoss(username, 'wins')
    //Express session maintains user logged into gamepage, thought this code would push the data to MongoDB
  }
  if (computerSunkShips.length === 5) {
    turnInfo.textContent = 'The computer sunk all your ships. YOU LOSE'
    gameOver = true
    updateWinLoss(username, 'losses')
    //Express session maintains user logged into gamepage, thought this code would push the data to MongoDB
  }
}

//Attempt to push wins + losses to Mongo User collection

function updateWinLoss(username, winLoss) {
  fetch('/updateWinLoss', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, winLoss })
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err))
}
