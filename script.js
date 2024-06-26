let Player = function(name, botOrNot, color, imageSource){
    const playerName = name;
    let bot = botOrNot;
    let sequence = '';
    const imageSrc = imageSource;

    return { playerName, color, sequence, imageSrc};
};

let GameManager = (function(){
    const BUTTONS = Array.from(document.querySelectorAll("button.board-button"));

    //let winningSequences = ["123", "159", "147", "258", 
    //                        "357", "369", "456", "789"]

    let winningSequences = /\d*1\d*2\d*3|\d*1\d*5\d*9|\d*1\d*4\d*7|\d*2\d*5\d*8|\d*3\d*5\d*7|\d*3\d*6\d*9|\d*4\d*5\d*6|\d*7\d*8\d*9/
    let winner;
    let player1;
    let player2;   
    let currentPlayerMoving;     
    let p1wins = 0;
    let p2wins = 0;
    let gameStatusText = document.querySelector("div.game-status");
    let roundTracker = 0;
    const MAX_AMNT_OF_ROUNDS = 9;

    let determineTurn = () => {
        let diceRoll = Math.floor(Math.random() * 10);
        console.log(diceRoll);
        if (diceRoll < 5) {
            currentPlayerMoving = player1;
            gameStatusText.textContent = `${player1.playerName} goes first.`
        } else {
            currentPlayerMoving = player2;
            gameStatusText.textContent = `${player2.playerName} goes first.`
        }
    }

    let playGame = (p1, p2) => {
        player1 = p1;
        player2 = p2;

        gameStatusText.textContent = "Determining who goes first..."

        setTimeout(determineTurn, 3000);
        
        BUTTONS.forEach((button) => {
            button.addEventListener('click', () => {

                let buttonImg = document.createElement("img");
                buttonImg.setAttribute("src", currentPlayerMoving.imageSrc);

                button.appendChild(buttonImg);
                button.style.backgroundColor = currentPlayerMoving.color;
                let sequenceString = button.value + " ";
                currentPlayerMoving.sequence += sequenceString;

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

        if (winner !== undefined) {
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
        restartButton.addEventListener("click", restartBoard);
    }

    let restartBoard = () => {
        roundTracker = 0;

        BUTTONS.forEach((button) => {
            button.removeAttribute("disabled");
            button.removeAttribute("style");
            if (button.hasChildNodes()) {
                while (button.firstElementChild) {
                    button.removeChild(button.firstElementChild);
                }
            }
        })

        playGame(player1, player2);
    }
        
    return {playGame}
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


            console.log(`Player 1 Name: ${p1Name} | Player 1 Color: ${p1Color} | Player 1 Type: ${p1IsRobot}`);
            console.log(`Player 2 Name: ${p2Name} | Player 1 Color: ${p2Color} | Player 1 Type: ${p2IsRobot}`);
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
        GameManager.playGame(PlayerInformationManager.getPlayer1(), PlayerInformationManager.getPlayer2());
    }
    
    return {loadInitialPage, loadGamePage}
})();

DOMManager.loadInitialPage();
