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

let Player = function(XorO){
    const playerMoveType = XorO;

    let move = (boxNumber) => {
        Checkboard.place(boxNumber, playerMoveType);
    }

    return {move, playerMoveType};
};

let GameManager = function(p1, p2, board){
    let winningSequences = ["123", "159", "147", "258", 
                            "357", "369", "456", "789"]
    let player1Sequence = "";
    let player2Sequence = "";
    let player1 = p1;
    let player2 = p2;
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

    return {parseBoard};
};

Checkboard.displayBoard();

let player1 = Player("X");
player1.move(4);

let player2 = Player("O");
player2.move(3);
player2.move(1);
player2.move(2);

let gameManager = GameManager(player1, player2, Checkboard);
gameManager.parseBoard();