//APW Javascript Section 4 Anthony Pfau, Ahmed Kaced, Christopher Martinez, Christian Betia
/*
document.querySelector returns the first element that matches
. used to grab class attribute, # used to grab id attribute
gb-container = gameboard
ship-container = Your ships container
flip button
start button
turnInfo = info regarding result of moves 
turnDisplay = who's turn is it
*/
const gbContainer = document.querySelector('#gb-container')
const shipContainer = document.querySelector('.ship-container')
const flipButton = document.querySelector('#flip-button')
const startButton = document.querySelector('#start-button')
const turnInfo = document.querySelector('#info')
const turnDisplay = document.querySelector('#turn-display')

const username = document.querySelector('#username span');
fetch('/getUsername')
  .then(res => res.text())
  .then(data => username.textContent = data);


/*
function to flip user ships, if angle of ship is equal to 0 degrees, then flip to 90
works vice-versa, if ship angle is 90 degrees, flips back to 0
*/
let angle = 0
function flip() {
const optionShips = Array.from(shipContainer.children)
    if (angle === 0) {
      angle = 90;
    } else {
      angle = 0;
    }

    optionShips.forEach(optionShip => optionShip.style.transform = `rotate(${angle}deg)`)
}
flipButton.addEventListener('click', flip)


/*create gameboard, each board composed of 100 squares. Each square holds an id of i
block id is used later to determine if block is taken by ship, helps to register
hits or misses which then get added to an array
*/
const width = 10

function createBoard(color, user) {
  const gameBoardContainer = document.createElement('div')
  gameBoardContainer.classList.add('game-board')
  gameBoardContainer.style.backgroundColor = color
  gameBoardContainer.id = user

  for(let i = 0; i < width * width; i++) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.id = i
    gameBoardContainer.append(block)
  }

  gbContainer.append(gameBoardContainer)
}
//giving color to the boards through javascript. Computer board color must always remain SAME color as computer ship pieces
createBoard('aquamarine', 'player')
createBoard('aquamarine', 'computer')

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

/*checks the placement of the player ships, whether or not its a valid space
if horizontal, checks that the ship has enough space to the right of the start index,
if not, the start index gets moved by the difference of ship length and available space.
For example: carrier = ship.length 5 , so start index must be width of board - 5

if vertical, checks whether ship can fit in space below startIndex, if not moves the start
index up by the difference of ship length and width of the game board and the available space

function also generates array of shipBlocks that correspond with starting index, and the space
it would occupy based on length

ensures that no two ships overlap, and that ships cannot fit outside the gameboard,
returns object with shipBlocks valid and notTaken

function called in add ship piece, and in highlight placement function
used this as resource to help with game Logic 
https://jhonny-chamoun.medium.com/battleship-the-game-step1-userinterface-and-game-logic-8abba52746cd
*/

function checkShipPlacement(allBoardBlocks, shipOrientation, startIndex, ship) {
    let validStart;
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
const optionShips = Array.from(shipContainer.children)
optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart))

const allPlayerBlocks = document.querySelectorAll('#player div')
allPlayerBlocks.forEach(playerBlock => {
  playerBlock.addEventListener('dragover', dragOver)
  playerBlock.addEventListener('drop', dropShip)
})

function dragStart(e){
  notDropped = false
  draggedShip = e.target
}

function dragOver(e) {
  e.preventDefault()
  const ship = ships[draggedShip.id]
  highlightArea(e.target.id, ship)
}

function dropShip(e) {
  const startId = e.target.id
  const ship = ships[draggedShip.id]
  addShipPiece('player', ship, startId)
  if (!notDropped) {
    draggedShip.remove()
  }
}

/* function to Highlight placement of the ship, shows where it will be placed on the board
Check validity function called here to show visual indicator valid spots */

