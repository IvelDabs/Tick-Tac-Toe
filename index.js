// DOM Elements
const allSquare = document.querySelectorAll(".grid__square");

const playerOneScore = document.getElementById("info__player__score1");
const playerTwoScore = document.getElementById("info__player__score2");

const infoText = document.getElementById("instructions__text");
const startGameBtn = document.getElementById("instructions__btn");

const modal = document.getElementById("modal");

// creating a Fcatory function for the player objects
function CreatePlayer(name, wins) {
    return {
        name,
        wins,
    };
}

function players(name, wins) {
    const player = CreatePlayer(name, wins);
    return player;
}
// Variables
const player1 = players("Best", "0");
const player2 = players("Nkem", "0");

let move = 1;
let nextPlayer = player1.name;
let pastPlayer;
let currentImage = "cross";
let playerHasWon = false;

// Creating Square Clicking Functionality
function addSquareClick() {
    allSquare.forEach((square) => {
        square.addEventListener("click", squareClick);
    });
}

function removeSquareClick() {
    allSquare.forEach((square) => {
        square.removeEventListener("click", squareClick);
    });
}

function squareClick() {
    if (!this.classList.contains(`cross`) && !this.classList.contains("circle")) {
        this.classList.add(`${currentImage}`);
        incrementMove(); // Corrected function name here
    }
}

// addSquareClick()

// INCREMENTING MOVE

function incrementMove() {
    // Corrected function name here
    move += 1;
    if (move % 2 !== 0) {
        nextPlayer = player1.name;
        pastPlayer = player2.name;
        currentImage = "cross";
        infoText.innerText = `${player1.name}'s turn`;
    } else {
        nextPlayer = player2.name;
        pastPlayer = player1.name;
        currentImage = "circle";
        infoText.textContent = `${player2.name}'s turn`;
    }
    checkForWinner();
    checkForTie();
}

// Fuctionality to check for a winner
function checkForWinner() {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], //Rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], //Columns
        [0, 4, 8],
        [2, 4, 6], // Diagonal
    ];

    for (const line of lines) {
        let [a, b, c] = line;
        if (allSquare[a].classList.contains("cross") && allSquare[b].classList.contains("cross") && allSquare[c].classList.contains("cross")) {
            playerHasWon = true;
            break;
        } else if (allSquare[a].classList.contains("circle") && allSquare[b].classList.contains("circle") && allSquare[c].classList.contains("circle")) {
            playerHasWon = true;
            break;
        }

        const allSquaresConatinCurrentSymbol = line.every((index) => allSquare[index].classList.contains(currentImage));
        if (allSquaresConatinCurrentSymbol) {
            const winner = currentImage === "cross" ? player1 : player2;
            winner.wins += 1;
            updateScore();
            return;
        }
    }

    if (playerHasWon) {
        playerWon();
        return;
    }
}

function updateScore() {
    playerOneScore.textContent = player1.wins;
    playerTwoScore.textContent = player2.wins;
}

function playerWon() {
    infoText.textContent = `Heads up, ${pastPlayer} has won!!`;
    playerHasWon = true;
    continueTheGame(); // function to continue the game after a player wins.
}

// Checking For A Tie
function checkForTie() {
    // Check if all squares are filled
    const allSquaresFilled = Array.from(allSquare).every((square) => square.classList.contains("cross") || square.classList.contains("circle"));

    // If all squares are filled and no player has won
    if (allSquaresFilled && !playerHasWon) {
        // Perform tie logic here
        infoText.textContent = "The game was quite competitive and hence we have a tie, We can kick off some more to get a winner!";
        continueTheGame(); // function to continue the game after a tie.
    }
}

// Continue, Restart or Reset functions

function continueTheGame() {
    removeSquareClick();
    setTimeout(() => {
        reset();
    }, 2000);
}

function restartGame() {
    removeSquareClick();
    reset();
}

function reset() {
    allSquare.forEach((square) => {
        square.classList = "grid__square";
    });
    addSquareClick();
    playerHasWon = false;
    infoText.textContent = `${nextPlayer}'s turn to start!'`;
}

// Start Game Function

function StartGame() {
    startGameBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    const form = document.querySelector("form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const player1Input = document.getElementById("player1").value.trim().toLowerCase();
        const player2Input = document.getElementById("player2").value.trim().toLowerCase();

        const player1InputCap = player1Input.charAt(0).toUpperCase() + player1Input.slice(1);
        const player2InputCap = player2Input.charAt(0).toUpperCase() + player2Input.slice(1);

        player1.name = player1InputCap;
        player2.name = player2InputCap;
        nextPlayer = player1InputCap;
        document.getElementById("info__player__name1").textContent = player1.name;
        document.getElementById("info__player__name2").textContent = player2.name;
        player1.wins = 0;
        player2.wins = 0;

        updateScore();
        infoText.textContent = `${player1.name}'s turn to start`;
        modal.style.display = "none";

        startGameBtn.textContent = "Restart Game";
        addSquareClick();
        restartGame();
    });
}

StartGame();
