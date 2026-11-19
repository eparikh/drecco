// Globals

var gunman1 = null;
var gunman1_pos = 0;
var gunman1rotation = 0;
var gunman2 = null;
var gunman2_pos = 0;
var gunman2rotation = 0;
var bullet1 = null;
var bullet2 = null;
var shoot1 = null;
var skip1 = null;
var shoot2 = null;
var skip2 = null;
var gameOverDialog = null;
var initscreen = null;
var gamescreen = null;
var moveDist = 0;
var init_distance = 100;
var probab_func = "linear";
var cur_player = 0;
var game;

function start_game() {
    console.log("start game")
    player1 = document.getElementById("player-1").value;
    player2 = document.getElementById("player-2").value;
    player1_is_AI = document.getElementById("player-1-AI").checked;
    player2_is_AI = document.getElementById("player-2-AI").checked;
    total_bullets = document.getElementById("number-of-bullets").value;
    total_jackets = document.getElementById("number-of-jackets").value;
    probab_func = document.getElementById("probab-func").value;

    game = new Game({
        player1: player1,
        player2: player2,
        player1_is_AI: player1_is_AI,
        player2_is_AI: player2_is_AI,
        total_bullets: total_bullets,
        total_jackets: total_jackets,
        time: 120
    });
    if (game.players[game.current_player].is_AI == true) {
        game.play_AI(game.current_player);
    }

    // set playernames in html
    document.querySelector(".playername-1").textContent = player1;
    document.querySelector(".playername-2").textContent = player2;
}

function newGame() {
    self.location = "iframe.html"
}

function shoot(player_num) {
    if (game.game_over)
        return false;
    var can_shoot = game.current_player==player_num; 
    if (can_shoot == true) {
        if (player_num == 0)
            my_jacket = document.getElementById("player1-wear-jacket").checked;
        else
            my_jacket = document.getElementById("player2-wear-jacket").checked;
        if (my_jacket == true) {
            if (game.players[player_num].wear_jacket() == false)
                return false;
        }
        game.play_round(true);
        updateValues();
        return true;
    }
    else {
        alert ("Player " + (player_num+1) + " cannot play turn.");  
        return false;
    }
}

function skip(player_num) {
    if (game.game_over)
        return false;
    var can_shoot = game.current_player==player_num;
    if (can_shoot == true) {
        if (player_num == 0)
            my_jacket = document.getElementById("player1-wear-jacket").checked;
        else
            my_jacket = document.getElementById("player2-wear-jacket").checked;
        if (my_jacket == true) {
            if (game.players[player_num].wear_jacket() == false)
                return false;
        }
        game.play_round(false);
        updateValues();
        return true;
    }
    else {
        alert ("Player " + (player_num+1) + " cannot play turn.");  
        return false;
    }
}

function shoot_with_probability(probab) {
    console.log("hit with probability:", probab);  
    var rnd = Math.random();
    if (rnd<probab) return true;
    else return false;
}

function linear_probab(distance) {
    return Math.round((110-distance)/110 * 100) / 100; // TODO: change function ?
}

function quadratic_probab(distance) {
    return Math.round(Math.pow(110-distance, 2)/12100 * 100) /100; // TODO: change function ?
}

class Player {
    constructor(id, name, is_AI, bullets_left, jackets_left, time_left, position) {
        this.id = id; // 0-indexed
        this.name = name;
        this.is_AI = is_AI;
        this.time_left = time_left;
        this.bullets_left = bullets_left;
        this.jackets_left = jackets_left;
        this.wearing_jacket = false;
        this.alive = true;
        this.score = 0;
        this.position = position;
        this.can_shoot = false;
        this.hit_probab = linear_probab(init_distance);
        if (probab_func == "quadratic") {
            this.hit_probab = quadratic_probab(init_distance);
        }
    }
    get_hit_probab(p2, func=probab_func) {
        var distance = Math.abs(this.position-p2.position);
        var hit_probab = 0;
        var opp_jacket = p2.wearing_jacket;
        if (func=="linear") {
            hit_probab = linear_probab(distance); 
        }
        if (func=="quadratic") {
            hit_probab = quadratic_probab(distance); 
        }
        if (opp_jacket) {
            hit_probab = 0;
        }
        return hit_probab;
    }
    move_forward() {
        if (this.position > 0) {
            this.position = this.position - 5;
        }
        else {
            this.position = this.position + 5;
        }
    }
    wear_jacket() {
        if (this.jackets_left == 0) {
            alert (this.name + " has no jackets left.");  
            return false;
        }
        this.wearing_jacket = true;
        this.jackets_left = this.jackets_left-1;
        if (this.jackets_left == 0) {
            this.wearing_jacket = false;
            updateJacketCheckbox(this.id);
        }
        return true;
    }
    take_off_jacket() {
        this.wearing_jacket = false;
        updateJacketUI(this.id);
    }
}

