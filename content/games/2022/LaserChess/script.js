function setup() {
    width = document.getElementById('game-container').offsetWidth - 100;
    containerHeight = window.innerHeight;
    height = width * 3 / 4 - width / 6;
    canvas = createCanvas(width, Math.max(height, containerHeight * 3 / 4)); // ~4:3 aspect ratio
    canvas.parent('game-container');


}


var boardSize = -1;
var board = [];
// initial number of pieces:
var bishops = -1;
var knights = -1;
// for storing the board:
const NULL = 0, WHITE_BISHOP = 1, WHITE_KNIGHT = 2, WHITE_KING = 3,
                BLACK_BISHOP = 5, BLACK_KNIGHT = 6, BLACK_KING = 7;

const BISHOP = 1, KNIGHT = 2, KING = 3;

// two players; 0 = white, 1 = black:
// to store the pieces remaining for each player:
var bishopsRemaining = [0, 0], knightsRemaining = [0, 0];

var player1, player2;

var whiteTime, blackTime;
var lastTimeMeasured = 0;

var inGame = false;

var turn = 0;

var selectedPiece;

var rightMargin, bottomMargin;

var selectNewBlackBishop = [], selectNewBlackKnight = [], selectNewWhiteBishop = [], selectNewWhiteKnight = [];
var selectPieceHeight;

var invalidBoard = false;
var invalidBoardMessage = '';

var endGameMessage = '';

bottomMessage = '';

var bbishopImageSrc = "assets/blackbishop.png";
var bbishopImage;
var bknightImageSrc = "assets/blackknight.png";
var bknightImage;
var bkingImageSrc = "assets/blackking.png";
var bkingImage;
var wbishopImageSrc = "assets/whitebishop.png";
var wbishopImage;
var wknightImageSrc = "assets/whiteknight.png";
var wknightImage;
var wkingImageSrc = "assets/whiteking.png";
var wkingImage;

var turnsRemaining = 0;

function startGame() {
    message = '';
    // async load images
    bbishopImage = loadImage(bbishopImageSrc, function(){ console.log('loaded bbishopImage');}, function(){ console.log('failed to load bbishopImage'); });
    bknightImage = loadImage(bknightImageSrc, function(){ console.log('loaded bknightImage');}, function(){ console.log('failed to load bknightImage'); });
    bkingImage = loadImage(bkingImageSrc, function(){ console.log('loaded bkingImage');}, function(){ console.log('failed to load bkingImage'); });
    wbishopImage = loadImage(wbishopImageSrc, function(){ console.log('loaded wbishopImage');}, function(){ console.log('failed to load wbishopImage'); });
    wknightImage = loadImage(wknightImageSrc, function(){ console.log('loaded wknightImage');}, function(){ console.log('failed to load wknightImage'); });
    wkingImage = loadImage(wkingImageSrc, function(){ console.log('loaded wkingImage');}, function(){ console.log('failed to load wkingImage'); });
    
    player1 = document.getElementById("player-1").value;
    player2 = document.getElementById("player-2").value;
    boardSize = document.getElementById("board-size").value;
    bishops = document.getElementById("bishops").value;
    knights = document.getElementById("knights").value;
    var timeString = document.getElementById("time");
    turnsRemaining = document.getElementById("turns").value;

    var hasColon = timeString.value.indexOf(':') != -1;
    var time;
    if(hasColon){
        var timeArray = timeString.value.split(':');
        try{
            time = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
        }catch(e){
            time = 2e9;
        }
        if(time == null) time = 2e9;
    }else{
        try{
            time = parseInt(timeString.value);
        }catch(e){
            time = 2e9;
        }
        if(time == null) time = 2e9;
    }
    time *= 1000; // convert to milliseconds
    whiteTime = blackTime = time;
    lastTimeMeasured = millis();

    bishopsRemaining = [bishops, bishops];
    knightsRemaining = [knights, knights];
    board = [];
    for (var i = 0; i < boardSize; i++) {
        board.push([]);
        for (var j = 0; j < boardSize; j++) {
            board[i].push(NULL);
        }
    }
    blackKingIdx = (boardSize & 1) ? (boardSize - 1) / 2 : boardSize / 2 - 1;
    whiteKingIdx = (boardSize & 1) ? (boardSize - 1) / 2 : boardSize / 2;
    board[blackKingIdx][0] = BLACK_KING;
    board[whiteKingIdx][boardSize - 1] = WHITE_KING;

    selectedPiece = null;
    
    rightMargin = floor(width * 0.25);
    bottomMargin = floor(height * 0.1);
    var size = min(width - rightMargin, height);
    if(size != width - rightMargin){
        rightMargin = width - size;
    }
    invalidBoard = false;
    invalidBoardMessage = '';
    if(boardSize < 3){
        invalidBoard = true;
        invalidBoardMessage = 'Board size must be at least 3';
    }
    if(boardSize > 24){
        invalidBoard = true;
        invalidBoardMessage = 'Board size must not exceed 24';
    }
    if(time < 0){
        invalidBoard = true;
        invalidBoardMessage = 'Time must be a positive number';
    }
    inGame = true;
    turn = 0;
}

