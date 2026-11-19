var MapFile = require('./map');
var EscapeeFile = require('./escapee');
var Vue = require('./lib/vue.js');
var DetectiveFile = require('./detective');
const escapee = require('./escapee');
var Map = MapFile(8);
var Escapee = EscapeeFile(20);
var Detectives;
var PreviousEscapee = [];
var PreviousDetective = [];
var CurrDetective = [];

var game = new Vue({
    el: '#gameArea',
    data: {
        size : 8,
        nodes: Map.nodes,
        hedges: Map.hedges,
        vedges: Map.vedges,
        instr: false,
        winnerName: "",
        gameStatus: "mode selection",
        displayText: "Select the mode",
        guessRound: 1,
        gameRound: 1,
        mode : "PvP",
        difficulty : "Normal (3 detectives)",
        scoreOne: 0,
        scoreTwo: 0,
        reveal: "Reveal Escapee",
        numMoves: 0,
        maxMoves: 32,
        lastKnightMove: -3,
        numDetectives: 3,
        detectives: [2,3,4,5]
    },

    methods: {
        //Game logic
        startGame: function () {
            alert("New game has started");
            this.scoreTwo = 0;
            this.scoreOne = 0;
            this.numMoves = 0; 
            this.lastKnightMove = -3;
            Detectives = null;
            PreviousEscapee = [];
            PreviousDetective = [];
            CurrDetective = [];
            Escapee = EscapeeFile(parseInt(this.size));
            Detectives = DetectiveFile(this.numDetectives);
            // if(this.difficulty == "Normal"){
            //     Detectives = DetectiveFile(3);
            // }
            // else{
            //     Detectives = DetectiveFile(4);
            // }
            Map.totalClearBoard();
            Detectives.resetDetectives();
            alert("Place the detectives now");
            this.gameStatus = "Detective initial position";
            this.displayText = "Place detectives at initial position";
        },

       

        //Node can be clicked only when it is guessing.
        nodeClick: function (node) {
            if(this.gameStatus == "node/edge detection" && this.gameRound < 4) {
                Map.prepare(node);
                Escapee.prepareNode(node);
            }

            else if(this.gameStatus == "Escapee initial position"){
                if(Map.nodes[node.x][node.y].class.valid == true){
                    Escapee.setPosition(node.x, node.y);
                    this.hideInitialValid();
                    Map.nodes[node.x][node.y].class.escapee = true;
                    this.gameStatus = "Escapee position chosen";
                    this.displayText = "Escapee has chosen position";
                }
                else{
                    alert("Please choose a valid initial position");
                }
            }

            else if(this.gameStatus == "Escapee position chosen"){
                if(node.x == 8){
                    var escapeePosition = Escapee.getPosition();
                    Map.toggleEscapee(Map.nodes[escapeePosition.posX][escapeePosition.posY]);
                    Escapee.setPosition(node.x, node.y);
                    Map.toggleEscapee(node);
                }
                else{
                    alert("Please choose a valid initial position");

                }
            }

            else if(this.gameStatus == "Detective initial position" || this.gameStatus == "Detective position chosen"){
                if(node.x > 4 || node.x == 0){
                    alert("Please choose a valid initial position (from row 2 to 5)");
                }
                else{
                    var found = false;
                    var loc = -1;
                    for(var i=0; i<Detectives.getCurrDetectives(); i++){
                        var locDetective = Detectives.getDetective(i);
                        if(locDetective[0] == node.x && locDetective[1] == node.y){
                            found = true;
                            loc = -1;
                            break;
                        }
                    }
                    if(found){
                        Map.toggleDetective(node);
                        Detectives.removeDetective(loc);
                        if(Detectives.getCurrDetectives() == 0){
                            this.gameStatus = "Detective initial position";
                            this.displayText = "Place detectives at initial position";
                        }
                    }
                    else if(Detectives.getCurrDetectives() == Detectives.getMaxDetectives()){
                        alert("Maximum detectives is reached, please de-select one to choose new position");
                    }
                    else{
                        Map.toggleDetective(node);
                        Detectives.addDetective(node.x, node.y);
                        this.gameStatus = "Detective position chosen";
                        this.displayText = "Detective has chosen position";
                    }
                }
            }

            else if(this.gameStatus == "Escapee's turn"){
                if(Map.nodes[node.x][node.y].class.valid){
                    var escapeePosition = Escapee.getPosition();
                    Map.nodes[escapeePosition.posX][escapeePosition.posY].class.escapee = false;
                    if(PreviousEscapee.length != 0){
                        Map.nodes[PreviousEscapee[0]][PreviousEscapee[1]].class.escapee = false;
                        Map.nodes[PreviousEscapee[0]][PreviousEscapee[1]].class.prepare = true;
                    }
                    Map.nodes[node.x][node.y].class.escapee = true;
                    PreviousEscapee = [];
                    PreviousEscapee.push(node.x);
                    PreviousEscapee.push(node.y);
                }   
                else{
                    alert("Please choose valid position for escapee");
                }         
            }

            else if(this.gameStatus == "Detective's turn"){
                if(Detectives.isDetective(node.x, node.y) != -1){
                    if(CurrDetective.length != 0){
                        console.log("New detective is here");
                        Map.nodes[CurrDetective[0]][CurrDetective[1]].class.detective = false;
                        Map.nodes[CurrDetective[0]][CurrDetective[1]].class.prepare = true;
                        Map.nodes[PreviousDetective[0]][PreviousDetective[1]].class.detective = true;
                        this.toggleDetectivePositions(PreviousDetective[0], PreviousDetective[1]);
                    }
                    else if(PreviousDetective.length != 0){
                        this.toggleDetectivePositions(PreviousDetective[0], PreviousDetective[1]);
                    }
                    CurrDetective = [];
                    PreviousDetective = [];
                    PreviousDetective.push(node.x);
                    PreviousDetective.push(node.y);
                    this.toggleDetectivePositions(node.x, node.y);
                }
                else if(Map.nodes[node.x][node.y].class.valid){
                    if(CurrDetective.length != 0){
                        Map.nodes[CurrDetective[0]][CurrDetective[1]].class.detective = false;
                        Map.nodes[CurrDetective[0]][CurrDetective[1]].class.prepare = true;
                    }
                    CurrDetective = [];
                    CurrDetective.push(node.x);
                    CurrDetective.push(node.y);
                    Map.nodes[CurrDetective[0]][CurrDetective[1]].class.prepare = false;
                    Map.nodes[CurrDetective[0]][CurrDetective[1]].class.detective = true;
                    Map.nodes[PreviousDetective[0]][PreviousDetective[1]].class.detective = false;
                }
                else{
                    alert("Please choose valid detective position");
                }
            }
        },

        endGame: function () {
            this.gameRound = 1;
            this.guessRound = 1;
            this.gameStatus = "game end";
            this.gameStatus = "Game has ended";
            Map.totalClearBoard();
        },

        clearBoard: function () {
            // Escapee.resetEscapee();
            Map.clearBoard();
        },

        gotoBegin: function () {
            Map.totalClearBoard();
            this.gameStatus = "mode selection";
            this.displayText= "Select the mode";
        },

        isValid: function () {
            return Escapee.isValid(this.size);
        },

        edgeLeft: function () {
            return Escapee.edgeLeft();
        },

        revealBoard: function () {
            Map.totalClearBoard();
            if(this.reveal == "Reveal Escapee"){
                var Escapee = Escapee.getEscapee();
                Escapee.map(
                    function (edge) {
                        Map.reveal(edge,"good");
                    }
                );
                this.reveal = "Hide Escapee";
            } else {
                this.reveal = "Reveal Escapee";
            }

        },

        startNextRound: function () {
            this.gameRound++;
            this.guessRound = 1;
            Map.totalClearBoard();
            Escapee.resetEscapee();
            this.gameStatus = "Escapee building";
        },

        showBetweenGameInfo: function () {
            return this.gameStatus == "Between two game";
        },

        showSaveButton: function () {
            return (this.scoreOne > 0 || this.scoreTwo > 0) && this.gameStatus == "game end";
        },

        showEdgeInfo: function () {
            return this.gameStatus == "Escapee building";
        },

        showGuessInfo: function () {
            return this.gameStatus == "node/edge detection";
        },

        showModeSelect: function () {
            return this.gameStatus == "mode selection";
            this.displayText= "Select the mode";
        },

        showInstr: function(){
            return this.instr;
        },

        changeInstr: function () {
            this.instr = !this.instr;
        },

        showInitialValid: function() { 
            //Changes colour of all the nodes on row 8 
            for(var i = 0; i <= 8; i++){
                Map.togglePrepare(Map.nodes[8][i]);
            }
        },

        hideInitialValid: function() { 
            //Changes colour of all the nodes on row 8 
            for(var i = 0; i <= 8; i++){
                Map.togglePrepare(Map.nodes[8][i]);
            }
        },
        toggleEscapeePositions: function() {
            var escapeePosition = Escapee.getPosition();
            if(escapeePosition.posX > 0 && !Map.nodes[escapeePosition.posX-1][escapeePosition.posY].class.detective){
                Map.togglePrepare(Map.nodes[escapeePosition.posX-1][escapeePosition.posY]);
            }
            if(escapeePosition.posX < 8 && !Map.nodes[escapeePosition.posX+1][escapeePosition.posY].class.detective){
                Map.togglePrepare(Map.nodes[escapeePosition.posX+1][escapeePosition.posY]);
            }
            if(escapeePosition.posY > 0 && !Map.nodes[escapeePosition.posX][escapeePosition.posY-1].class.detective){
                Map.togglePrepare(Map.nodes[escapeePosition.posX][escapeePosition.posY-1]);
            }
            if(escapeePosition.posY < 8 && !Map.nodes[escapeePosition.posX][escapeePosition.posY+1].class.detective){
                Map.togglePrepare(Map.nodes[escapeePosition.posX][escapeePosition.posY+1]);
            }
            if(this.numMoves-this.lastKnightMove >= 3){
                
                if(escapeePosition.posX > 1 && escapeePosition.posY > 0 && !Map.nodes[escapeePosition.posX-2][escapeePosition.posY-1].class.detective){
                    Map.togglePrepare(Map.nodes[escapeePosition.posX-2][escapeePosition.posY-1]);
                }
                if(escapeePosition.posX > 0 && escapeePosition.posY > 1 && !Map.nodes[escapeePosition.posX-1][escapeePosition.posY-2].class.detective){
                    Map.togglePrepare(Map.nodes[escapeePosition.posX-1][escapeePosition.posY-2]);
                }
                if(escapeePosition.posX < 7 && escapeePosition.posY > 0 && !Map.nodes[escapeePosition.posX+2][escapeePosition.posY-1].class.detective){
                    Map.togglePrepare(Map.nodes[escapeePosition.posX+2][escapeePosition.posY-1]);
                }
                if(escapeePosition.posX < 8 && escapeePosition.posY > 1 && !Map.nodes[escapeePosition.posX+1][escapeePosition.posY-2].class.detective){
                    Map.togglePrepare(Map.nodes[escapeePosition.posX+1][escapeePosition.posY-2]);
                }
                if(escapeePosition.posX > 1 && escapeePosition.posY < 8 && !Map.nodes[escapeePosition.posX-2][escapeePosition.posY+1].class.detective){
                    Map.togglePrepare(Map.nodes[escapeePosition.posX-2][escapeePosition.posY+1]);
                }
                if(escapeePosition.posX > 0 && escapeePosition.posY < 7 && !Map.nodes[escapeePosition.posX-1][escapeePosition.posY+2].class.detective){
                    Map.togglePrepare(Map.nodes[escapeePosition.posX-1][escapeePosition.posY+2]);
                }
                if(escapeePosition.posX < 7 && escapeePosition.posY < 8 && !Map.nodes[escapeePosition.posX+2][escapeePosition.posY+1].class.detective){
                    Map.togglePrepare(Map.nodes[escapeePosition.posX+2][escapeePosition.posY+1]);
                }
                if(escapeePosition.posX < 8 && escapeePosition.posY < 7 && !Map.nodes[escapeePosition.posX+1][escapeePosition.posY+2].class.detective){
                    Map.togglePrepare(Map.nodes[escapeePosition.posX+1][escapeePosition.posY+2]);
                }
            }
        },

        toggleDetectivePositions: function(x, y) {
            if(x > 0){
                Map.togglePrepare(Map.nodes[x-1][y]);
            }
            if(x < 8){
                Map.togglePrepare(Map.nodes[x+1][y]);
            }
            if(y > 0){
                Map.togglePrepare(Map.nodes[x][y-1]);
            }
            if(y < 8){
                Map.togglePrepare(Map.nodes[x][y+1]);
            }
        },


        submit: function() { 
            console.log("Submit button was clicked");
            if(this.gameStatus == "Detective position chosen"){
                alert("Detectives position fixed"); 
                this.gameStatus = "Escapee initial position";
                this.displayText = "Place Escapee at initial position";
                this.showInitialValid();
                // add some animation that highlights escapee's position. 
            } else if(this.gameStatus == "Escapee position chosen") {
                alert("Escapee position fixed"); 
                this.gameStatus = "Escapee's turn";
                this.displayText = "Escapee's turn";
                this.toggleEscapeePositions();
                // add some animation that highlights escapee's position. 
            }
            else if(this.gameStatus == "Escapee's turn") {
                if(PreviousEscapee.length == []){
                    alert("Please choose valid position for escapee");
                }
                else{
                    this.toggleEscapeePositions();
                    var escapeePosition = Escapee.getPosition();
                    if(Math.abs(PreviousEscapee[0]-escapeePosition.posX) > 1 || Math.abs(PreviousEscapee[1]-escapeePosition.posY) > 1){
                        this.lastKnightMove = this.numMoves;
                    }
                    Map.nodes[escapeePosition.posX][escapeePosition.posY].class.valid = false;
                    Escapee.setPosition(PreviousEscapee[0], PreviousEscapee[1]);
                    if(PreviousEscapee[0] == 0){
                        alert("Escapee has won the game");
                        this.startGame();
                    }
                    else{
                        this.gameStatus = "Detective's turn";
                        this.displayText = "Detective's turn";
                        PreviousEscapee = [];
                        this.numMoves += 1;
                        console.log(this.numMoves, this.maxMoves, this.lastKnightMove);
                        if(this.numMoves >= this.maxMoves){
                            alert("Detectives have won the game");
                            this.startGame();
                        }
                    }
                }
                // add some animation that highlights escapee's position. 
            }
            else if(this.gameStatus == "Detective's turn") {
                if(PreviousDetective.length == [] || CurrDetective.length == [] || Detectives.isDetective(CurrDetective[0], CurrDetective[1]) != -1){
                    alert("Please choose valid position for detective");
                }
                else{
                    console.log(PreviousDetective);
                    console.log(CurrDetective);
                    {
                        this.toggleDetectivePositions(PreviousDetective[0], PreviousDetective[1]);
                        Map.nodes[PreviousDetective[0]][PreviousDetective[1]].class.valid = false;
                        Map.nodes[PreviousDetective[0]][PreviousDetective[1]].class.prepare = false;
                        var detectiveIndex = Detectives.isDetective(PreviousDetective[0], PreviousDetective[1]);
                        Detectives.removeDetective(detectiveIndex);
                        Detectives.addDetective(CurrDetective[0], CurrDetective[1]);
                        Map.nodes[CurrDetective[0]][CurrDetective[1]].class.valid = false;
                        Map.nodes[CurrDetective[0]][CurrDetective[1]].class.prepare = false;
                        this.gameStatus = "Escapee's turn";
                        this.displayText = "Escapee's turn";
                        var escapeePosition = Escapee.getPosition();
                        if(escapeePosition.posX == CurrDetective[0] && escapeePosition.posY == CurrDetective[1]){
                            alert("Detectives have won the game");
                            this.startGame();
                        }
                        else{
                            PreviousDetective = [];
                            CurrDetective = [];
                            this.toggleEscapeePositions();
                    }
                    }
                }
                // add some animation that highlights escapee's position. 
            }
        }
    }
});