class Game {
    constructor(properties) {
        this.total_bullets = properties.total_bullets;
        this.total_jackets = properties.total_jackets;
        this.total_time = properties.time;
        this.game_over = false;
        this.current_player = 0;

        this.players = new Array(2);
        this.players[0] = new Player(0, properties.player1, properties.player1_is_AI, this.total_bullets, this.total_jackets, this.total_time, -1 * init_distance/2);
        this.players[1] = new Player(1, properties.player2, properties.player2_is_AI, this.total_bullets, this.total_jackets, this.total_time, init_distance/2);
        this.players[this.current_player].can_shoot = true;
        this.distance = 100;

        document.getElementById("player2-shoot").disabled = true;
        document.getElementById("player2-skip").disabled = true;
        document.getElementById("player2-wear-jacket").disabled = true;
        document.getElementById("jacket-2-text").style.color = "grey";
        if (this.players[0].is_AI == true) {
            document.getElementById("player1-shoot").disabled = true;
            document.getElementById("player1-skip").disabled = true;
            document.getElementById("player1-wear-jacket").disabled = true;
            document.getElementById("jacket-1-text").style.color = "grey";
        }
    }

    get_winner() {
        if (this.players[0].alive == false) {
            return this.players[1].name;
        }
        if (this.players[1].alive == false) {
            return this.players[0].name;
        }
        if (this.players[0].bullets_left == 0) {
            return this.players[1].name;
        }
        if (this.players[1].bullets_left == 0) {
            return this.players[0].name;
        }
    }

    get_score() {
        var distance = Math.abs(this.players[0].position-this.players[1].position);
        var score = distance/this.total_bullets;
        if (this.players[0].alive) {
            this.players[0].score = score;
        }
        else {
            if (this.players[1].alive) {
                this.players[1].score = score;
            }
        }
        return Math.round(score * 100)/100; 
    }

    is_game_over() {
        document.getElementById("score-value").innerHTML = this.get_score();
        document.getElementById("winner-value").innerHTML = this.get_winner();
        this.game_over = !this.players[0].alive || !this.players[1].alive;
        if (this.game_over) {
            return true;
        }
        this.game_over = this.players[0].bullets_left == 0 || this.players[1].bullets_left == 0;
        if (this.game_over) {
            document.getElementById("bullets-over-text").style.visibility = "visible";
        }
        return this.game_over;
    }

    async play_AI() {
        if (this.players[this.current_player].is_AI == false)
            return;
        if (shoot_with_probability(0.5)) { // 50-50 chance of shooting/skipping by AI
            if (this.current_player == 0) {
                await sleep(1000);
                await shootBullet1();
            } else {
                await sleep(1000);
                await shootBullet2();
            }
        }
        else {
            if (this.current_player == 0) {
                await sleep(1000);
                await skipfunc1();
            } else {
                await sleep(1000);
                await skipfunc2();
            }
        }
    }

    update_round() {
        game.players[this.current_player].move_forward();
        this.distance = Math.abs(game.players[0].position - game.players[1].position);
        game.players[this.current_player].hit_probab = game.players[this.current_player].get_hit_probab(game.players[1-this.current_player]);
        game.players[1-this.current_player].hit_probab = game.players[1-this.current_player].get_hit_probab(game.players[this.current_player]);
    }

    play_round(shoot) {
        console.log("Player: ", this.current_player, " is playing.");
        updateButtons(this.current_player);
        this.players[this.current_player].can_shoot = false;
        this.players[1 - this.current_player].can_shoot = true;
        var hit_probab = game.players[this.current_player].hit_probab;
        if (shoot == true) {
            var my_jacket = game.players[this.current_player].wearing_jacket;
            var opp_jacket = game.players[1 - this.current_player].wearing_jacket;
            game.players[this.current_player].bullets_left = game.players[this.current_player].bullets_left - 1;
            this.current_player = 1 - this.current_player;
            var hit = shoot_with_probability(hit_probab);
            console.log("hit?", hit);   ///
            if (hit == true) {
                this.players[this.current_player].alive = false;
                this.game_over = true;
                gameOver(); 
            } else {
                this.update_round();
                this.play_AI();
            }
        } else {
            this.update_round();
            this.current_player = 1 - this.current_player;
            this.play_AI();
        }
    }
}