function draw(){
    if (inGame){
        drawBoard();
        drawPieces();
        drawRightMargin();
    }
}

function drawBoard(){
    background(255);
    if(invalidBoard){
        return;
    }
    var size = min(width - rightMargin, height - bottomMargin);
    for (var i = 0; i < boardSize; i++){
        for (var j = 0; j < boardSize; j++){
            if ((i + j) % 2 == 0){
                fill(238, 238, 213);
            } else {
                fill(125, 148, 93);
            }
            if(selectedPiece != null && selectedPiece[0] == i && selectedPiece[1] == j){
                if((i + j) % 2 != 0){
                    fill(128, 0, 0);
                }else{
                    fill(255, 64, 64);
                }
            }
            if(selectedPiece != null && validateMove(selectedPiece, i, j)){
                if((i + j) % 2 != 0){
                    fill(0, 0, 128);
                }else{
                    fill(64, 64, 255);
                }
            }
            rect(i * size / boardSize, j * size / boardSize, size / boardSize, size / boardSize);
        }
    }
}
function drawPieces(){
    if(invalidBoard){
        return;
    }
    var size = min(width - rightMargin, height - bottomMargin);
    
    for (var i = 0; i < boardSize; i++){
        for (var j = 0; j < boardSize; j++){
            if (board[i][j] != NULL){
                if ( getType(board[i][j]) == KING){
                    if( getColor(board[i][j]) == 0){
                        image(wkingImage, i * size / boardSize, j * size / boardSize, size / boardSize, size / boardSize);
                    }else{
                        image(bkingImage, i * size / boardSize, j * size / boardSize, size / boardSize, size / boardSize);
                    }
                }else if (getType(board[i][j]) == BISHOP){
                    if( getColor(board[i][j]) == 0){
                        image(wbishopImage, i * size / boardSize, j * size / boardSize, size / boardSize, size / boardSize);
                    }else{
                        image(bbishopImage, i * size / boardSize, j * size / boardSize, size / boardSize, size / boardSize);
                    }
                }else if (getType(board[i][j]) == KNIGHT){
                    if( getColor(board[i][j]) == 0){
                        image(wknightImage, i * size / boardSize, j * size / boardSize, size / boardSize, size / boardSize);
                    }else{
                        image(bknightImage, i * size / boardSize, j * size / boardSize, size / boardSize, size / boardSize);
                    }
                }
            }
        }
    }
}

