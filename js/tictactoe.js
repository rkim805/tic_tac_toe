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
  const board = [[...Array(3)], [...Array(3)], [...Array(3)]];

  const setBoardTile = (row, col, symbol) => {
    board[row][col] = symbol;
  };

  const getBoardTile = (row, col) => {
    return board[row][col];
  };

  return {
    setBoardTile,
    getBoardTile
  };
})();

const gameLogic = (() => {
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

  return {
    init
  }
})();

window.onload = gameLogic.init();