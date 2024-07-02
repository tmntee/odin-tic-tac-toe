let Player = function(name, botOrNot, color, imageSource){
    const playerName = name;
    let bot = botOrNot;
    let sequence = '';
    const imageSrc = imageSource;
    return { playerName, color, sequence, imageSrc};
};

let GameManager = (function(){
    const BUTTONS = Array.from(document.querySelectorAll("button.board-button"));

    const winningSequences = /\d*1\d*2\d*3|\d*1\d*5\d*9|\d*1\d*4\d*7|\d*2\d*5\d*8|\d*3\d*5\d*7|\d*3\d*6\d*9|\d*4\d*5\d*6|\d*7\d*8\d*9/
    let winner = null;
    let player1, player2;   
    let currentPlayerMoving = null;     
    let p1wins = 0;
    let p2wins = 0;
    let gameStatusText = document.querySelector("div.game-status");
    let roundTracker = 0;
    const MAX_AMNT_OF_ROUNDS = 9;

    let gameSetup = (p1, p2) => {
        player1 = p1;
        player2 = p2;
        playGame();
    }

    let playGame = () => {

        gameStatusText.textContent = "Determining who goes first..."
        setTimeout(determineTurn, 3000);

        BUTTONS.forEach((button) => {
            button.addEventListener('click', () => {

                let buttonImg = button.firstElementChild;
                buttonImg.setAttribute("src", currentPlayerMoving.imageSrc);

                button.style.backgroundColor = currentPlayerMoving.color;
                let sequenceString = button.value + " ";
                currentPlayerMoving.sequence += sequenceString;
                console.log(currentPlayerMoving.sequence);

                button.setAttribute("disabled","");

                if (checkIfWinner(currentPlayerMoving.sequence)) {
                    endGame();
                } else {
                    if (currentPlayerMoving === player1) {
                        currentPlayerMoving = player2;
                        
                    } else {
                        currentPlayerMoving = player1;
                    }
                    
                    gameStatusText.textContent = `${currentPlayerMoving.playerName}'s turn.`
                    roundTracker++;
                    if (roundTracker === MAX_AMNT_OF_ROUNDS) {
                        endGame();
                    }
                }
            })
        })
    }

    let determineTurn = () => {
        if (winner === null || winner === undefined) {
            let diceRoll = Math.floor(Math.random() * 10);
            if (diceRoll < 5) {
                currentPlayerMoving = player1;
            } else {
                currentPlayerMoving = player2;
            }
        } 
        gameStatusText.textContent = `${currentPlayerMoving.playerName} goes first.`;
    }

    let checkIfWinner = (sequence) => {
        let boxesOccupied = sequence.split(" ");
        boxesOccupied.sort((a, b) => {
            return a - b;
        })

        let sortedSequence = boxesOccupied.join('');

        if (winningSequences.test(sortedSequence)) {
            if (player1.sequence === sequence) {
                winner = player1;
            } else {
                winner = player2;
            }
            console.log(winner)
            return true;
        } else {
            return false;
        }
    }

    let endGame = () => {
        BUTTONS.forEach((button) => {
            button.setAttribute("disabled", '');
        })

        if (winner !== null) {
            gameStatusText.textContent = `${winner.playerName} won!`;
            if (winner === player1) {
                ++p1wins;
            } else {
                ++p2wins;
            }
        } else {
            gameStatusText.textContent = "BIG OL TIE. No one won."
        }

        let p1WinsTracker = document.querySelector("div.score.p1");
        p1WinsTracker.textContent = "Games Won: " + p1wins;
        let p2WinsTracker = document.querySelector("div.score.p2");
        p2WinsTracker.textContent = "Games Won: " + p2wins;

        let restartButton = document.querySelector("button.restart-game");
        restartButton.removeAttribute("disabled");
        restartButton.addEventListener("click", restartGame);
    }

    let restartGame = () => {
        roundTracker = 0;

        BUTTONS.forEach((button) => {
            button.removeAttribute("disabled");
            button.removeAttribute("style");
            button.firstElementChild.setAttribute("src", "");
        })

        player1.sequence = "";
        player2.sequence = "";
        winner.sequence = "";
        currentPlayerMoving.sequence = "";

        gameStatusText.textContent = `${currentPlayerMoving.playerName}'s turn.`
    }
        
    return {gameSetup}
})();

