"use strict"
const ticTacToe = (() => {
  const playerFactory = (name, symbol) => {
    const score = 0;
    return { score, name, symbol};
  };


  const displayController = (() => {

    const displayTile = (row, col, symbol) => {
      const tile = document.
      querySelector(`[data-row="${row}"][data-col="${col}"]`)
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

        const playerIndex = (inputButton.id === "player-1-btn") ? 0 : 1;
        const duplicate = gameState.checkDuplicateSymbols(playerIndex, symbol);

        if(duplicate) {
          alert(`${gameState.getPlayerName(symbol)} is already 
          using this symbol!`);
        }
        //if no duplicates, update player info and close form
        else {
          if(playerIndex == 0) {
            gameState.setPlayer1(playerFactory(name, symbol));
          }
          else {
            gameState.setPlayer2(playerFactory(name, symbol));
          }
          modal.style.display = "none";
          form.reset();
        }
      }
    }

    const disableInput = () => {
      const player1Button = document.querySelector("#player-1-btn");
      const player2Button = document.querySelector("#player-2-btn");
      player1Button.disabled = true;
      player2Button.disabled = true;
    }

    const enableInput = () => {
      const player1Button = document.querySelector("#player-1-btn");
      const player2Button = document.querySelector("#player-2-btn");
      player1Button.disabled = false;
      player2Button.disabled = false;
    }

    return {
      setFormPopUp,
      setCloseListeners,
      setSubmitListener,
      enableInput,
      disableInput
    }
  })();

  const gameBoard = (() => {
    const GRID_SIZE = 3;
    let board = [Array(GRID_SIZE), Array(GRID_SIZE), Array(GRID_SIZE)];

    const setBoardTile = (row, col, symbol, boardArg=board) => {
      boardArg[row][col] = symbol;
    };

    const getBoardTile = (row, col, boardArg=board) => {
      return boardArg[row][col];
    };

    const getBoard = () => {
      return [...board];
    }

    const isBoardFull = (boardArg=board) => {
      for (let row = 0; row < boardArg.length; row++) {
        for (let col = 0; col < boardArg[row].length; col++) {
          if (boardArg[row][col] == undefined) {
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

    const getEmptyTiles = (boardArg=board) => {
      const returnArr = [];
      for (let row = 0; row < boardArg.length; row++) {
        for (let col = 0; col < boardArg[row].length; col++) {
          if (boardArg[row][col] == undefined) {
            returnArr.push({row, col});
          }
        }
      }
      return returnArr;
    }

    return {
      setBoardTile,
      getBoardTile,
      getBoard,
      isBoardFull,
      getGridSize,
      resetBoard,
      getEmptyTiles
    };
  })();

  const gameState = (() => {
    const players = [];

    //0 for turns where first player's turns, 1 for 2nd player's turns
    let currentTurnIndex;
    let gameOver;
    let againstComputer;
    let impossibleAI;

    const initState = () => {
      players.push(playerFactory("Player 1", "X"),
        playerFactory("Player2", "O"));
        currentTurnIndex = 0;
        gameOver = true;
    }

    const setPlayer1 = (player) => {
      players[0] = player;
    }

    const setPlayer2 = (player) => {
      players[1] = player;
    }

    const _getPlayer = (index) => {
      return players[index];
    }

    const setImpossibleAI = (bool) => {
      impossibleAI = bool;
    }

    const getImpossibleAI = () => {
      return impossibleAI;
    }

    const getPlayerName = (symbol) => {
      for(let i = 0; i , players.length; i++) {
        if(players[i].symbol === symbol) {
          return players[i].name;
        }
      }
    }

    const getPlayerSymbol = (index) => {
      return players[index].symbol;
    }

    const setComputerPlayer = (bool) => {
      againstComputer = bool;
    }

    const usesComputer = () => {
      return againstComputer;
    }

    const toggleTurnIndex = () => {
      currentTurnIndex = currentTurnIndex === 0 ? 1 : 0;
    }

    const resetTurnIndex = () => {
      currentTurnIndex = 0;
    }

    const getCurrentTurnSymbol = () => {
      return players[currentTurnIndex].symbol;
    }

    // computer has players[index] where index is opposite of
    // currentTurnIndex
    const getComputerSymbol = () => {
      if(currentTurnIndex === 0) {
        return players[1].symbol;
      }
      else {
        return players[0].symbol;
      }
    }

    const getTurnIndex = () => {
      return currentTurnIndex;
    }

    const endGame = () => {
      gameOver = true;
    }

    const startGame = () => {
      gameOver = false;
    }

    const getGameOverState = () => {
      return gameOver;
    }

    /**
     * checkDuplicateSymbols()
     * This function is designed to check if the alternate player has the same
     * symbol as the symbol passed in.
     * @param {num} playerIndex -- index of player in gameLogic
     * @param {String} symbol -- symbol to check duplicate of in other player
     * @returns true -- if other player has the symbol
     *          false -- other player does not have the symbol
     */
     function checkDuplicateSymbols(playerIndex, symbol) {
      // index of the alternate player
      const altIndex = (playerIndex === 0) ? 1 : 0;
      const altPlayer = _getPlayer(altIndex);
      if(altPlayer.symbol === symbol) {
        return true;
      }
      else {
        return false;
      }
    }

    return {
      initState,
      setPlayer1,
      setPlayer2,
      getPlayerName,
      getPlayerSymbol,
      setImpossibleAI,
      getImpossibleAI,
      setComputerPlayer,
      usesComputer,
      toggleTurnIndex,
      resetTurnIndex,
      getTurnIndex,
      getCurrentTurnSymbol,
      getComputerSymbol,
      endGame,
      startGame,
      getGameOverState,
      checkDuplicateSymbols
    }
  })();

  const gameLogic = (() => {
    const init = () => {
      let resetBtn = document.querySelector("#reset-btn");
      let startBtn = document.querySelector("#start-btn");
      resetBtn.addEventListener("click", _handleReset);
      startBtn.addEventListener("click", _handleStart);

      window.addEventListener("click", _handleTileClick);
      userInput.setFormPopUp();
      userInput.setCloseListeners();
      userInput.setSubmitListener();
      gameState.initState();
      gameSettings.setSettingListeners();

      //overwrite initState() if there are chosen settings
      gameSettings.setSettings();
    }


    const _handleReset = () => {
      displayController.resetDisplay();
      gameBoard.resetBoard();
      userInput.enableInput();

      _enableStartBtn();

      //game should not start until start button pressed
      gameState.endGame();
      gameState.resetTurnIndex();

      //save settings after game reset
      gameSettings.setSettings();
    }

    const _handleStart = () => {
      gameState.startGame();
      userInput.disableInput();
      _disableStartBtn();
      if(gameState.usesComputer() && gameState.getTurnIndex() === 1) {
        if(gameState.getImpossibleAI()) {
          _bestComputerMove();
        }
        else {
          _randomComputerMove();
        }
      }
    }

    const _disableStartBtn = () => {
      let startButton = document.querySelector("#start-btn");
      startButton.disabled = true;
    }

    const _enableStartBtn = () => {
      let startButton = document.querySelector("#start-btn");
      startButton.disabled = false;
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
    const _handleTileClick = (event) => {
      if (event.target.className === "tile" && event.target.textContent == "" &&
        !gameState.getGameOverState()) {
        const symbol = gameState.getCurrentTurnSymbol();
        const row = event.target.getAttribute("data-row");
        const col = event.target.getAttribute("data-col");
 
        gameBoard.setBoardTile(row, col, symbol);
        displayController.displayTile(row, col, symbol);
        _checkGameEnd();
        if(gameState.usesComputer() && !gameState.getGameOverState()) {
          if(gameState.getImpossibleAI()) {
            _bestComputerMove();
          }
          else {
            setTimeout(_randomComputerMove, 20);
          }
        } 
        else {
          gameState.toggleTurnIndex();
        }
      }
    }

    const _randomComputerMove = () => {
      const emptyTiles = gameBoard.getEmptyTiles();
      const randomIndex = Math.floor(Math.random() * (emptyTiles.length));
      const rowColObj = emptyTiles[randomIndex];
      
      gameBoard.setBoardTile(rowColObj.row, rowColObj.col, 
        gameState.getComputerSymbol());
      displayController.displayTile(rowColObj.row, rowColObj.col, 
        gameState.getComputerSymbol());

      _checkGameEnd();
    }

    const _bestComputerMove = () => {
      const currentBoard = gameBoard.getBoard();
      const numEmptyTiles = gameBoard.getEmptyTiles().length;
      const playerTurn = gameState.getTurnIndex();

      const bestMoveObj = minimax(currentBoard, numEmptyTiles, playerTurn);
      console.log(bestMoveObj);
    }

    const minimax = (boardNode, depth, goingSecond) => {
      if(depth === 0) {
        const winningSymbol = _checkForWin(boardNode);
        //if there was a win
        if(winningSymbol !== undefined) {
          if(winningSymbol === gameState.getComputerSymbol()) {
            return {value: -1};
          }
          else {
            return {value: 1};
          }
        }
        //else tie
        else {
          return {value: 0};
        }
      }
      const emptyTiles = gameBoard.getEmptyTiles(boardNode);
      const nextMoveValues = [];
      
      //get symbol for this iteration of simulated game;
      let currentNode = boardNode;

      //minimizing player(player who went second)
      if(goingSecond) {
        const symbol = gameState.getPlayerSymbol(1);
        let value = {value: Number.POSITIVE_INFINITY};
        for(let i = 0; i < emptyTiles.length; i++) {
          let newBoard = gameBoard.setBoardTile(emptyTiles[i].row, 
            emptyTiles[i].col, symbol, currentNode);
          currentNode = boardNode;

          //save row/col to return move, toggle goingSecond since next
          //player's turn
          let moveData = {value: minimax(newBoard, depth - 1, !goingSecond),
            row: emptyTiles[i].row, col: emptyTiles[i].col};
          nextMoveValues.push(moveData);
        }
        value = nextMoveValues.reduce(_getMinValue);
        return value;
      }
      //maximizing player(player who went first)
      else {
        const symbol = gameState.getPlayerSymbol(0);
        let value = {value: Number.NEGATIVE_INFINITY};
        for(let i = 0; i < emptyTiles.length; i++) {
          let newBoard = gameBoard.setBoardTile(emptyTiles[i].row, 
            emptyTiles[i].col, symbol, currentNode);
          currentNode = boardNode;

          //save row/col to return move, toggle goingSecond since next
          //player's turn
          let moveData = {value: minimax(newBoard, depth - 1, !goingSecond),
          row: emptyTiles[i].row, col: emptyTiles[i].col};
          nextMoveValues.push(moveData);
        }
        value = nextMoveValues.reduce(_getMaxValue);
        return value;
      }
    }

    const _getMinValue = (a, b) => {
      if(a.value < b.value) {
        return a;
      }
      else {
        return b;
      }
    }

    
    const _getMaxValue = (a, b) => {
      if(a.value > b.value) {
        return a;
      }
      else {
        return b;
      }
    }

    const _checkGameEnd = () => {
      let checkResult = _checkForWin();
      if (checkResult) {
        const winningName = gameState.getPlayerName(checkResult);
        displayController.displayWinMessage(winningName);
        gameState.endGame();
        _disableStartBtn();
      }
      //tie condition
      else if (gameBoard.isBoardFull()) {
        displayController.displayTieMessage();
        gameState.endGame();
        _disableStartBtn();
      }
    }

    const _checkForWin = (board) => {
      const rowResult = _checkRowsForWin(board);
      if (rowResult) {
        return rowResult;
      }
      const colResult = _checkColsForWin(board);
      if (colResult) {
        return colResult;
      }
      const declineDiagResult = _checkDeclineDiagonal(board);
      if (declineDiagResult) {
        return declineDiagResult;
      }
      const inclineDiagResult = _checkInclineDiagonal(board);
      if (inclineDiagResult) {
        return inclineDiagResult;
      }
      else {
        return false;
      }
    }

    /**
     * _checkIfSetWins
     * Function to check to see if an array of 3 symbols are the same.
     * 
     * @param {set} array of 3 symbols
     * @returns false -- if undefined or not 3 in a row
     *          true -- if 3 symbols in a row
     */
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
     * @return checkedSet[0] -- symbol of player who won
     *         false  -- if diagonal is not 3 in a row
     */
    const _checkRowsForWin = (board) => {
      const checkedSet = Array(3);
      const GRID_SIZE = gameBoard.getGridSize();
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          checkedSet[col] = gameBoard.getBoardTile(row, col, board);
        }
        if (_checkIfSetWins(checkedSet)) {
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
     * @return checkedSet[0] -- symbol of player who won
     *         false  -- if diagonal is not 3 in a row
     */
    const _checkColsForWin = (board) => {
      const checkedSet = Array(3);
      const GRID_SIZE = gameBoard.getGridSize();
      for (let col = 0; col < GRID_SIZE; col++) {
        for (let row = 0; row < GRID_SIZE; row++) {
          checkedSet[row] = gameBoard.getBoardTile(row, col, board);
        }
        if (_checkIfSetWins(checkedSet)) {
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
     * @return checkedSet[0] -- symbol of player who won
     *         false  -- if diagonal is not 3 in a row
     */
    const _checkDeclineDiagonal = (board) => {
      const GRID_SIZE = gameBoard.getGridSize();
      const checkedSet = Array(GRID_SIZE);
      for (let diag = 0; diag < GRID_SIZE; diag++) {
        checkedSet[diag] = gameBoard.getBoardTile(diag, diag, board);
      }
      if (_checkIfSetWins(checkedSet)) {
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
     * @return checkedSet[0] -- symbol of player who won
     *         false  -- if diagonal is not 3 in a row
     */
    const _checkInclineDiagonal = (board) => {
      let col = 0;
      const GRID_SIZE = gameBoard.getGridSize();
      const checkedSet = Array(GRID_SIZE);
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        checkedSet[col] = gameBoard.getBoardTile(row, col, board);
        col++;
      }
      if (_checkIfSetWins(checkedSet)) {
        return checkedSet[0];
      }
      return false;
    }

    return {
      init
    }
  })();

  const gameSettings = (() => {

    const setSettings = () => {
      const computerRadioBtn = document.querySelector("#computer");
      if(computerRadioBtn.checked && !computerRadioBtn.disabled) {
        gameState.setComputerPlayer(true);
      }
      else {
        gameState.setComputerPlayer(false);
      }
      const secondRadioBtn = document.querySelector("#second");
      if(secondRadioBtn.checked && !secondRadioBtn.disabled) {
        gameState.toggleTurnIndex();
      }
      else {
        gameState.resetTurnIndex();
      }
      const impossibleRadioBtn = document.querySelector("#impossible");
      if(impossibleRadioBtn.checked && !impossibleRadioBtn.disabled) {
        gameState.setImpossibleAI(true);
      }
      else {
        gameState.setImpossibleAI(false);
      }
    }

    const setSettingListeners = () => {
      const computerRadioBtn = document.querySelector("#computer");
      computerRadioBtn.addEventListener("click", _enableComputerSettings);
      computerRadioBtn.addEventListener("click", () => {
        gameState.setComputerPlayer(true);
      });

      const localRadioBtn = document.querySelector("#local");
      localRadioBtn.addEventListener("click", _disableComputerSettings);
      localRadioBtn.addEventListener("click", () => {
        gameState.setComputerPlayer(false);
      });

      const firstRadioBtn = document.querySelector("#first");
      firstRadioBtn.addEventListener("click", gameState.resetTurnIndex);
      const secondRadioBtn = document.querySelector("#second");
      secondRadioBtn.addEventListener("click", gameState.toggleTurnIndex);

      const randomRadioBtn = document.querySelector("#random");
      randomRadioBtn.addEventListener("click", () => {
        gameState.setImpossibleAI(false);
      });

      const impossibleRadioBtn = document.querySelector("#impossible");
      impossibleRadioBtn.addEventListener("click", () => {
        gameState.setImpossibleAI(true);
      });
    }

    const _enableComputerSettings = () => {
      const computerSettings = document.querySelectorAll(`.turn-selection, 
        .ai-selection`);

      computerSettings.forEach((selector) => {
        selector.disabled = false;
      })
    }

    const _disableComputerSettings = () => {
      const computerSettings = document.querySelectorAll(`.turn-selection, 
        .ai-selection`);

      computerSettings.forEach((selector) => {
        selector.disabled = true;
      })
    }
  
    return {
      setSettingListeners,
      setSettings
    }
  })();

  return {
    gameLogic
  }
})();

window.onload = ticTacToe.gameLogic.init();