function init() {
    console.log("init called");

    initscreen = document.querySelector(".initdiv")
    gamescreen = document.querySelector(".gamediv")

    initscreen.style.display = "none";
    gamescreen.style.display = "block";

    moveDist = 3;

    gunman1 = document.querySelector(".gunman-1");
    gunman2 = document.querySelector(".gunman-2");
    bullet1 = document.querySelector(".bullet-1");
    bullet2 = document.querySelector(".bullet-2");
    shoot1 = document.querySelector(".shoot-1")
    skip1 = document.querySelector(".skip-1")
    shoot2 = document.querySelector(".shoot-2")
    skip2 = document.querySelector(".skip-2")
    p1jacket = document.querySelector(".p1-jacket")
    p2jacket = document.querySelector(".p2-jacket")
    gameOverDialog = document.querySelector(".gameover")

    if (gunman1rotation != 0) {
        gunman1.style.transform = "rotate(" + (-gunman1rotation) + "deg)";
    }
    if (gunman2rotation != 0) {
        gunman2.style.transform = "rotate(" + (-gunman2rotation) + "deg)";
    }

    gunman1rotation = 0;
    gunman2rotation = 0;

    gunman1_pos = 10;
    gunman2_pos = 10;

    start_game();
    updateValues();
    
    shoot1.addEventListener("click", async () => {
        await shootBullet1(bullet1, gunman1_pos, gunman2_pos);
        game.players[1].take_off_jacket();
    })
    
    skip1.addEventListener("click", () => {
        skipfunc1();
        game.players[1].take_off_jacket();
    })
    
    shoot2.addEventListener("click", async () => {
        await shootBullet2(bullet2, gunman2_pos, gunman1_pos);
        game.players[0].take_off_jacket();
    })
    
    skip2.addEventListener("click", () => {
        skipfunc2();
        game.players[0].take_off_jacket();
    })
}

advanceGunman1 = async () => {
    var newDist = gunman1_pos + moveDist;
    while (gunman1_pos < newDist) {
        gunman1_pos+=0.2;
        gunman1.style.left = gunman1_pos + "%";
        p1jacket.style.left = (gunman1_pos + 1.5) + "%";
        await sleep(10);
    }
    if (game.players[0].wearing_jacket) {
        p1jacket.style.left = (gunman1_pos + 1.5) + "%"
    }
}

advanceGunman2 = async () => {
    var newDist = gunman2_pos + moveDist;
    while (gunman2_pos < newDist) {
        gunman2_pos+=0.2;
        gunman2.style.right = gunman2_pos + "%";
        p2jacket.style.right = (gunman2_pos + 1.5) + "%";
        await sleep(10);
    }
    if (game.players[1].wearing_jacket) {
        p2jacket.style.right = (gunman2_pos + 1.5) + "%"
    }
}

skipfunc1 = () => {
    if (skip(0))
        advanceGunman1();
}

 skipfunc2 = () => {
    if (skip(1))
        advanceGunman2();
 }

shootBullet1 = async () => {
    bullet1.style.opacity = 1;
    bullet1.style.left = (gunman1_pos + 10) + "%";

    if (shoot(0)) {
        kill = false;
        if (game.game_over) {
            kill = true;
        }

        bulletPos = parseInt(bullet1.style.left.slice(0,-1));
        pos = bulletPos;
        while(bulletPos < 100) {
            if (kill && bulletPos == (100 - gunman2_pos - 8)) {
                break;
            }
            await sleep(5);
            pos += 1;
            bullet1.style.left = pos + "%";
            bulletPos = parseInt(bullet1.style.left.slice(0,-1));
        }
        bullet1.style.opacity = 0;

        if (kill) {
            if (!game.players[1].alive) {
                killGunman2();
            } else {
                killGunman1();
            }
            gameOver();
        } else {
            advanceGunman1();
        }
    }
}

shootBullet2 = async () => {
    bullet2.style.opacity = 1;
    bullet2.style.right = (gunman2_pos + 10) + "%";

    if (shoot(1)) {
        kill = false;
        if (game.game_over) {
            kill = true;
        }

        bulletPos = parseInt(bullet2.style.right.slice(0,-1))
        pos = bulletPos;
        while(bulletPos < 100) {
            if (kill && bulletPos == (100 - gunman1_pos - 8)) {
                break;
            }
            await sleep(5);
            pos += 1;
            bullet2.style.right = pos + "%";
            bulletPos = parseInt(bullet2.style.right.slice(0,-1))
        }
        bullet2.style.opacity = 0;

        if (kill) {
            if (!game.players[0].alive) {
                killGunman1();
            } else {
                killGunman2();
            }
            gameOver();
        } else {
            advanceGunman2();
        }
    }
}

