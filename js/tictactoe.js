"use strict"
const playerFactory = (symbol) => {
  const score = 0;
  return { score, symbol };
};


const displayController = (() => {

  const displayTile = (tile, symbol) => {
    tile.textContent = symbol;
  };

  const resetDisplay = () => {
    console.log("test");
  };

  return {
    displayTile
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
        if(board[row][col] == "") {
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
    addTileListener();
  }

  const _getCurrentTurnSymbol = () => {
    return players[currentTurnIndex].symbol;
  }

  const _toggleTurnIndex = () => {
    return currentTurnIndex === 0 ? 1 : 0;
  }
  
  /**
   * addTileListener()
   * 
   * Uses event bubbling to listen to all clicks -- handles when clicks are
   * of .tile class. Uses less listeners than binding to each individual tile.
   * 
   * Function will then update the board array, display the symbol in the
   * clicked tile, and toggle the turn to be the other player's turn.
   */
  const addTileListener = () => {
    window.addEventListener("click", handleTileClick);
  }

  const handleTileClick = (event) => {
    if (event.target.className === "tile" && event.target.textContent == "" &&
    !gameOver) {
      const symbol = _getCurrentTurnSymbol();
      const row = event.target.getAttribute("data-row");
      const col = event.target.getAttribute("data-col");

      gameBoard.setBoardTile(row, col, symbol);
      displayController.displayTile(event.target, symbol);
      currentTurnIndex = _toggleTurnIndex();
    }
  }

  const _checkForWin = () => {
    const rowResult = _checkRowsForWin();
    if(rowResult.won) {
      return rowResult;
    }
    const colResult = _checkColsForWin();
    if(columnResult.won) {
      return columnResult;
    }
    const declineDiagResult = _checkDeclineDiagonal();
    if(declineDiagResult.won) {
      return declineDiagResult;
    }
    const inclineDiagResult = _checkInclineDiagonal();
    if(inclineDiagResult.won) {
      return inclineDiagResult
    }
  }


  // fuction that uses Javascript Set's uniqueness property to check if
  // set contains only one symbol.
  const _checkIfSetWins = (setOf3) => {
    return (new Set(arr)).size === 1;
  }

  const _checkRowsForWin = () => {
    for(let row = 0; row < ROW_SIZE; row++) {
      for(let col = 0; col < COL_SIZE; col++) {
        checkedSet[col] = gameBoard.getBoardTile(row, col);
      }
      if(_checkIfSetWins(checkedSet)) {
        return {won: true, symbol: getBoardTile(row, col)}
      }
    }
    return {won: false};
  }

  const _checkColsForWin = () => {
    for(let col = 0; col < ROW_SIZE; col++) {
      for(let row = 0; row < COL_SIZE; row++) {
        checkedSet[row] = gameBoard.getBoardTile(row, col);
      }
      if(_checkIfSetWins(checkedSet)) {
        return {won: true, symbol: getBoardTile(row, col)}
      }
    }
    return {won: false};
  }

  const _checkDeclineDiagonal = () => {
    for(let diag = 0; diag < ROW_SIZE; diag++) {
      checkedSet[diag] = gameBoard.getBoardTile(row, col);
    }      
    if(_checkIfSetWins(checkedSet)) {
      return {won: true, symbol: getBoardTile(row, col)}
    }
    return {won: false};
  }

  
  const _checkInclineDiagonal = () => {
    let col = 0;
    for(let row = ROW_SIZE - 1; row >= 0; row--) {
      checkedSet[col] = gameBoard.getBoardTile(row, col);
      col++;
    }
    if(_checkIfSetWins(checkedSet)) {
      return {won: true, symbol: getBoardTile(row, col)}
    }
    return {won: false};
  }

  return {
    init
  }
})();

window.onload = gameLogic.init();