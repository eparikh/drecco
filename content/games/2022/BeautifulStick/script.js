function setup() {
    width = document.getElementById('game-container').offsetWidth - 100;
    containerHeight = window.innerHeight;
    height = width * 3 / 4 - width / 6;
    gridCont = createDiv("");
    gridCont.parent('grid');
    gridCont.attribute('class', 'box');

    stickCont = createDiv("");
    stickCont.parent('stick');
    stickCont.attribute('class', 'box');
    buttonCont = $("#gridbuttonCont");
    stickbuttonCont = $("#stickbuttonCont");
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
var gridCont;
var stickCont;
var buttonCont;
var stickbuttonCont;
var boardSize = -1;
var numberStick = -1;
var stickLen = -1;
var inGame = false;
var done = false;
var gamestage = 0;
var game;
var message = '';
var stick_ul;
var guessGrid;
var selected_vertex_number = 0;
var placed_stick_num = 0;
var curStick;
var curvertex = [];
var grid_liss;
var stick_match_list = [];
var final = 0;
function draw() {
}

    /*
     * Properties is an object containing all necessary information for game.
     *
     * - numberOfWeights: number of weights in the game
     * - boardLength: length of the board
     * - boardWeight: the weight of the board
     * - player1: Gives the name for player 1.
     * - player2: Gives the name for player 2.
     * - time: Amount of time that each player has
     */
function startGame() {
    player1 = document.getElementById("player-1").value;
    player2 = document.getElementById("player-2").value;
    numberStick = Number(document.getElementById("number-of-sticks").value);
    boardSize = Number(document.getElementById("size-of-board").value);

    if(numberStick <= 0) {
        document.getElementById('error-message').innerText = "maximum stick number is too small.";
        document.getElementById('error-container').style.display = 'block';
        inGame = false;
        return;
    }

    if(boardSize <= 0) {
        document.getElementById('error-message').innerText = "Grid size is too small.";
        document.getElementById('error-container').style.display = 'block';
        inGame = false;
        return;
    }

    $("#size-of-board").attr("disabled","disabled");
    $("#length-of-stick").attr("disabled","disabled");
    $("#number-of-sticks").attr("disabled","disabled");
    $("#player-1").attr("disabled","disabled");
    $("#player-2").attr("disabled","disabled");
    $("#game_start").attr("disabled","disabled");
    game = new Game({
        player1: player1,
        player2: player2,
        numberOfSticks: numberStick,
        gridSize: boardSize,
    });

    inGame = true;
    gamestage = 1;
    let message = "Game Start! Player Drawer(" + game.player1 + ") please draw a picture.  Click the grid and change the color";
    updateMessage(message);
    initGrid();
}

function updateMessage(message) {
    $("#message").text(message);
}

function initGrid() {
    
    let num = game.gridSize;
    let uls = []
    let liss = []
    for(let i=0;i<num;i++){
        let lis = [];
        let ul = createElement('ul');
        for(let j=0;j<num;j++){
            curstate = game.grid.gridState[i][j];
            let index = i + "," + j
            let li = createElement('li',index);
            if(curstate == 0) {
                li.attribute('class', 'blue');
            } else if(curstate == 1) {
                li.attribute('class', 'red');
            } else {
                throw console.error("undefined color");
            }
            li.parent(ul);
            li.mousePressed(() => {
                gridclick(li,i,j)
            });
            lis.push(li);
        }
        ul.parent(gridCont);
        uls.push(ul);
        liss.push(lis);
    }
   
    grid_liss = liss;

    let button = createButton('Submit grid');
    button.attribute('class', 'btn btn-success')
    button.parent("gridbuttonCont");
    button.mousePressed(() => {
        gamestage = 2;
        button.remove();
        submitGrid()
    });
    
}

function gridclick(li,i,j) {
    if(gamestage == 1) {
        game.grid.changecolor(i,j);
        let isRed=game.grid.gridState[i][j];
        if(isRed){
            li.attribute('class', 'red');
        }else{
            li.attribute('class', 'blue');
        }
    }
}

function submitGrid() {
    cleanboard();
    let message = "Player Stick-Matcher(" + game.player2 + ") please suggests the stick length. This is the " +(game.currentStickNumber+1) +"th Stick";
    updateMessage(message);
    let inp = createInput('');
    inp.attribute('value', game.gridSize/2);
    inp.attribute('type', "number");
    inp.attribute('class', "info-input form-control");
    inp.parent("stickbuttonCont");
    let frozebutton = createButton('Submit stick length');
    frozebutton.attribute('class', 'btn btn-success');
    frozebutton.parent("stickbuttonCont");
    frozebutton.mousePressed(() => {
        if(inp.value()<=game.minstickLen || inp.value()> game.gridSize){
            alert("invalid input number");
            return;
        }
        inp.attribute('disabled','disabled');
        frozebutton.attribute('disabled','disabled');
        let stick = initStick(inp.value());
        let message = "Player Stick-Matcher(" + game.player2 + ") please suggests a stick.  Click the stick and change the color.  This is the " +(game.currentStickNumber+1) +"th Stick";
        updateMessage(message);
        let button = createButton('Submit stick');
        button.attribute('class', 'btn btn-success');
        button.parent("stickbuttonCont");
        button.mousePressed(() => {
            stick_ul.remove();
            submitStick(stick);
            game.currentStickNumber++;
            button.remove();
            inp.remove();
            frozebutton.remove();
        });
    });
    
}

function chooseSticklength() {

}

function cleanboard() {
    for( lis of grid_liss) {
        for(li of lis) {
            li.attribute('class', 'grey');
        }
    }
}


function initStick(len) {
    let stick_lis = [];
    let num = len;
    let stick = new Stick(num);
    stick_ul = createElement('ul');
    for(let i=0;i<num;i++){
        curstate = stick.stickState[i];
        let index = i;
        let li = createElement('li',index);
        if(curstate == 0) {
            li.attribute('class', 'blue');
        } else if(curstate == 1) {
            li.attribute('class', 'red');
        } else {
            throw console.error("undefined color");
        }
        li.parent(stick_ul);
        li.mousePressed(() => {
            stickclick(stick,li,i)
        });
        stick_lis.push(li);
    }
    stick_ul.parent(stickCont);
    return stick;
}

function stickclick(stick,li,i){
    if(gamestage == 2) {
        stick.changecolor(i);
        let isRed=stick.stickState[i];
        if(isRed){
            li.attribute('class', 'red');
        }else{
            li.attribute('class', 'blue');
        }
    }
}

function submitStick(stick){
    game.Sticks.push(stick);
    let grid_num  = game.grid.gridLength;
    let stick_num = stick.stickState.length;
    let res_list = [];
    let res_vertex_start = [];
    let res_vertex_end = [];
    for(let i = 0; i < grid_num; ++i) {
        for(let j=0;j <= grid_num - stick_num;++j) {
            let cnt = 0;
            for(;cnt<stick_num;++cnt) {
                if(game.grid.gridState[i][j+cnt] !== stick.stickState[cnt]) {
                    break;
                }
            }
            if(cnt == stick_num) {
                for(let k=0;k<stick_num;++k) {
                    res_list.push([i,j+k]);
                }
                res_vertex_start.push([i,j]);
                res_vertex_end.push([i,j+stick_num-1]);
            }

        }
        for(let j=0;j <= grid_num - stick_num;++j) {
            let cnt = 0;
            for(;cnt<stick_num;++cnt) {
                if(game.grid.gridState[i][j+cnt] !== stick.stickState[stick_num-cnt-1]) {
                    break;
                }
            }
            if(cnt == stick_num) {
                for(let k=0;k<stick_num;++k) {
                    res_list.push([i,j+k]);
                }
                res_vertex_end.push([i,j]);
                res_vertex_start.push([i,j+stick_num-1]);
            }
        }
    }
    for(let j = 0; j < grid_num; ++j) {
        for(let i=0;i <= grid_num - stick_num;++i) {
            let cnt = 0;
            for(;cnt<stick_num;++cnt) {
                if(game.grid.gridState[i+cnt][j] !== stick.stickState[cnt]) {
                    break;
                }
            }
            if(cnt == stick_num) {
                for(let k=0;k<stick_num;++k) {
                    res_list.push([i+k,j]);
                }
                res_vertex_start.push([i,j]);
                res_vertex_end.push([i+stick_num-1,j]);
            }
        }
        for(let i=0;i <= grid_num - stick_num;++i) {
            let cnt = 0;
            for(;cnt<stick_num;++cnt) {
                if(game.grid.gridState[i+cnt][j] !== stick.stickState[stick_num-cnt-1]) {
                    break;
                }
            }
            if(cnt == stick_num) {
                for(let k=0;k<stick_num;++k) {
                    res_list.push([i+k,j]);
                }
                res_vertex_end.push([i,j]);
                res_vertex_start.push([i+stick_num-1,j]);
            }
        }
       
    }
    stick.stickMatch.push(res_vertex_start);
    stick.stickMatch.push(res_vertex_end);
    console.log(stick.stickMatch);
    for(let index of res_list) {
        let i = index[0];
        let j = index[1];
        let isRed=game.grid.gridState[i][j];
        if(isRed){
            grid_liss[i][j].attribute('class', 'red');
        }else{
            grid_liss[i][j].attribute('class', 'blue');
        }
    }
    let button = createButton('next phase');
    button.attribute('class', 'btn btn-success');
    button.parent("gridbuttonCont");
    button.mousePressed(() => {
        nextphase();
        button.remove();
    });
}


function nextphase() {
    cleanboard();
    if(game.currentStickNumber < game.numberOfSticks) {
        let message = "Player Stick-Matcher(" + game.player2 + ") please suggests the stick length. This is the " +(game.currentStickNumber+1) +"th Stick";
        updateMessage(message);
        let inp = createInput('');
        inp.attribute('value', game.gridSize/2);
        inp.attribute('type', "number");
        inp.attribute('class', "info-input form-control");
        inp.parent("stickbuttonCont");
        let frozebutton = createButton('Submit stick length');
        frozebutton.attribute('class', 'btn btn-success');
        frozebutton.parent("stickbuttonCont");
        frozebutton.mousePressed(() => {
            if(inp.value()<=game.minstickLen || inp.value()> game.gridSize){
                alert("invalid input number");
                return;
            }
            inp.attribute('disabled','disabled');
            frozebutton.attribute('disabled','disabled');
            let stick = initStick(inp.value());
            let message = "Player Stick-Matcher(" + game.player2 + ") please suggests a stick.  Click the stick and change the color.  This is the " +(game.currentStickNumber+1) +"th Stick";
            updateMessage(message);
            let button = createButton('Submit stick');
            button.attribute('class', 'btn btn-success');
            button.parent("stickbuttonCont");
            button.mousePressed(() => {
                stick_ul.remove();
                submitStick(stick);
                game.currentStickNumber++;
                button.remove();
                inp.remove();
                frozebutton.remove();
            });
        });
    } else {
        gamestage = 3;
        guessGrid = new Grid(game.gridSize);
        guessGrid.initGuessGrid();
        let message = "Player Stick-Matcher(" + game.player2 + ") please matches the stick.  Click the grid and place the stick.  Select the select boxes.  ";
        updateMessage(message);
        let newstick_ul_list = [];
        let sel_list = [];
        for(let i=0;i<game.Sticks.length;++i) {
            let newstick_ul = createElement('ul');
            console.log(game.Sticks[i].stickState.length);
            for(let j=0;j<game.Sticks[i].stickState.length;j++) {
                let curstate = game.Sticks[i].stickState[j];
                let index = j;
                let li = createElement('li',index);
                if(curstate == 0) {
                    li.attribute('class', 'blue');
                } else if(curstate == 1) {
                    li.attribute('class', 'red');
                } else {
                    throw console.error("undefined color");
                }
                li.parent(newstick_ul);
            }
            newstick_ul.parent(stickCont);
            newstick_ul_list.push(newstick_ul);
            let sel = createSelect();
            console.log(game.Sticks[i].stickMatch);
            for(let j=0;j<game.Sticks[i].stickMatch[0].length;++j) {
                sel.option(game.Sticks[i].stickMatch[0][j].toString()+"->"+game.Sticks[i].stickMatch[1][j].toString(),j);
            }
            sel.attribute("class", "form-control high_rev")
            sel.option("skip",-1);
            sel.selected(-1);
            sel.previous = [];
            sel.auto = 0;
            sel.changed(() => {
                let j = sel.value();

                if(sel.previous.length != 0) {
                    if(sel.previous[0][0] == sel.previous[1][0]) {
                        let x = sel.previous[0][0] ;
                        for(let k=sel.previous[0][1]; k<=sel.previous[1][1];++k) {
                            guessGrid.gridState[x][k] = -1;
                            grid_liss[x][k].attribute('class', 'grey');
                        }
                    } else {
                        let y = sel.previous[0][1] ;
                        for(let k=sel.previous[0][0]; k<=sel.previous[1][0];++k) {
                            guessGrid.gridState[k][y] = -1;
                            grid_liss[k][y].attribute('class', 'grey');
                        }
                    }
                }
                if(j == -1)  {
                    if(auto == 1)
                        return;
                    auto = 0;
                    sel.previous = [];
                    return;
                }
                if (game.Sticks[i].stickMatch[0][j][0] == game.Sticks[i].stickMatch[1][j][0]) {
                    let x = game.Sticks[i].stickMatch[0][j][0];
                    if (game.Sticks[i].stickMatch[0][j][1] < game.Sticks[i].stickMatch[1][j][1]) {
                        let flag = 0;
                        for(let k=game.Sticks[i].stickMatch[0][j][1]; k<=game.Sticks[i].stickMatch[1][j][1];++k) {
                            if(guessGrid.gridState[x][k] != -1) {
                                flag = 1;
                                sel.selected(-1);
                                sel.auto = 1;
                                alert("invalid selected place");
                                return;
                            }
                        }
                        if(flag == 0) {
                            for(let k=game.Sticks[i].stickMatch[0][j][1]; k<=game.Sticks[i].stickMatch[1][j][1];++k) {
                                guessGrid.gridState[x][k] = game.grid.gridState[x][k];
                                let isRed=game.grid.gridState[x][k];
                                if(isRed){
                                    grid_liss[x][k].attribute('class', 'red');
                                } else {
                                    grid_liss[x][k].attribute('class', 'blue');
                                }
                            }
                            sel.previous = [game.Sticks[i].stickMatch[0][j],game.Sticks[i].stickMatch[1][j]];
                        }
                    } else {
                        let flag = 0;
                        for(let k=game.Sticks[i].stickMatch[1][j][1]; k<=game.Sticks[i].stickMatch[0][j][1];++k) {
                            if(guessGrid.gridState[x][k] != -1) {
                                flag = 1;
                                sel.selected(-1);
                                sel.auto = 1;
                                alert("invalid selected place");
                                return;
                            }
                        }
                        if(flag == 0) {
                            for(let k=game.Sticks[i].stickMatch[1][j][1]; k<=game.Sticks[i].stickMatch[0][j][1];++k) {
                                guessGrid.gridState[x][k] = game.grid.gridState[x][k];
                                let isRed=game.grid.gridState[x][k];
                                if(isRed){
                                    grid_liss[x][k].attribute('class', 'red');
                                } else {
                                    grid_liss[x][k].attribute('class', 'blue');
                                }
                            }
                            sel.previous = [game.Sticks[i].stickMatch[1][j],game.Sticks[i].stickMatch[0][j]];
                        }
                    }
                    
                } else {
                    let y = game.Sticks[i].stickMatch[0][j][1];
                    if (game.Sticks[i].stickMatch[0][j][0] < game.Sticks[i].stickMatch[1][j][0]) {
                        let flag = 0;
                        for(let k=game.Sticks[i].stickMatch[0][j][0]; k<=game.Sticks[i].stickMatch[1][j][0];++k) {
                            if(guessGrid.gridState[k][y] != -1) {
                                flag = 1;
                                sel.selected(-1);
                                sel.auto = 1;
                                alert("invalid selected place");
                                return;
                            }
                        }
                        if(flag == 0) {
                            for(let k=game.Sticks[i].stickMatch[0][j][0]; k<=game.Sticks[i].stickMatch[1][j][0];++k) {
                                guessGrid.gridState[k][y] = game.grid.gridState[k][y];
                                let isRed=game.grid.gridState[k][y];
                                if(isRed){
                                    grid_liss[k][y].attribute('class', 'red');
                                } else {
                                    grid_liss[k][y].attribute('class', 'blue');
                                }
                            }
                            sel.previous = [game.Sticks[i].stickMatch[0][j],game.Sticks[i].stickMatch[1][j]];
                        }
                    } else {
                        let flag = 0;
                        for(let k=game.Sticks[i].stickMatch[1][j][0]; k<=game.Sticks[i].stickMatch[0][j][0];++k) {
                            if(guessGrid.gridState[k][y] != -1) {
                                flag = 1;
                                sel.selected(-1);
                                sel.auto = 1;
                                alert("invalid selected place");
                                return;
                            }
                        }
                        if(flag == 0) {
                            for(let k=game.Sticks[i].stickMatch[1][j][0]; k<=game.Sticks[i].stickMatch[0][j][0];++k) {
                                guessGrid.gridState[k][y] = game.grid.gridState[k][y];
                                let isRed=game.grid.gridState[k][y];
                                if(isRed){
                                    grid_liss[k][y].attribute('class', 'red');
                                } else {
                                    grid_liss[k][y].attribute('class', 'blue');
                                }
                            }
                            sel.previous = [game.Sticks[i].stickMatch[1][j],game.Sticks[i].stickMatch[0][j]];
                        }
                    }
                }
                auto = 0;
                console.log(sel.previous);
                return;
            });
            sel.parent(stickCont);
            sel_list.push(sel);
        }
        let button = createButton('submit');
        button.attribute('class', 'btn btn-success');
        button.parent("stickbuttonCont");
        button.mousePressed(() => {
            for(let tmp of newstick_ul_list) {
                tmp.remove();
            }
            for(let tmp of sel_list) {
                tmp.remove();
            }
            button.remove();
            gamestage = 4;
            let cnt = 0;
            for(let i = 0; i < game.grid.gridLength; ++i) {
                for(let j=0;j< game.grid.gridLength;++j) {
                    if(game.grid.gridState[i][j]==guessGrid.gridState[i][j]) {
                        cnt++;
                    }
                }
            }
            let message = "Player Stick-Matcher(" + game.player2 + ") get score: "+cnt+ " !";
            updateMessage(message);
            let newbutton = createButton('restart game');
            newbutton.attribute('class', 'btn btn-success');
            newbutton.parent("stickbuttonCont");
            newbutton.mousePressed(() => {
                location.reload(); 
            });
        });
    }
}


class Grid {

    constructor(boardLength) {

        this.gridLength = boardLength;
        this.gridState = new Array(boardLength);
        for(let i = 0; i < this.gridLength; ++i) {
            this.gridState[i] = new Array(boardLength);
            for(let j=0;j< this.gridLength;++j) {
                this.gridState[i][j] = getRandomInt(2);
            }
        }
    }

    changecolor(index1,index2) {
        this.gridState[index1][index2] = 1 - this.gridState[index1][index2];
    }

    initGuessGrid() {
        for(let i = 0; i < this.gridLength; ++i) {
            for(let j=0;j< this.gridLength;++j) {
                this.gridState[i][j] = -1;
            }
        }
    }

}

class Stick {

    constructor(stickLen) {
        this.stickLength = stickLen;
        this.stickState = new Array(stickLen);
        for(let i = 0; i < stickLen; ++i) {
            this.stickState[i] = getRandomInt(2);
        }
        this.stickMatch = [];
    }

    changecolor(index) {
        this.stickState[index] = 1 - this.stickState[index];
    }
}


class Game {

    constructor(properties) {
        this.numberOfSticks = properties.numberOfSticks;
        this.gridSize = properties.gridSize;
        this.gameOver = false;
        this.currentStickNumber = 0;
        this.minstickLen = 0;

        this.player1 = properties.player1;
        this.player2 = properties.player2;

        this.grid = new Grid(this.gridSize);
        this.Sticks = new Array(0);
    }

}
