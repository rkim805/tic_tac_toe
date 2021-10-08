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

const game = (() => {
  const players = [];
  let currentTurnIndex;
  const init = () => {
    players.push(playerFactory("X"), playerFactory("O"));
    currentTurnIndex = 0;
    addTileListener();
  }

  const getCurrentTurnSymbol = () => {
    return players[currentTurnIndex].symbol;
  }

  const toggleTurnIndex = () => {
    return currentTurnIndex === 0 ? 1 : 0;
  }

  const addTileListener = () => {
    window.addEventListener("click", (event) => {
      if (event.target.className === "tile") {
        let symbol = getCurrentTurnSymbol();
        const row = event.target.getAttribute("data-row");
        const col = event.target.getAttribute("data-col");
        gameBoard.setBoardTile(row, col, symbol);
        displayController.displayTile(event.target, symbol);
        currentTurnIndex = toggleTurnIndex();
      }
    });
  }

  return {
    init,
    toggleTurnIndex,
    getCurrentTurnSymbol
  }
})();

window.onload = game.init();