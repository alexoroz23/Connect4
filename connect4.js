/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard () {
  for (let y = 0; y < HEIGHT; y ++) {
    board.push(Array.from({length: WIDTH}));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const board = document.getElementById('board');
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"

// "top" refers to the top row of the board,"tr" a table row is made at the top, setting attribute to top with a name of 'id' and value of 'column-top'(check css). The event listener adds a click property to the top and a function for the rest of the board
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
// 'td' will define a cell of a table that has data
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }

  board.append(top);

  // This part creates the rest of the board, y is being used to make the 6 deep rows while x is being used to create the width, both x and y make out the table data. 
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");

    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    board.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

// this function makes the click event listener from top react and find the x column and read if the y column is empty make it null if not add.
function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
// this function actually makes it possible to see the pieces on the board and make the game playable
function placeInTable(y, x) {
     const piece = document.createElement('div');
     piece.classList.add('piece');
     piece.classList.add(`p${currPlayer}`);
    //  piece.style.top = -50 * (y + 2); 

     const spot = document.getElementById(`${y}-${x}`);
     spot.append(piece);
}

/** endGame: announce game end */
// This line gives an alert with any message, If this line is not present it will let the player that won keep playing pieces without a pause
function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // This code keeps all the pieces in the board so that it can be counted towards the end result of the game. If not present it makes the pieces stack on top of each column. 
  board[y][x] = currPlayer;  
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // On the board this line checks every row and on the row checks every cell if each cell has a piece than it became true so it'll return "tie" with end game
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  }

  // switch players
  // makes it so the same player does not go more than once per turn
  currPlayer = currPlayer === 1 ? 2 : 1; 
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // At first glance this what makes the game know what player wins which consists of horizontal, vertival, diagnol left or right.
      // It is basically counting the cells and the relavance to each other to see if it can be considered a win.
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      //This is refering back to the variables above labeling them which can be a possible win. (|| meaning or)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