function drawRightMargin(){
    
    var effectiveBlackTime = blackTime, effectiveWhiteTime = whiteTime;
    if(turn == 0){
        effectiveWhiteTime -= (millis() - lastTimeMeasured);
    }else{
        effectiveBlackTime -= (millis() - lastTimeMeasured);
    } // to avoid precision errors when measuring, we only update the values when a move is made, but we can still display the current time

    // Show a picture of each piece; clickable to select and place onto the board
    // Show the number of pieces remaining for each player
    // Show the current player
    // Show the current turn
    var player1wins = isCheckMate(1), player2wins = isCheckMate(0);
    player1wins = player1wins || effectiveBlackTime <= 0;
    player2wins = player2wins || effectiveWhiteTime <= 0;
    var noMoreTurns = turnsRemaining <= 0;
    player2wins = player2wins || noMoreTurns; // if there is insufficient material to win, it is scored as a win for black
    var h = height - bottomMargin;
    var whoseTurnHeight = floor(2 * h / 10);
    selectPieceHeight = floor(h / 10);


    if(invalidBoard){
        fill(0);
        textSize(whoseTurnHeight / 4);
        while(textWidth(invalidBoardMessage) > rightMargin){
            textSize(textSize() - 1);
        }
        text(invalidBoardMessage, width - rightMargin + 10, whoseTurnHeight / 4);
        return;
    }

    if(player1wins || player2wins){ // ending conditions are checked here
        var message = player1wins ? player1 + " wins!" : player2 + " wins!";
        fill(0);
        textSize(whoseTurnHeight / 4);
        while(textWidth(message) > rightMargin){
            textSize(textSize() - 1);
        }
        text(message, width - rightMargin + 10, whoseTurnHeight / 4);
        if(effectiveBlackTime <= 0 || effectiveWhiteTime <= 0){
            endGameMessage = "Out of time."
        }else if(noMoreTurns){
            endGameMessage = "Out of moves; black wins."
        }else{
            endGameMessage = "No legal moves."
        }
        textSize(whoseTurnHeight / 4);
        while(textWidth(endGameMessage) > rightMargin - 20){
            textSize(textSize() - 1);
        }
        text(endGameMessage, width - rightMargin + 10, whoseTurnHeight / 2 + 10);
        inGame = false;
        return;
    }
    // Write whose turn it is:
    // Format:
    // Current Turn: (player's name) (circle of color)
    fill(0);
    var curTextSize = whoseTurnHeight / 4;
    var currentTurnText = "Current Turn:";
    var curTextSize = whoseTurnHeight / 4;
    textSize(whoseTurnHeight / 4);
    while(textWidth(currentTurnText) > rightMargin - whoseTurnHeight / 4- 10){
        curTextSize--;
        textSize(curTextSize);
    }
    text("Current Turn:", width - rightMargin + 10, whoseTurnHeight / 4 + 10);
    var textBufferSize = textWidth(currentTurnText) + 10;
    currentTurnText = (turn == 0 ? player1 : player2);
    curTextSize = whoseTurnHeight / 4;
    textSize(whoseTurnHeight / 4);
    while(textWidth(currentTurnText) > rightMargin - whoseTurnHeight / 4 - 10){
        curTextSize--;
        textSize(curTextSize);
    }
    
    text(currentTurnText, width - rightMargin + 10, whoseTurnHeight / 4 + 10 + curTextSize);
    textBufferSize = max(textBufferSize, textWidth(currentTurnText) + 10);
    if(turn == 0){
        fill(255);
    }else{
        fill(0);
    }
    stroke(0);
    ellipse(width - rightMargin + floor(rightMargin / 10) + textBufferSize, whoseTurnHeight / 4 + 10, whoseTurnHeight / 4, whoseTurnHeight / 4);
    

    var selectedRadius = selectPieceHeight / 2 + 5; // this is used to select a piece, when placing it on the board
    var heightOffset = whoseTurnHeight + selectPieceHeight / 2; // this will be updated to keep track of which row we are on
    // Format: Black time remaining -> Black Pieces -> White Pieces -> White time remaining
    // Draw each piece and write the number of pieces remaining
    // Place a red circle behind the piece if it is selected


    // Black Time Remaining
    fill(0);
    // time format: (m)m:ss.ddd
    var blackMillis = floor(effectiveBlackTime % 1000), blackSeconds = floor(effectiveBlackTime / 1000) % 60, blackMinutes = floor(effectiveBlackTime / 60000);
    var blackTimeText = "" + blackMillis;
    while(blackTimeText.length < 3){
        blackTimeText = "0" + blackTimeText;
    }
    blackTimeText = blackSeconds + "." + blackTimeText;
    while(blackTimeText.length < 6){
        blackTimeText = "0" + blackTimeText;
    }
    blackTimeText = blackMinutes + ":" + blackTimeText;
    if(blackTimeText[0] == 'N'){
        // everything is NaN
        // -> invalid time
        blackTimeText = "infinity";
    }
    textSize(selectPieceHeight / 2);
    while(textWidth(blackTimeText) > rightMargin){
        selectPieceHeight--;
        textSize(selectPieceHeight / 2);
    }
    text(blackTimeText, width - rightMargin + 10, heightOffset);

    
    // Black Bishop
    heightOffset += selectPieceHeight;
    if(selectedPiece != null && selectedPiece[1] == BLACK_BISHOP && selectedPiece[0] == -1){
        fill(255, 64, 64);
        ellipse(width - rightMargin + selectedRadius, heightOffset, selectedRadius * 2, selectedRadius * 2);
    }
    fill(0);
    stroke(255);
    image(bbishopImage, width - rightMargin, heightOffset - selectPieceHeight / 2, selectPieceHeight, selectPieceHeight);
    
    var blackBishopText = "x" + bishopsRemaining[0];
    while(textWidth(blackBishopText) > rightMargin){
        selectPieceHeight--;
        textSize(selectPieceHeight / 2);
    }
    fill(0);
    text(blackBishopText, width - rightMargin + 10 + selectPieceHeight, heightOffset + 10);
    selectNewBlackBishop = [width - rightMargin + selectPieceHeight / 2, heightOffset, selectPieceHeight / 2];

    


    // Black Knight
    heightOffset += selectPieceHeight;
    if(selectedPiece != null && selectedPiece[1] == BLACK_KNIGHT && selectedPiece[0] == -1){
        fill(255, 64, 64);
        ellipse(width - rightMargin + selectedRadius, heightOffset, selectedRadius * 2, selectedRadius * 2);
    }
    fill(0);
    stroke(255);

    image(bknightImage, width - rightMargin, heightOffset - selectPieceHeight / 2, selectPieceHeight, selectPieceHeight);

    textSize(selectPieceHeight / 2);
    var blackKnightText = "x" + knightsRemaining[0];
    while(textWidth(blackKnightText) > rightMargin){
        selectPieceHeight--;
        textSize(selectPieceHeight / 2);
    }   
    fill(0);
    text(blackKnightText, width - rightMargin + 10 + selectPieceHeight, heightOffset + 10);
    selectNewBlackKnight = [width - rightMargin + selectPieceHeight / 2, heightOffset, selectPieceHeight / 2];



    // White Bishop
    heightOffset += selectPieceHeight;
    if(selectedPiece != null && selectedPiece[1] == WHITE_BISHOP && selectedPiece[0] == -1){
        fill(255, 64, 64);
        ellipse(width - rightMargin + selectedRadius, heightOffset, selectedRadius * 2, selectedRadius * 2);
    }
    fill(255);
    stroke(0);

    image(wbishopImage, width - rightMargin, heightOffset - selectPieceHeight / 2, selectPieceHeight, selectPieceHeight);
    
    textSize(selectPieceHeight / 2);


    var whiteBishopText = "x" + bishopsRemaining[1];
    while(textWidth(whiteBishopText) > rightMargin){
        selectPieceHeight--;
        textSize(selectPieceHeight / 2);
    }
    fill(0);
    text(whiteBishopText, width - rightMargin + 10 + selectPieceHeight, heightOffset + 10);
    selectNewWhiteBishop = [width - rightMargin + selectPieceHeight / 2, heightOffset, selectPieceHeight / 2];

    // White Knight
    heightOffset += selectPieceHeight;
    if(selectedPiece != null && selectedPiece[1] == WHITE_KNIGHT && selectedPiece[0] == -1){
        fill(255, 64, 64);
        ellipse(width - rightMargin + selectedRadius, heightOffset, selectedRadius * 2, selectedRadius * 2);
    }
    fill(255);
    stroke(0);

    image(wknightImage, width - rightMargin, heightOffset - selectPieceHeight / 2, selectPieceHeight, selectPieceHeight);

    textSize(selectPieceHeight / 2);
    var whiteKnightText = "x" + knightsRemaining[1];
    while(textWidth(whiteKnightText) > rightMargin){
        selectPieceHeight--;
        textSize(selectPieceHeight / 2);
    }
    fill(0);
    text(whiteKnightText, width - rightMargin + 10 + selectPieceHeight, heightOffset + 10);
    selectNewWhiteKnight = [width - rightMargin + selectPieceHeight / 2, heightOffset, selectPieceHeight / 2];

    // White Time
    heightOffset += selectPieceHeight;
    fill(0);
    var whiteMillis = floor(effectiveWhiteTime % 1000), whiteSeconds = floor(effectiveWhiteTime / 1000) % 60, whiteMinutes = floor(effectiveWhiteTime / 60000);
    var whiteTimeText = "" + whiteMillis;
    while(whiteTimeText.length < 3){
        whiteTimeText = "0" + whiteTimeText;
    }
    whiteTimeText = whiteSeconds + "." + whiteTimeText;
    while(whiteTimeText.length < 6){
        whiteTimeText = "0" + whiteTimeText;
    }
    whiteTimeText = whiteMinutes + ":" + whiteTimeText;
    if(whiteTimeText[0] == 'N'){
        // everything is NaN
        // -> invalid time
        whiteTimeText = "infinity";
    }
    textSize(selectPieceHeight / 2);
    while(textWidth(whiteTimeText) > rightMargin){
        selectPieceHeight--;
        textSize(selectPieceHeight / 2);
    }
    text(whiteTimeText, width - rightMargin + 10, heightOffset + 10);

    // Turns remaining
    heightOffset += selectPieceHeight;
    fill(0);
    var turnsRemainingText = "Turns remaining: " + turnsRemaining;
    textSize(selectPieceHeight / 2);
    while(textWidth(turnsRemainingText) > rightMargin - 10){
        selectPieceHeight--;
        textSize(selectPieceHeight / 2);
    }
    text(turnsRemainingText, width - rightMargin + 10, heightOffset + 10);
}

