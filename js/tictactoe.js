"use strict"
const ticTacToe = (() => {
  const playerFactory = (name, symbol) => {
    const score = 0;
    return { score, name, symbol };
  };


  const displayController = (() => {

    const displayTile = (tile, symbol) => {
      tile.textContent = symbol;
    };

    const displayWinMessage = (name) => {
      const display = document.querySelector("#game-status");
      display.textContent = `Congrats to ${name} on winning!!`;
    };

    const displayTieMessage = () => {
      const display = document.querySelector("#game-status");
      display.textContent = "Tie!";
    }

    const resetDisplay = () => {
      const tiles = document.querySelectorAll(".tile");
      tiles.forEach((tile)=> {
        tile.textContent = "";
      })
      const display = document.querySelector("#game-status");
      display.textContent = "";
    };

    return {
      displayTile,
      displayWinMessage,
      displayTieMessage,
      resetDisplay
    }
  })();

  const gameBoard = (() => {
    const GRID_SIZE = 3;
    let board = [Array(GRID_SIZE), Array(GRID_SIZE), Array(GRID_SIZE)];

    const setBoardTile = (row, col, symbol) => {
      board[row][col] = symbol;
    };

    const getBoardTile = (row, col) => {
      return board[row][col];
    };

    const isBoardFull = () => {
      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
          if (board[row][col] == undefined) {
            return false;
          }
        }
      }
      return true;
    }

    const resetBoard = () => {
      board = [Array(GRID_SIZE), Array(GRID_SIZE), Array(GRID_SIZE)];
    }
    
    const getGridSize = () => GRID_SIZE;

    return {
      setBoardTile,
      getBoardTile,
      isBoardFull,
      getGridSize,
      resetBoard
    };
  })();

  const gameLogic = (() => {
    const players = [];
    let currentTurnIndex;
    let gameOver = false;

    const init = () => {
      players.push(playerFactory("Player 1", "X"),
        playerFactory("Player2", "O"));

      currentTurnIndex = 0;
      let resetBtn = document.querySelector("#reset-btn");
      resetBtn.addEventListener("click", _handleReset);
      window.addEventListener("click", handleTileClick);
      userInput.setFormPopUp();
      userInput.setCloseListeners();
      userInput.setSubmitListener();
    }

    const _getCurrentTurnSymbol = () => {
      return players[currentTurnIndex].symbol;
    }

    const _toggleTurnIndex = () => {
      return currentTurnIndex === 0 ? 1 : 0;
    }

    // module that contains functions that obtain and process user input
    const userInput = (() => {
      //variable that contains which player name button was pressed
      let inputButton;
      const setFormPopUp = () => {
        const player1Button = document.querySelector("#player-1-btn");
        player1Button.addEventListener("click", _displayModal);

        const player2Button = document.querySelector("#player-2-btn");
        player2Button.addEventListener("click", _displayModal);
      };

      const setCloseListeners = () => {
        window.addEventListener("click", _closeModal);

        const closeBtn = document.querySelector("#close-btn");
        closeBtn.addEventListener("click", _handleCloseButton);
      };

      const _closeModal = (event) => {
          const form = document.querySelector("form");
          const modal = document.querySelector(".modal");
          if (event.target == modal) {
            modal.style.display = "none";
            form.reset();
          }
      }

      const _handleCloseButton = () => {
        const form = document.querySelector("form");
        const modal = document.querySelector(".modal");
        modal.style.display = "none";
        form.reset();
      }

      const setSubmitListener = () => {
        const submitBtn = document.querySelector("#submit-btn");
        submitBtn.addEventListener("click", _handleSubmit);
      }

      const _displayModal = (event) => {
        const modal = document.querySelector(".modal");
        modal.style.display = "block";
        inputButton = event.target;
      };

      const _handleSubmit = (event) => {
        event.preventDefault();
        const form = document.querySelector("form");
        const modal = document.querySelector(".modal");

        // only submit if form is valid(uses HTML5 form valdiation)
        if (form.reportValidity()) {
          const formData = new FormData(form);
          const name = formData.get("player-name");
          const symbol = formData.get("symbol");

          let duplicate;
          let playerIndex;
          if (inputButton.id === "player-1-btn") {
            playerIndex = 0;
          }
          else {
            playerIndex = 1;
          }
          duplicate = _checkDuplicateSymbols(playerIndex, symbol);

          //if no duplicates, update player info and close form
          if(!duplicate) {
            players[playerIndex] = playerFactory(name, symbol);
            modal.style.display = "none";
            form.reset();
          }
        }
      }

      function _checkDuplicateSymbols(playerIndex, symbol) {
        // index of the other player in players[]
        let altIndex = (playerIndex === 0) ? 1 : 0;
        if(players[altIndex].symbol === symbol) {
          alert(`${players[altIndex].name} is already using this symbol!`);
          return true;
        }
        else {
          return false;
        }
      }

      return {
        setFormPopUp,
        setCloseListeners,
        setSubmitListener,
      }
    })();

    const _handleReset = () => {
      displayController.resetDisplay();
      gameBoard.resetBoard();
      gameOver = false;
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
        if (checkResult) {
          displayController.displayWinMessage(checkResult);
          gameOver = true;
        }
        //tie condition
        else if (gameBoard.isBoardFull()) {
          displayController.displayTieMessage();
          gameOver = true;
        }
        currentTurnIndex = _toggleTurnIndex();
      }
    }

    const _checkForWin = () => {
      const rowResult = _checkRowsForWin();
      if (rowResult) {
        return rowResult;
      }
      const colResult = _checkColsForWin();
      if (colResult) {
        return colResult;
      }
      const declineDiagResult = _checkDeclineDiagonal();
      if (declineDiagResult) {
        return declineDiagResult;
      }
      const inclineDiagResult = _checkInclineDiagonal();
      if (inclineDiagResult) {
        return inclineDiagResult;
      }
      else {
        return false;
      }
    }

    const _checkIfSetWins = (set) => {
      if (set.includes(undefined)) {
        return false;
      }
      //check if every element in a checked array is the same
      return set.every(elem => elem === set[0]);
    }

    /**_checkRowsForWin()
     * Function that iterates through each row of the board,
     * and sees if there are 3 of the same symbol in a row.
     * 
     * @return _getPlayerName(checkedSet[0]) -- name of player who won
     *         false  -- if diagonal is not 3 in a row
     */
    const _checkRowsForWin = () => {
      const checkedSet = Array(3);
      const GRID_SIZE = gameBoard.getGridSize();
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          checkedSet[col] = gameBoard.getBoardTile(row, col);
        }
        if (_checkIfSetWins(checkedSet)) {
          return _getPlayerName(checkedSet[0]);
        }
      }
      return false;
    }

    /**
     * _checkColsForWin()
     * Function that iterates through each column of the board,
     * and sees if there are 3 of the same symbol in a row.
     * 
     * @return _getPlayerName(checkedSet[0]) -- name of player who won
     *         false  -- if diagonal is not 3 in a row
     */
    const _checkColsForWin = () => {
      const checkedSet = Array(3);
      const GRID_SIZE = gameBoard.getGridSize();
      for (let col = 0; col < GRID_SIZE; col++) {
        for (let row = 0; row < GRID_SIZE; row++) {
          checkedSet[row] = gameBoard.getBoardTile(row, col);
        }
        if (_checkIfSetWins(checkedSet)) {
          return _getPlayerName(checkedSet[0]);
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
     * @return _getPlayerName(checkedSet[0]) -- name of player who won
     *         false  -- if diagonal is not 3 in a row
     */
    const _checkDeclineDiagonal = () => {
      const GRID_SIZE = gameBoard.getGridSize();
      const checkedSet = Array(GRID_SIZE);
      for (let diag = 0; diag < GRID_SIZE; diag++) {
        checkedSet[diag] = gameBoard.getBoardTile(diag, diag);
      }
      if (_checkIfSetWins(checkedSet)) {
        return _getPlayerName(checkedSet[0]);
      }
      return false;
    }

    /**
     * _checkDeclineDiagonal
     * Function that checks the diagonal that goes from the bottom left of the
     * board to the top right, to see if it is 3 of the same symbols in a
     * row.
     * 
     * @return _getPlayerName(checkedSet[0]) -- name of player who won
     *         false  -- if diagonal is not 3 in a row
     */
    const _checkInclineDiagonal = () => {
      let col = 0;
      const GRID_SIZE = gameBoard.getGridSize();
      const checkedSet = Array(GRID_SIZE);
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        checkedSet[col] = gameBoard.getBoardTile(row, col);
        col++;
      }
      if (_checkIfSetWins(checkedSet)) {
        return _getPlayerName(checkedSet[0]);
      }
      return false;
    }

    const _getPlayerName = (symbol) => {
      for(let i = 0; i , players.length; i++) {
        if(players[i].symbol === symbol) {
          return players[i].name;
        }
      }
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