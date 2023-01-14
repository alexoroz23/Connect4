/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
    constructor(p1, p2, height = 6, width = 7) {
      this.players = [p1, p2];
      this.height = height;
      this.width = width;
      this.currPlayer = p1;
      this.makeBoard();
      this.makeHtmlBoard();
      this.gameOver = false;
    }
  
    /** makeBoard: create in-JS board structure:
     *   board = array of rows, each row is array of cells  (board[y][x])
     */
    makeBoard() {
      this.board = [];
      for (let y = 0; y < this.height; y++) {
        this.board.push(Array.from({ length: this.width }));
      }
    }
  
    /** makeHtmlBoard: make HTML table and row of column tops.  */
  
    makeHtmlBoard() {
      const board = document.getElementById('board');
      board.innerHTML = '';
  
      // make column tops (clickable area for adding a piece to that column)
      // "top" refers to the top row of the board,"tr" a table row is made at the top, setting attribute to top with a name of 'id' and value of 'column-top'(check css). The event listener adds a click property to the top and a function for the rest of the board
      const top = document.createElement('tr');
      top.setAttribute('id', 'column-top');
  
      // store a reference to the handleClick bound function 
      // so that we can remove the event listener correctly later
      // 
      this.handleGameClick = this.handleClick.bind(this);
      
      top.addEventListener("click", this.handleGameClick);
      // 'td' will define a cell of a table that has data
      for (let x = 0; x < this.width; x++) {
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
      }
  
      board.append(top);
  
      // make main part of board
      // This part creates the rest of the board, y is being used to make the 6 deep rows while x is being used to create the width, both x and y make out the table data.
      for (let y = 0; y < this.height; y++) {
        const row = document.createElement('tr');
      
        for (let x = 0; x < this.width; x++) {
          const cell = document.createElement('td');
          cell.setAttribute('id', `${y}-${x}`);
          row.append(cell);
        }
      
        board.append(row);
      }
    }
  
    /** findSpotForCol: given column x, return top empty y (null if filled) */
    // this function makes the click event listener from top react and find the x column and read if the y column is empty make it null if not add.
    findSpotForCol(x) {
      for (let y = this.height - 1; y >= 0; y--) {
        if (!this.board[y][x]) {
          return y;
        }
      }
      return null;
    }
  
    /** placeInTable: update DOM to place piece into HTML board */
    // this function actually makes it possible to see the pieces on the board and make the game playable
    placeInTable(y, x) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.style.backgroundColor = this.currPlayer.color;
  
      const spot = document.getElementById(`${y}-${x}`);
      spot.append(piece);
    }
  
    /** endGame: announce game end */
    // This line gives an alert with any message, If this line is not present it will let the player that won keep playing pieces without a pause
    endGame(msg) {
      alert(msg);
      const top = document.querySelector("#column-top");
      top.removeEventListener("click", this.handleGameClick);
    }
  
    /** handleClick: handle click of column top to play piece */
  
    handleClick(evt) {
      // get x from ID of clicked cell
      const x = +evt.target.id;
  
      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }
  
      // place piece in board and add to HTML table
      // This code keeps all the pieces in the board so that it can be counted towards the end result of the game. If not present it makes the pieces stack on top of each column.
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);
  
      // check for tie
      // On the board this line checks every row and on the row checks every cell if each cell has a piece than it became true so it'll return "tie" with end game
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      }
  
      // check for win
      if (this.checkForWin()) {
        this.gameOver = true;
        return this.endGame(`The ${this.currPlayer.color} player won!`);
      }
  
      // switch players
      // makes it so the same player does not go more than once per turn
      this.currPlayer =
        this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    }
  
    /** checkForWin: check board cell-by-cell for "does a win start here?" */
  
    checkForWin() {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      const _win = cells =>
        cells.every(
          ([y, x]) =>
            y >= 0 &&
            y < this.height &&
            x >= 0 &&
            x < this.width &&
            this.board[y][x] === this.currPlayer
        );
  
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          // At first glance this what makes the game know what player wins which consists of horizontal, vertival, diagnol left or right.
          // It is basically counting the cells and the relavance to each other to see if it can be considered a win.
          // get "check list" of 4 cells (starting here) for each of the different
          // 4 ways to win
  
          const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
          const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
          const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
          const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
          //This is refering back to the variables above labeling them which can be a possible win. (|| meaning or)
          // find winner (only checking each win-possibility as needed)
          if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
            return true;
          }
        }
      }
    }
  }
  // player class 
  class Player {
    constructor(color) {
      this.color = color;
    }
  }
  
  document.getElementById('start-game').addEventListener('click', () => {
    let p1 = new Player(document.getElementById('p1-color').value);
    let p2 = new Player(document.getElementById('p2-color').value);
    new Game(p1, p2);
  });