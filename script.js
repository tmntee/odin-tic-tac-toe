let Checkboard = function(){
    let box = (number, occupied, XorO) => { return { number, occupied, XorO} };
    const boardBoxes = [box(1, false, ' '), box(2, false, ' '), box(3, false, ' '), 
                        box(4, false, ' '), box(5, false, ' '), box(6, false, ' '),
                        box(7, false, ' '), box(8, false, ' '), box(9, false, ' ')];

    let place = (boxNumber, player) => {
        let affectedBox = boardBoxes.find((box) => box.number == boxNumber);
        affectedBox.occupied = true;
        affectedBox.XorO = player;
        displayBoard();
    }

    let displayBoard = function() {
        console.log(`${boardBoxes.at(0).XorO}  |  ${boardBoxes.at(1).XorO}  |  ${boardBoxes.at(2).XorO}\n${boardBoxes.at(3).XorO}  |  ${boardBoxes.at(4).XorO}  |  ${boardBoxes.at(5).XorO}\n${boardBoxes.at(6).XorO}  |  ${boardBoxes.at(7).XorO}  |  ${boardBoxes.at(8).XorO}`)
    }

    return {place, displayBoard};
};

let checkboard = Checkboard();
checkboard.displayBoard();
checkboard.place(1, 'X');

let Player = function(XorO){
    const playerMoveType = XorO;

    let move = (boxNumber) => {
        checkboard.place(boxNumber, playerMoveType);
    }

    return {move};
};

let player1 = Player("X");
player1.move(3);


let GameManager = function(){
}