
let Gameboard = (function(){


})

let Player = function(name, botOrNot, color){
    const playerName = name;
    let bot = botOrNot;
    let sequence = '';

    let move = () => {
    }

    return {move, playerName, color, sequence};
};

let GameManager = (function(){
    let winningSequences = ["123", "159", "147", "258", 
                            "357", "369", "456", "789"]
    let winner;

    let startGame = (firstPlayer, secondPlayer) => {
        let player1 = firstPlayer;
        let player2 = secondPlayer;
        let currentPlayerMoving;
        let gameStatusText = document.querySelector("div.game-status");
        gameStatusText.textContent = "Determining who goes first..."

        let diceRoll = Math.floor(Math.random * 10);
        if (diceRoll < 5) {
            currentPlayerMoving = player1;
            gameStatusText.textContent = `${player1.playerName} goes first.`
        } else {
            currentPlayerMoving = player2;
            gameStatusText.textContent = `${player2.playerName} goes first.`
        }
        console.log(currentPlayerMoving);

        let buttons = Array.from(document.querySelectorAll("button.board-button"));
        buttons.forEach((button) => {
            button.addEventListener('click', () => {

                let buttonImg = button.querySelector("img");
                if (currentPlayerMoving.playerName === player1.playerName) {

                    buttonImg.setAttribute("src", "images/x.svg");

                } else if (currentPlayerMoving.playerName === player2.playerName) {

                    buttonImg.setAttribute("src", "images/circle.svg");
                }

                button.appendChild(buttonImg);
                button.style.backgroundColor = currentPlayerMoving.color;
                currentPlayerMoving.sequence += button.value;
                console.log(currentPlayerMoving.sequence);
            })
        })
    }
        
    

    return {startGame}
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
        player1 = Player(p1Name, p1IsRobot, p1Color)
        return player1;
    };

    let getPlayer2 = () => {
        player2 = Player(p2Name, p2IsRobot, p2Color)
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
        GameManager.startGame(PlayerInformationManager.getPlayer1(), PlayerInformationManager.getPlayer2());
    }
    
    return {loadInitialPage, loadGamePage}
})();

DOMManager.loadInitialPage();