function highlightArea( startIndex, ship) {
  const allBoardBlocks = document.querySelectorAll('#player div')
  let shipOrientation = angle === 0

  const { shipBlocks, valid, notTaken } = checkShipPlacement(allBoardBlocks, shipOrientation, startIndex, ship)

  if (valid && notTaken) {
    shipBlocks.forEach(shipBlock => {
      shipBlock.classList.add('hover')
      setTimeout(() => shipBlock.classList.remove('hover'), 500)
    })
  }
}

//THIS SECTION INCLUDES ALL THE GAME LOGIC FUNCTIONS //

let gameOver = false
let playerTurn

/* start game function, Will only work if all player ships have been placed on board
Listener waits for player click on startGame button
*/

startButton.addEventListener('click', startGame)

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
      allBoardBlocks.forEach(block => block.addEventListener('click', handlePlayerClick))
      playerTurn = true
      turnDisplay.textContent = 'Its Your Turn!'
      turnInfo.textContent = 'The game has started! Make your move!'
    }
    
  }
  
}



/*
Event handler function for when player Clicks on computer board,
if clicked block contains 'taken' class, registers successful hit, otherwise registers as empty class
extracts classes of block, then adds to playerHits array or computerHits array
After click on board, sets players turn to false, making it the computers turn.
*/

function handlePlayerClick(e) {

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
      e.target.classList.add('empty')
    }
    playerTurn = false
    const allBoardBlocks = document.querySelectorAll('#computer div')
    allBoardBlocks.forEach(block => block.replaceWith(block.cloneNode(true)))
    setTimeout(computerGo, 3000)
  }
}

/* Function defines computer AI, currently Computer only randomly selects spaces.
Very first thing it checks is if game is over, if NOT then the computer's move begins.
setTimeout simulates computer thinking, then the game chooses a random number between 0 and
100 to decide which space to attack. IF space has hit and taken class = space already hit, -
-> calls itself to select new space. if space has taken class but NOT hit class = computer hit
player ship. checkGameOver() keeps tracker of computerHits and computerSunkShips
*/
function computerGo() {
  if (!gameOver) {
    turnDisplay.textContent = 'Computers Turn!'
    turnInfo.textContent = 'The computer is thinking...'

    setTimeout(() => {
      let randomGo = Math.floor(Math.random() * width * width)
      const allBoardBlocks = document.querySelectorAll('#player div')

      if (allBoardBlocks[randomGo].classList.contains('taken') &&
          allBoardBlocks[randomGo].classList.contains('hit')
      ) {
        computerGo()
        return
      } else if (
        allBoardBlocks[randomGo].classList.contains('taken') &&
        !allBoardBlocks[randomGo].classList.contains('hit')
      ) {
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
        allBoardBlocks[randomGo].classList.add('empty')
      }
    }, 3000)

    setTimeout(() => {
      playerTurn = true
      turnDisplay.textContent = 'Your Turn!'
      turnInfo.textContent = 'Please take your turn.'
      const allBoardBlocks = document.querySelectorAll('#computer div')
      allBoardBlocks.forEach(block => block.addEventListener('click', handlePlayerClick))
    }, 6000)
  }
}

/*
Function to "Check Score of game", checks if ships have been sunk, and updates accordingly
checkShip function uses filter method to check if number of hits on ship = to ship length
This determines if ship is sunk, pushes ship name to userSunkShips array.

Also checks if all ships have been sunk, if shipsSunk = 5, then GAME OVER
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

  console.log('playerHits', playerHits)
  console.log('playerSunkShips', playerSunkShips)

  if (playerSunkShips.length === 5) {
    turnInfo.textContent = 'You Sunk all the Computers Ships. YOU WIN'
    gameOver = true
    updateWinLoss(username, 'wins')
  }
  if (computerSunkShips.length === 5) {
    turnInfo.textContent = 'The computer sunk all your ships. YOU LOSE'
    gameOver = true
    updateWinLoss(username, 'losses')
  }
}

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