function getColor(piece){
    return (piece & 4) ? 1 : 0;
}
function getType(piece){
    return piece & 3;
}

function isInsufficientMaterial(){
    return false;
}

function mouseClicked(){
    if (inGame){
        var size = min(width - rightMargin, height - bottomMargin);
        var x = Math.floor(mouseX * boardSize / size);
        var y = Math.floor(mouseY * boardSize / size);
        if(x >= 0 && x < boardSize && y >= 0 && y < boardSize){
            console.log(x, y);
            if(board[x][y] != NULL && getColor(board[x][y]) == turn){
                // select piece
                console.log("selected piece");
                selectedPiece = [x, y];
            }else if(selectedPiece != null && validateMove(selectedPiece, x, y)){
                // move piece
                console.log("moved piece");
                if(selectedPiece[0] == -1){
                    // new piece
                    board[x][y] = selectedPiece[1];
                    //subtract from remaining pieces
                    if(selectedPiece[1] == BLACK_BISHOP){
                        bishopsRemaining[0]--;
                    }else if(selectedPiece[1] == BLACK_KNIGHT){
                        knightsRemaining[0]--;
                    }else if(selectedPiece[1] == WHITE_BISHOP){
                        bishopsRemaining[1]--;
                    }else if(selectedPiece[1] == WHITE_KNIGHT){
                        knightsRemaining[1]--;
                    }
                }else{
                    board[x][y] = board[selectedPiece[0]][selectedPiece[1]];
                    board[selectedPiece[0]][selectedPiece[1]] = NULL;
                }
                flushMove();
            }
        }else{
            // check if they clicked on a piece to add
            if(mouseX > selectNewBlackBishop[0] - selectPieceHeight / 2 && mouseX < selectNewBlackBishop[0] + selectPieceHeight / 2 && mouseY > selectNewBlackBishop[1] - selectPieceHeight / 2 && mouseY < selectNewBlackBishop[1] + selectPieceHeight / 2){
                if(bishopsRemaining[0] > 0 && turn == 1){
                    selectedPiece = [-1, BLACK_BISHOP];
                    console.log("selected new black bishop");
                }
            }
            if(mouseX > selectNewBlackKnight[0] - selectPieceHeight / 2 && mouseX < selectNewBlackKnight[0] + selectPieceHeight / 2 && mouseY > selectNewBlackKnight[1] - selectPieceHeight / 2 && mouseY < selectNewBlackKnight[1] + selectPieceHeight / 2){
                if(knightsRemaining[0] > 0 && turn == 1){
                    selectedPiece = [-1, BLACK_KNIGHT];
                    console.log("selected new black knight");
                }
            }
            if(mouseX > selectNewWhiteBishop[0] - selectPieceHeight / 2 && mouseX < selectNewWhiteBishop[0] + selectPieceHeight / 2 && mouseY > selectNewWhiteBishop[1] - selectPieceHeight / 2 && mouseY < selectNewWhiteBishop[1] + selectPieceHeight / 2){
                if(bishopsRemaining[1] > 0 && turn == 0){
                    selectedPiece = [-1, WHITE_BISHOP];
                    console.log("selected new white bishop");
                }
            }
            if(mouseX > selectNewWhiteKnight[0] - selectPieceHeight / 2 && mouseX < selectNewWhiteKnight[0] + selectPieceHeight / 2 && mouseY > selectNewWhiteKnight[1] - selectPieceHeight / 2 && mouseY < selectNewWhiteKnight[1] + selectPieceHeight / 2){
                if(knightsRemaining[1] > 0 && turn == 0){
                    selectedPiece = [-1, WHITE_KNIGHT];
                    console.log("selected new white knight");
                }
            }
            
        }
    }
}
function flushMove(){
    selectedPiece = null;
    if(turn == 0){
        whiteTime -= millis() - lastTimeMeasured;
    }else{
        blackTime -= millis() - lastTimeMeasured;
    }
    lastTimeMeasured = millis();
    turn = (turn + 1) % 2;
    if(turn == 0){
        turnsRemaining--;
    }
}
function validateMove(selectedPiece, destX, destY, testKing = true){
    if(selectedPiece == null){
        return false;
    }
    var piece, color;
    if(selectedPiece[0] != -1){
        piece = getType(board[selectedPiece[0]][selectedPiece[1]]);
        color = getColor(board[selectedPiece[0]][selectedPiece[1]]);
        if(board[destX][destY] != NULL && getColor(board[destX][destY]) == color){
            return false;
        }
    }else{
        piece = getType(selectedPiece[1]);
        color = getColor(selectedPiece[1]);
    }
    // Check if king is in check after move
    if(testKing){
        tempBoard = [];
        for(var i = 0; i < boardSize; i++){
            tempBoard.push([]);
            for(var j = 0; j < boardSize; j++){
                tempBoard[i].push(board[i][j]);
            }
        }
        if(selectedPiece[0] != -1){
            board[destX][destY] = board[selectedPiece[0]][selectedPiece[1]];
            board[selectedPiece[0]][selectedPiece[1]] = NULL;
        }else{
            board[destX][destY] = selectedPiece[1];
        }
        var kingInCheck = isCheck(color);
        for(var i = 0; i < boardSize; i++){ // restore board
            for(var j = 0; j < boardSize; j++){
                board[i][j] = tempBoard[i][j];
            }
        }
        if(kingInCheck){
            return false;
        }
    }
    if(selectedPiece[0] == -1){
        if(board[destX][destY] != NULL){
            return false; // can only place new pieces on empty squares
        }
        board[destX][destY] = selectedPiece[1];
        var otherKingInCheck = isCheck(!color);
        board[destX][destY] = NULL; // restore board
        if(otherKingInCheck){
            return false; // can't put other player in check when adding a piece
        }
        return true;
    }



    if(piece == KING){
        return Math.abs(destX - selectedPiece[0]) <= 1 && Math.abs(destY - selectedPiece[1]) <= 1;
    }else if(piece == KNIGHT){
        var okay = abs(destX - selectedPiece[0]) + abs(destY - selectedPiece[1]) == 3;
        okay = okay && abs(destX - selectedPiece[0]) != 0;
        okay = okay && abs(destY - selectedPiece[1]) != 0;
        return okay;
    }else if(piece == BISHOP){
        var dx = destX - selectedPiece[0];
        var dy = destY - selectedPiece[1];
        if(abs(dx) != abs(dy)){
            return false;
        }
        var x = selectedPiece[0];
        var y = selectedPiece[1];
        x += dx / abs(dx);
        y += dy / abs(dy);
        while(x != destX){
            if(board[x][y] != NULL){
                return false;
            }
            x += dx / abs(dx);
            y += dy / abs(dy);
        }
        return true;
    }else{
        console.log("huh? unknown piece type");
    }
}

