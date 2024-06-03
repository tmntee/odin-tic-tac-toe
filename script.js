let Checkboard = (function(){
    let box = (number, occupied, XorO) => { return { number, occupied, XorO} };
    const boardBoxes = [box(1, false, ' '), box(2, false, ' '), box(3, false, ' '), 
                        box(4, false, ' '), box(5, false, ' '), box(6, false, ' '),
                        box(7, false, ' '), box(8, false, ' '), box(9, false, ' ')];

    let place = (boxNumber, playerType) => {
        let affectedBox = boardBoxes.find((b) => b.number === boxNumber);
        if (affectedBox !== undefined && affectedBox !== NaN) {
            if (affectedBox.occupied === false) {
                affectedBox.occupied = true;
                affectedBox.XorO = playerType;
                displayBoard();
                return true;
            } else {
                console.log("Spot is already occupied.");
                return false;
            }
        } else {
            return false;
        }
    }

    let displayBoard = function() {
        console.log(`${boardBoxes.at(0).XorO}  |  ${boardBoxes.at(1).XorO}  |  ${boardBoxes.at(2).XorO}\n${boardBoxes.at(3).XorO}  |  ${boardBoxes.at(4).XorO}  |  ${boardBoxes.at(5).XorO}\n${boardBoxes.at(6).XorO}  |  ${boardBoxes.at(7).XorO}  |  ${boardBoxes.at(8).XorO}`)
    }

    let occupationStatus = () => {
        boxStatuses = [];
        boardBoxes.forEach((b) => {
            let tempBox = (boxNumber, playerOccupying) => {
                return {boxNumber, playerOccupying}
            }

            boxStatuses.push(tempBox(b.number, b.XorO))
        })

        return boxStatuses;
    }

    let restartBoard = () => {
        boardBoxes.forEach((box) => {
            box.occupied = false;
            box.XorO = ' ';
        })
    }

    return {place, displayBoard, occupationStatus, restartBoard};
})();

let Player = function(XorO, botOrNot){
    const playerMoveType = XorO;
    let bot = botOrNot;

    let move = () => {
        let boxNumber = ''; 
        if (botOrNot === false) {
            while (Checkboard.place(selectedBox, playerMoveType) === false && /[1-9]/.test(boxNumber) === false) {
                var selectedBox = Number(prompt("Select a box to place your move in. 1-9"));
            }
            boxNumber = selectedBox; 

        } else {
            while (Checkboard.place(randomIndex, playerMoveType) === false) {
                var randomIndex = Math.floor(Math.random() * 9);
            }
            boxNumber = randomIndex;
        }
    }

    return {move, playerMoveType, bot};
};

let GameManager = (function(){
    let winningSequences = ["123", "159", "147", "258", 
                            "357", "369", "456", "789"]

    let player1, player2;
    let firstPlayer, secondPlayer;

    let winner;

    let checkIfWin = () => {
        let winOrNot = false;
        let player1Sequence = "";
        let player2Sequence = "";
        let statuses = Checkboard.occupationStatus();
        statuses.forEach((status) => {
            if (status.playerOccupying === player1.playerMoveType) {
                player1Sequence += `${status.boxNumber}`;
            } else if (status.playerOccupying === player2.playerMoveType) {
                player2Sequence += `${status.boxNumber}`;
            } 
        })

        console.log(player1Sequence);
        console.log(player2Sequence);

        for (let i = 0; i < winningSequences.length; i++) {
            if (player1Sequence === winningSequences.at(i)) {
                winner = "Player 1 Wins!";
                winOrNot = true;
                break;
            } else if (player2Sequence === winningSequences.at(i)) {
                winner = "Player 2 Wins!";
                winOrNot = true;
                break;
            }
        }

        return winOrNot;
    }

    let rollChance = () => {
        return Math.floor(Math.random() * 10);
    }

    let gameSetup = () => {
        console.log("Welcome to Tic Tac Toe!");

        let botAnswer = '';
        while ((botAnswer !== "Y") && (botAnswer != "N")) {
            botAnswer = prompt("Play against a bot? Y/N").toLocaleUpperCase();
            console.log(botAnswer);
        };

        let moveTypeAnswer = '';
        while ((moveTypeAnswer !== "X") && (moveTypeAnswer !== "O")) {
            moveTypeAnswer = prompt("Do you want to be X or O?").toLocaleUpperCase();
            console.log(moveTypeAnswer);
        }

        let player2IsBot;
        let oppositeMoveType;

        if (botAnswer === "Y") {
            player2IsBot = true;
        } else {
            player2IsBot = false
        };

        if (moveTypeAnswer === "X") {
            oppositeMoveType = "O";
        } else {
            oppositeMoveType = "X";
        }

        player1 = Player(moveTypeAnswer, false);
        player2 = Player(oppositeMoveType, player2IsBot);
        startGame();
    }

    let determinePlayerTurn = (moveNumber) => {
        let turnDeterminer = (moveNumber % 2) 
        switch (turnDeterminer) {
            case 0:
                playerMove(firstPlayer);
                break;

            case 1:
                playerMove(secondPlayer);
                break;
        }
    }

    let startGame = () => {
        const movesMax = 9;
        let movesTracker = 0;
        let dice = rollChance();

        if (dice < 5) {
            firstPlayer = player2;
            secondPlayer = player1;
        } else {
            firstPlayer = player1;
            secondPlayer = player2;
        }
        console.log(`Player ${firstPlayer.playerMoveType} goes first.`)

        for (let i = 0; i < movesMax; i++) {
            if (checkIfWin() === true) {
                break;
            }
            determinePlayerTurn(i);
            ++movesTracker;
        }


        if (movesTracker === movesMax) {
            winner = "It's a tie."
        }

        console.log(`${winner}`);
    }

    let playerMove = (p) => {
        p.move();
        console.log(`Player ${p.playerMoveType} has gone.`)
    }

    return {gameSetup};
})();

// player customization scripts 

let player1color, player2color;
let p1ColorPickerColors = Array.from(document.querySelectorAll("input.color-button.p1"));
let p2ColorPickerColors = Array.from(document.querySelectorAll("input.color-button.p2"));

p1ColorPickerColors.forEach((button) => {
    addEventListener('click', (event) => {
        event.preventDefault();
        let p1 = document.querySelector("div.player-avatar.p1");
        p1.style.background = button.value;
    })
})