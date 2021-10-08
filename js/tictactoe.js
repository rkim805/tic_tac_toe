"use strict"
const playerFactory = (symbol) => {
  const score = 0;
  return {score, symbol};
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
  const board = [[...Array(3)],[...Array(3)],[...Array(3)]];

  const setBoardTile = (row, col, symbol) => {
    board[row][col] = symbol;
  };

  const getBoardTile = (row, col) => {
    return board[row][col];
  };

  const addTileListener = (symbol) => {
    window.addEventListener("click", (event) => {
      if(event.target.className === "tile") {
        let row = event.target.getAttribute("data-row");
        let col = event.target.getAttribute("data-col");
        setBoardTile(row, col, symbol);
        displayController.displayTile(event.target, symbol);
      }
    });
  }


  return {
    //addTileListeners,
    addTileListener,
    getBoardTile
  };
})();

const game = (() => {
  let playerTurn;
  const init = () => {
    gameBoard.addTileListener("X");
  }
  return {
    init
  }
})();

window.onload = game.init();