// player customization scripts 

let PlayerInformationManager = (function(){
    let p1Name, p2Name;
    let p1Color, p2Color;
    let p1IsRobot, p2IsRobot;

    let player1, player2;

    let submitPlayerInfo = function() {
        let form = document.getElementById("playerform");
        if (form.checkValidity() === true) {
            let p1nameInput = document.querySelector("div.player-header.p1>input");

            if (p1nameInput.value === "") {
                p1Name = "Player 1";
            } else {
                p1Name = p1nameInput.value;
            }

            let p2nameInput = document.querySelector("div.player-header.p2>input");

            if (p2nameInput.value === "") {
                p2Name = "Player 2";
            } else {
                p2Name = p2nameInput.value;
            }

            p1IsRobot = document.getElementById("p1-bot").checked;
            p2IsRobot = document.getElementById("p2-bot").checked;

            p1Color = document.getElementById("p1-avatar").style.backgroundColor;
            p2Color = document.getElementById("p2-avatar").style.backgroundColor;

            return true;
        } else {
            form.reportValidity();
            return false;
        }
    };

    let getPlayer1 = () => {
        player1 = Player(p1Name, p1IsRobot, p1Color, "images/x.svg")
        return player1;
    };

    let getPlayer2 = () => {
        player2 = Player(p2Name, p2IsRobot, p2Color, "images/circle.svg")
        return player2;
    };

    return {submitPlayerInfo, getPlayer1, getPlayer2};
})();

let DOMManager = (() => {

    const INITIAL_PAGE = document.getElementById("playerform");
    const GAME_PAGE = document.getElementById("game-page");

    let loadInitialPage = () => {
        GAME_PAGE.style.display = "none";
        INITIAL_PAGE.style.display = "flex";

        let p1ColorPickerColors = Array.from(document.querySelectorAll("button.color-button.p1"));
        let p2ColorPickerColors = Array.from(document.querySelectorAll("button.color-button.p2"));
        let p1Avatar = document.getElementById("p1-avatar");
        let p2Avatar = document.getElementById("p2-avatar");
    
        p1ColorPickerColors.forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                if (button.value !== p2Avatar.style.backgroundColor) {
                    p1Avatar.style.backgroundColor = button.value;
                }
            })
        })
    
        p2ColorPickerColors.forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                if (button.value !== p1Avatar.style.backgroundColor) {
                    p2Avatar.style.backgroundColor = button.value;
                }
            })
        })
   
        let submitButton = document.querySelector("input.submit-button");
        console.log(submitButton);
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (PlayerInformationManager.submitPlayerInfo()) {
                DOMManager.loadGamePage();
            }
        });
    }

    let loadGamePage = () => {
        GAME_PAGE.style.display = "flex";
        INITIAL_PAGE.style.display = "none";

        let p1AvatarGame = document.getElementById("p1-avatar-game");
        let p2AvatarGame = document.getElementById("p2-avatar-game");

        p1AvatarGame.style.backgroundColor = document.getElementById("p1-avatar").style.backgroundColor;
        p2AvatarGame.style.backgroundColor = document.getElementById("p2-avatar").style.backgroundColor;

        let p1NameHeader = document.querySelector("h1.player-name.p1");
        p1NameHeader.textContent = `${PlayerInformationManager.getPlayer1().playerName} (X)`;

        let p2NameHeader = document.querySelector("h1.player-name.p2");
        p2NameHeader.textContent = `${PlayerInformationManager.getPlayer2().playerName} (O)`;

        let goBackButton = document.querySelector("button.go-back");
        goBackButton.addEventListener('click', () => {
            loadInitialPage();
        })
        GameManager.gameSetup(PlayerInformationManager.getPlayer1(), PlayerInformationManager.getPlayer2());
    }
    
    return {loadInitialPage, loadGamePage}
})();

DOMManager.loadInitialPage();
