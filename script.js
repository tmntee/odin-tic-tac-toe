let Checkboard = (function(){
    let box = (number, occupied, XorO) => { return { number, occupied, XorO} };
    const boardBoxes = [box(1, false, ' '), box(2, false, ' '), box(3, false, ' '), 
                        box(4, false, ' '), box(5, false, ' '), box(6, false, ' '),
                        box(7, false, ' '), box(8, false, ' '), box(9, false, ' ')];

    let place = (boxNumber, player) => {
        let affectedBox = boardBoxes.find((b) => b.number === boxNumber);;
        if (affectedBox.occupied === false) {
            affectedBox.occupied = true;
            affectedBox.XorO = player;
            displayBoard();
        } else {
            console.log("Spot is already occupied");
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

    
let availableIndexes = () => {
    let freeSpaces = boardBoxes.map((box) => {
        if (box.occupied === false) {
            return box.number;
        } });
    
    console.log(freeSpaces);
        return freeSpaces;
    }


    return {boardBoxes, place, displayBoard, occupationStatus, availableIndexes};
})();

let Player = function(XorO, botOrNot){
    const playerMoveType = XorO;
    let bot = botOrNot;

    let move = () => {
        let boxNumber; 
        if (botOrNot === false) {
            let selectedBox;
            while (/[1-9]/.test(selectedBox) === false && Checkboard.availableIndexes().includes(selectedBox) === false) {
                selectedBox = prompt("Select a space to place your move. 1-9");
            }
            boxNumber = Number(selectedBox);

        } else {
            let randomIndex = Math.floor(Math.random() * Checkboard.availableIndexes().length);
            boxNumber = Checkboard.availableIndexes().at(randomIndex);
        }

        console.log(boxNumber);
        Checkboard.place(boxNumber, playerMoveType);
    }

    return {move, playerMoveType, bot};
};

let GameManager = function(board){
    let winningSequences = ["123", "159", "147", "258", 
                            "357", "369", "456", "789"]
    let player1Sequence = "";
    let player2Sequence = "";
    let player1, player2;
    let firstPlayer, secondPlayer;
    const movesMax = 9;
    let movesTracker = 0;
    let winner;

    let checkIfWin = function(sequence1, sequence2) {
        winningSequences.forEach((s) => {
            if (sequence1 === s) {
                winner = "Player 1 Wins!";
            } else if (sequence2 === s) {
                winner = "Player 2 Wins!";
            }
        })
    }

    let parseBoard = () => {
        let statuses = Checkboard.occupationStatus();
        statuses.forEach((status) => {
            if (status.playerOccupying === player1.playerMoveType) {
                player1Sequence += `${status.boxNumber}`;
            } else if (status.playerOccupying === player2.playerMoveType) {
                player2Sequence += `${status.boxNumber}`;
            } 
        })
        checkIfWin(player1Sequence, player2Sequence);
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
                playerMove(secondPlayer);
                break;

            case 1:
                playerMove(firstPlayer);
                break;
        }
    }

    let startGame = () => {
        let dice = rollChance();

        if (dice < 5) {
            console.log("Player 2 goes first.")
            firstPlayer = player2;
            secondPlayer = player1;
        } else {
            console.log("Player 1 goes first.")
            firstPlayer = player1;
            secondPlayer = player2;
        }

        for (let i = 0; i < movesMax; i++) {
            determinePlayerTurn(i);
        }
        

        if (movesTracker === movesMax) {
            winner = "It's a tie."
        }

        console.log(`${winner}`);
    }

    let playerMove = (p) => {
        p.move();
        parseBoard();
    }
        
    return {parseBoard, gameSetup};
};
let gameManager = GameManager(Checkboard);
gameManager.gameSetup();
