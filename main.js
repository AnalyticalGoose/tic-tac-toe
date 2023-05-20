let gameBoard = {
    board: ["","","","","","","","",""]
}

const boardController = () => {
    const gridCell = document.querySelectorAll("[data-key]")
    
    const applyFunctions = () =>
        gridCell.forEach(cell => {
            cell.setAttribute("onclick", "playGame(this)")
    })

    const removeAllFunctions = () =>
        gridCell.forEach(cell => {
            cell.removeAttribute("onclick")
    })

    const clearText = () =>
        gridCell.forEach(cell=> {
            cell.textContent = ""
        })

    const removeFunction = (cell) => cell.removeAttribute("onclick")

    return { applyFunctions, removeAllFunctions, removeFunction, clearText }
}

const Player = (sign) => {
    let playerSign = sign;
    const getSign = () => playerSign;
    
    return { getSign }
}

function playGame(cell) {   
    board.removeFunction(cell)                    // remove onclick() for chosen cell only
    cell.textContent = game.getTurn()             // update UI with current player's sign   
    let cellIndex = cell.getAttribute("data-key") // cell index is held in a data key in the DOM   
    gameBoard.board[cellIndex] = cell.textContent // update board array

    if (game.checkWinner(parseInt(cellIndex)) == true) { 
        game.endGame(`${game.getTurn()}WIN`)
        board.removeAllFunctions()                   // remove all onclick() from HTML to prevent further function calls
    }
    else if (game.checkDraw() == true) {
        game.endGame('DRAW')
    }
    else {
        game.changeTurn()
        game.incrementRound()
    }
}

const gameController = () => {
    const setDisplay = displayController();
    let round = 1;   
    let playerTurn = "X"

    const checkWinner = () => {
        const winConditions = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
          [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
        ];
      
        const isWin = winConditions.some((condition) => // some() checks for the presence of win conditions.
        condition.every((value) =>                      // inside the some() callback; every() checks if every value   
          gameBoard.board[value] === playerTurn         // in a win condition corresponds to the current player's sign
        )); 

        return isWin
    };

    const checkDraw = () => round == 9 ? true : false;

    const endGame = (input) => setDisplay[`${input}`]()
       
    const getTurn = () => playerTurn;
    
    const changeTurn = () => {
        playerTurn = playerTurn === "X" ? "O" : "X"; // Conditionally alternate player turn with a ternary
        setDisplay[playerTurn]();
    };

    const incrementRound = () => round++

    const reset = () => {
        round = 1
        playerTurn = "X" 
        setDisplay['X']()
    }

    return { getTurn, changeTurn, checkWinner, endGame, incrementRound, checkDraw, reset }
};

const displayController = () => {
    const display = document.querySelector(".display")
    const setDisplay = {                                            // Object literal function for all display outputs
        'X': () => display.textContent = "Player X - Your Turn!",
        'O': () => display.textContent = "Player O - Your Turn!",
        'XWIN': () => display.textContent = "Player X Wins!",
        'OWIN': () => display.textContent = "Player O Wins!",
        'DRAW': () => display.textContent = "It's a draw!",
    };
    return setDisplay;
}

const restart = () => {
    gameBoard.board = ["","","","","","","","",""]
    board.clearText()
    board.applyFunctions()
    game.reset()
}

const board = boardController()
board.applyFunctions()
const game = gameController()