"use strict"
const ticTacToe = (() => {  
  const playerFactory = (symbol) => {
    const score = 0;
    return { score, symbol };
  };


  const displayController = (() => {

    const displayTile = (tile, symbol) => {
      tile.textContent = symbol;
    };

    const displayWinMessage = (symbol) => {
      const display = document.querySelector("#game-status");
      display.textContent = `Congrats to Player ${symbol} on winning!!`;
    };

    const displayTieMessage = () => {
      const display = document.querySelector("#game-status");
      display.textContent = "Tie!";
    }

    const resetDisplay = () => {
      console.log("test");
    };

    return {
      displayTile,
      displayWinMessage,
      displayTieMessage
    }
  })();

  const gameBoard = (() => {
    const ROW_SIZE = 3;
    const board = [[...Array(ROW_SIZE)], [...Array(ROW_SIZE)], 
      [...Array(ROW_SIZE)]];

    const setBoardTile = (row, col, symbol) => {
      board[row][col] = symbol;
    };

    const getBoardTile = (row, col) => {
      return board[row][col];
    };

    const isBoardFull = () => {
      for(let row = 0; row < board.length; row++) {
        for(let col = 0; col < board[row].length; col++) {
          if(board[row][col] == undefined) {
            return false;
          }
        }
      }
      return true;
    }

    return {
      setBoardTile,
      getBoardTile,
      isBoardFull
    };
  })();

  const gameLogic = (() => {
    const ROW_SIZE = 3;
    const COL_SIZE = 3;

    const players = [];
    let currentTurnIndex;
    let gameOver = false;

    const init = () => {
      players.push(playerFactory("X"), playerFactory("O"));
      currentTurnIndex = 0;
      window.addEventListener("click", handleTileClick);
    }

    const _getCurrentTurnSymbol = () => {
      return players[currentTurnIndex].symbol;
    }

    const _toggleTurnIndex = () => {
      return currentTurnIndex === 0 ? 1 : 0;
    }
    
    /**
     * handleTileClick() -
     * Handler when a .tile class element is clicked.
     * First checks to see if element clicked is a tile, if tile hasn't been
     * clicked, or if the game is over.
     * 
     * Then checks to see if game was won or tied with this click.
     * 
     * @param {Object} event - Click event bubbled to window 
     */
    const handleTileClick = (event) => {
      if (event.target.className === "tile" && event.target.textContent == "" &&
      !gameOver) {
        const symbol = _getCurrentTurnSymbol();
        const row = event.target.getAttribute("data-row");
        const col = event.target.getAttribute("data-col");

        gameBoard.setBoardTile(row, col, symbol);
        displayController.displayTile(event.target, symbol);
        let checkResult = _checkForWin();
        if(checkResult) {
          displayController.displayWinMessage(checkResult);
          gameOver = true;
        }
        else if(gameBoard.isBoardFull()) {
          displayController.displayTieMessage();
          gameOver = true;
        }
        currentTurnIndex = _toggleTurnIndex();
      }
    }

    const _checkForWin = () => {
      const rowResult = _checkRowsForWin();
      if(rowResult) {
        return rowResult;
      }
      const colResult = _checkColsForWin();
      if(colResult) {
        return colResult;
      }
      const declineDiagResult = _checkDeclineDiagonal();
      if(declineDiagResult) {
        return declineDiagResult;
      }
      const inclineDiagResult = _checkInclineDiagonal();
      if(inclineDiagResult) {
        return inclineDiagResult;
      }
      else {
        return false;
      }
    }

    const _checkIfSetWins = (set) => {
      if(set.includes(undefined)) {
        return false;
      }
      //check if every element in a checked array is the same
      return set.every(elem => elem === set[0]);
    }

    /**_checkRowsForWin()
     * Function that iterates through each row of the board,
     * and sees if there are 3 of the same symbol in a row.
     * 
     * @return symbol -- symbol with 3 in a row
     *         false  -- if no rows with 3 in a row
     */
    const _checkRowsForWin = () => {
      const checkedSet = Array(3);
      for(let row = 0; row < ROW_SIZE; row++) {
        for(let col = 0; col < COL_SIZE; col++) {
          checkedSet[col] = gameBoard.getBoardTile(row, col);
        }
        if(_checkIfSetWins(checkedSet)) {
          return checkedSet[0];
        }
      }
      return false;
    }

    /**
     * _checkColsForWin()
     * Function that iterates through each column of the board,
     * and sees if there are 3 of the same symbol in a row.
     * 
     * @return symbol -- symbol with 3 in a row
     *         false  -- if no columns with 3 in a row
     */
    const _checkColsForWin = () => {
      const checkedSet = Array(3);
      for(let col = 0; col < ROW_SIZE; col++) {
        for(let row = 0; row < COL_SIZE; row++) {
          checkedSet[row] = gameBoard.getBoardTile(row, col);
        }
        if(_checkIfSetWins(checkedSet)) {
          return checkedSet[0];
        }
      }
      return false;
    }

    /**
     * _checkDeclineDiagonal
     * Function that checks the diagonal that goes from the top left of the
     * board to the bottom right, to see if it is 3 of the same symbols in a
     * row.
     * 
     * @return symbol -- symbol with 3 in a row
     *         false  -- if no columns with 3 in a row
     */
    const _checkDeclineDiagonal = () => {
      const checkedSet = Array(3);
      for(let diag = 0; diag < ROW_SIZE; diag++) {
        checkedSet[diag] = gameBoard.getBoardTile(diag, diag);
      }      
      if(_checkIfSetWins(checkedSet)) {
        return checkedSet[0];
      }
      return false;
    }
    
    /**
     * _checkDeclineDiagonal
     * Function that checks the diagonal that goes from the bottom left of the
     * board to the top right, to see if it is 3 of the same symbols in a
     * row.
     * 
     * @return symbol -- symbol with 3 in a row
     *         false  -- if no columns with 3 in a row
     */
    const _checkInclineDiagonal = () => {
      let col = 0;
      const checkedSet = Array(3);
      for(let row = ROW_SIZE - 1; row >= 0; row--) {
        checkedSet[col] = gameBoard.getBoardTile(row, col);
        col++;
      }
      if(_checkIfSetWins(checkedSet)) {
        return checkedSet[0];
      }
      return false;
    }

    return {
      init
    }
  })();

  return {
    gameLogic
  }
})();


window.onload = ticTacToe.gameLogic.init();