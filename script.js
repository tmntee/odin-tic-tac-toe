let Checkboard = (function(){
    let box = (number, occupied, XorO) => { return { number, occupied, XorO} };
    const boardBoxes = [box(1, false, ' '), box(2, false, ' '), box(3, false, ' '), 
                        box(4, false, ' '), box(5, false, ' '), box(6, false, ' '),
                        box(7, false, ' '), box(8, false, ' '), box(9, false, ' ')];

    let place = (boxNumber, player) => {
        let affectedBox = boardBoxes.find((box) => box.number == boxNumber);
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

    return {place, displayBoard, occupationStatus};
})();

let Player = function(XorO, botOrNot){
    const playerMoveType = XorO;
    let bot = botOrNot;

    let move = (boxNumber) => {
        Checkboard.place(boxNumber, playerMoveType);
    }

    return {move, playerMoveType, bot};
};

let GameManager = function(board){
    let winningSequences = ["123", "159", "147", "258", 
                            "357", "369", "456", "789"]
    let player1Sequence = "";
    let player2Sequence = "";
    let player1;
    let player2;
    let gameboard = board;
    const movesMax = 9;
    let movesTracker = 0;

    let checkIfWin = function(sequence1, sequence2) {

        let winner = ""
        winningSequences.forEach((s) => {
            if (sequence1 === s) {
                winner = "Player 1";
            } else if (sequence2 === s) {
                winner = "Player 2";
            }
        })

        if (winner != "");
        console.log(`${winner} Wins!`);
    }

    let parseBoard = () => {
        let statuses = gameboard.occupationStatus();
        statuses.forEach((status) => {
            if (status.playerOccupying === player1.playerMoveType) {
                player1Sequence += `${status.boxNumber}`;
            } else if (status.playerOccupying === player2.playerMoveType) {
                player2Sequence += `${status.boxNumber}`;
            } 
        })
        checkIfWin(player1Sequence, player2Sequence);
    }

    let startGame = () => {
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
    }

    return {parseBoard, startGame};
};

let gameManager = GameManager();
gameManager.startGame(Checkboard);