function isCheck(color){
    var kingX = -1;
    var kingY = -1;
    for(var i = 0; i < boardSize; i++){
        for(var j = 0; j < boardSize; j++){
            if(getType(board[i][j]) == KING && getColor(board[i][j]) == color){
                kingX = i;
                kingY = j;
            }
        }
    }
    if(kingX == -1 || kingY == -1){
        // console.log("huh? king not found");
        return false;
    }
    // opponent piece can capture king
    for(var i = 0; i < boardSize; i++){
        for(var j = 0; j < boardSize; j++){
            if(board[i][j] != NULL && getColor(board[i][j]) != color && validateMove([i, j], kingX, kingY, false)){
                return true;
            }
        }
    }
    return false;
}

function isCheckMate(color){
    // var kingX = -1;
    // var kingY = -1;
    // for(var i = 0; i < boardSize; i++){
    //     for(var j = 0; j < boardSize; j++){
    //         if(getType(board[i][j]) == KING && getColor(board[i][j]) == color){
    //             kingX = i;
    //             kingY = j;
    //         }
    //     }
    // }
    // if(kingX == -1 || kingY == -1){
    //     console.log("huh? king not found");
    //     return false;
    // }
    // if(!isCheck(color)){
    //     console.log("not check now")
    //     return false;
    // }
    // for(var dx = -1; dx <= 1; dx++){
    //     for(var dy = -1; dy <= 1; dy++){
    //         if(kingX + dx < 0 || kingX + dx >= boardSize || kingY + dy < 0 || kingY + dy >= boardSize){
    //             continue;
    //         }
    //         if(validateMove([kingX, kingY], kingX + dx, kingY + dy)){
    //             return false;
    //         }
    //     }
    // }
    // return true;
    // if no move exists, the player loses
    if (color != turn) {
        return false;
    }
    var moveExist = false;
    // console.log("color:", color)
    // console.log("turn:", turn)
    // console.log("bishopsRemaining[0]:", bishopsRemaining[0])
    // console.log("knightsRemaining[0]:", knightsRemaining[0])
    // console.log("bishopsRemaining[1]:", bishopsRemaining[1])
    // console.log("knightsRemaining[1]:", knightsRemaining[1])


    for (var i = 0; i < boardSize; i++){
        // add piece
        for (var j = 0; j < boardSize; j++){
            if(bishopsRemaining[0] > 0 && turn == 1 && validateMove([-1, BLACK_BISHOP], i, j)){
                moveExist = true;
            }
            if(knightsRemaining[0] > 0 && turn == 1 && validateMove([-1, BLACK_KNIGHT], i, j)){
                moveExist = true;
            }
            if(bishopsRemaining[1] > 0 && turn == 0 && validateMove([-1, WHITE_BISHOP], i, j)){
                moveExist = true;
            }
            if(knightsRemaining[1] > 0 && turn == 0 && validateMove([-1, WHITE_KNIGHT], i, j)){
                moveExist = true;
            }
            // move
            if (board[i][j] != NULL && getColor(board[i][j]) == turn) {
                for (var x = 0; x < boardSize; x++){
                    // add piece
                    for (var y = 0; y < boardSize; y++){
                        if (validateMove([i, j], x, y)) {
                            moveExist = true;
                        }
                    }
                }
            }
        }
    }
    return !moveExist;
}