killGunman1 = () => {
    gunman1.style.transform = "rotate(-110deg)";
    gunman1rotation = -110;
}

killGunman2 = () => {
    gunman2.style.transform = "rotate(110deg)";
    gunman2rotation = 110;
}

gameOver = () => {
    gameOverDialog.show();
}

updateValues = () => {
    var game_over = game.is_game_over();
    document.getElementById("p1bullets").innerHTML = game.players[0].bullets_left;
    document.getElementById("p1jackets").innerHTML = game.players[0].jackets_left;
    document.getElementById("p2bullets").innerHTML = game.players[1].bullets_left;
    document.getElementById("p2jackets").innerHTML = game.players[1].jackets_left;
    if (game_over == false) {
        document.getElementById("p1hit").innerHTML = Math.round(game.players[0].hit_probab * 100) + "%";
        document.getElementById("p2hit").innerHTML = Math.round(game.players[1].hit_probab * 100) + "%";
        document.getElementById("distance").innerHTML = game.distance;
    }
}

updateButtons = (cur_player) => {
    if (cur_player == 0) {
        document.getElementById("player1-shoot").disabled = true;
        document.getElementById("player1-skip").disabled = true;
        document.getElementById("player1-wear-jacket").checked = false;
        document.getElementById("player1-wear-jacket").disabled = true;
        document.getElementById("jacket-1-text").style.color = "grey";
        if (game.players[1].is_AI == false) {
            document.getElementById("player2-shoot").disabled = false;
            document.getElementById("player2-skip").disabled = false;
            if (game.players[1].jackets_left != 0) {
                document.getElementById("player2-wear-jacket").checked = false;
                document.getElementById("player2-wear-jacket").disabled = false;
                document.getElementById("jacket-2-text").style.color = "black";
            }
        }
    } 
    else {
        if (game.players[0].is_AI == false) {
            document.getElementById("player1-shoot").disabled = false;
            document.getElementById("player1-skip").disabled = false;
            if (game.players[0].jackets_left != 0) {
                document.getElementById("player1-wear-jacket").checked = false;
                document.getElementById("player1-wear-jacket").disabled = false;
                document.getElementById("jacket-1-text").style.color = "black";
            }
        }
        document.getElementById("player2-shoot").disabled = true;
        document.getElementById("player2-skip").disabled = true;
        document.getElementById("player2-wear-jacket").checked = false;
        document.getElementById("player2-wear-jacket").disabled = true;
        document.getElementById("jacket-2-text").style.color = "grey";
    }
}

updateJacketCheckbox = (player) => {
    if (player == 0) {
        document.getElementById("player1-wear-jacket").checked = false;
        document.getElementById("player1-wear-jacket").disabled = true;
        document.getElementById("jacket-1-text").style.color = "grey";
    } else {
        document.getElementById("player2-wear-jacket").checked = false;
        document.getElementById("player2-wear-jacket").disabled = true;
        document.getElementById("jacket-2-text").style.color = "grey";
    }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

updateJacketUI = (player_num) => {
    // if (!game.players[0].wearing_jacket) {
    if (player_num == 0) {
        p1jacket.style.opacity = 0;
    }
    // if (!game.players[1].wearing_jacket) {
    if (player_num == 1) {
        p2jacket.style.opacity = 0;
    }
}

checkJacket1 = () => {
    box = document.getElementById("player1-wear-jacket");
    
    if (box.checked && game.players[0].jackets_left) {
        p1jacket.style.left = (gunman1_pos + 1.5) + "%";
        p1jacket.style.opacity = 1;
        game.players[0].wearing_jacket = true;
        console.log("jacket 1 on")
    } else {
        p1jacket.style.opacity = 0; 
    }
    updateValues();
}

checkJacket2 = () => {
    box = document.getElementById("player2-wear-jacket");
    
    if (box.checked && game.players[1].jackets_left) {
        p2jacket.style.right = (gunman2_pos + 1.5) + "%";
        p2jacket.style.opacity = 1;
        game.players[1].wearing_jacket = true;
    } else {
        p2jacket.style.opacity = 0;
    }
    updateValues();
}