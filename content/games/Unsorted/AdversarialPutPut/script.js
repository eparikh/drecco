class Ball {

    constructor(x, y, radius, dx, dy, i){
        this.radius = radius;
        this.x = x;
        this.y = y;

        this.dx = dx;
        this.dy = dy;

        // mass is that of a sphere as opposed to circle
        // it *does* make a difference in how realistic it looks
        this.mass = this.radius * this.radius * this.radius;
        this.color = pickColor(i);
    };

    draw() {
        ctx.beginPath();
        ctx.arc(Math.round(this.x), Math.round(this.y), this.radius, 0, 2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.stroke();
        ctx.closePath();
    };

    speed() {
        // magnitude of velocity vector
        return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    };
    angle() {
        // velocity's angle with the x axis
        return Math.atan2(this.dy, this.dx);
    };
    onGround() {
        return (this.y + this.radius >= height)
    };
};

function setup() {
    width = document.getElementById('game-container').offsetWidth - 100;
    containerHeight = window.innerHeight;
    height = width * 3 / 4 - width / 6;
    canvas = createCanvas(width, Math.max(height, containerHeight * 3 / 4)); // ~4:3 aspect ratio
    canvas.parent('game-container');
    ctx = drawingContext

    button = createButton('Submit move');
    button.position(width - 150, height - 50);
    button.parent('game-container');
    button.attribute('class', 'btn btn-success')
    button.mousePressed(nextTurn);

    let col = color(0,0,0,0);

    if (done == false){
    input_box_1 = createInput('Velocity (Max 30)');
    input_box_1.position(width - 150, height - 90);
    input_box_1.style('background-color', col)
    input_box_1.parent('game-container');

    input_box_2 = createInput('Angle (Degrees)');
    input_box_2.position(width - 150, height - 130);
    input_box_2.style('background-color', col);
    input_box_2.parent('game-container');
    }
    // spawn the initial small thingies.
    for (i = 0; i<numStartingSmallBalls; i++) {
        objArray[objArray.length] = new Ball(40, Math.round(height/2) + 10*(1 - i) - 10*(i), randomRadius(), 12*0, 12*0, i);
    }

    for(i = 0; i<objArray.length; i++){
        // console.log(objArray[i]);
    }


	hole_x = width - 40;
	hole_y = Math.round(height/2); 
    // manually spawn the few large ones that
    // start with no velocity. (lazy code)
    w = int(height/10);
    displacement = w/2 + w;
    var i_temp = 0;
    var x_temp = displacement;
    while(x_temp <= width - displacement){
	    wall_x[i_temp] = x_temp;
	    x_temp += w;
	    i_temp++;
    }
    i_temp = 0;
    var y_temp = displacement;
    while(y_temp <= height - displacement){
	    wall_y[i_temp] = y_temp;
	    y_temp += w;
	    i_temp++;
    }

    /*
       for(var i = 0; i < 10; i++){
       wall_x[i] = displacement + i*w;
       wall_y[i] = displacement + i*w;
       }

       for(var i = 0; i < 100; i++){
       col[i] = false;
       }
       */ 

    for(var j = 0; j < wall_y.length; j++){
	    for(var i = 0; i < wall_x.length; i++){
		    col[j*wall_x.length + i] = false;
	    }
    }

    draw();
}

var canvas;
var inGame = false;
var done = false;
var winner = "";
var turn = 0;
var game;
var message = '';
var numberTextSize = 24;
var ctx;
var numTurns;
var curr_turns = 0;
var curr_barriers = 0;
var numBarriers = 0
var wall_x = [];
var wall_y = [];
var col = [];
var w = 70;
var displacement = 0;
var blocks_set = false;
var hole_x = 0;
var hole_y = 0; 
var objArray = [];
var paused = false;

var gravityOn = true;

var clearCanv = true;


var lastTime = (new Date()).getTime();
var currentTime = 0;
var dt = 0;

var numStartingSmallBalls = 2;
var numStartingBigBalls = 0;

function clearCanvas() {
    ctx.clearRect(0, 0, width, height);
}

function draw_hole(){
      ctx.beginPath();
      ctx.arc(hole_x, hole_y, 10, 0, 2*Math.PI);
      ctx.fillStyle = "rgb(128,128,128)";
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.stroke();
      ctx.closePath();
}

function draw_arrow(){
	if(objArray[0].speed() != 0 || objArray[1].speed() != 0) return;

	x_loc = objArray[0].x
	y_loc = objArray[0].y
    	
	degree_str = input_box_2.value();
    	input_box_2.value(degree_str);
    	if(isNaN(degree_str)){
        	degree = 0;
    	} else {
        	degree =-1* parseInt(degree_str);
    	}
    	degree = degree%360;
	
	if(turn == 1){
		x_loc = objArray[1].x;
		y_loc = objArray[1].y;	
	}

	target_x_loc = x_loc + 10*Math.cos(2*Math.PI*(degree/360));	
	
	target_y_loc = y_loc + 10*Math.sin(2*Math.PI*(degree/360));	

	line(x_loc, y_loc, target_x_loc, target_y_loc);	

	push();
	translate(target_x_loc, target_y_loc);
	angleMode(RADIANS);
	offset = 7;
	rotate(2*Math.PI*(degree/360) + Math.PI/2);
	triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2);
	pop();
}


function canvasBackground() {
    canvas.background(152,251,152);
}

function wallCollision(ball) {
    if (ball.x - ball.radius + ball.dx < 0 ||
        ball.x + ball.radius + ball.dx > width) {
        ball.dx *= -1;
    }
    if (ball.y - ball.radius + ball.dy < 0 ||
        ball.y + ball.radius + ball.dy > height) {
        ball.dy *= -1;
    }
    if (ball.y + ball.radius > height) {
        ball.y = height - ball.radius;
    }
    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
    }
    if (ball.x + ball.radius > width) {
        ball.x = width - ball.radius;
    }
    if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
    }
}

function barrierCollision(ball){ 
	// console.log("computing barrier collision")
	for(var j = 0; j < wall_y.length; j++){
		for(var i = 0; i < wall_x.length; i++){
			// console.log(col[j*wall_x.length + i]);
			if (col[j*wall_x.length + i]){
				barrier_width = w/2;
				if(((wall_x[i] - w/2 < ball.x - ball.radius + ball.dx*dt && ball.x - ball.radius + ball.dx*dt < wall_x[i] + w/2)||
				(wall_x[i] - w/2 < ball.x + ball.radius + ball.dx*dt &&  ball.x + ball.radius + ball.dx*dt < wall_x[i] + w/2))&&(
				(wall_y[j] - w/2 < ball.y - ball.radius + ball.dy*dt && ball.y - ball.radius + ball.dy*dt < wall_y[j] + w/2)||
				(wall_y[j] - w/2 < ball.y + ball.radius + ball.dy*dt && ball.y + ball.radius + ball.dy*dt < wall_y[j] + w/2))){
					/*	
					console.log(wall_x[i]);
					console.log(wall_y[j]);
					console.log(ball.x);
					console.log(ball.y);
					console.log("target val:")
					console.log(ball.x - ball.radius + ball.dx*dt < wall_x[i] + w/2);
					console.log("-----------");
					paused = true;
					*/
					if(((wall_x[i] - w/2 < ball.x - ball.radius + ball.dx*dt && ball.x - ball.radius + ball.dx*dt < wall_x[i] + w/2)||
				(wall_x[i] - w/2 < ball.x + ball.radius + ball.dx*dt && ball.x + ball.radius + ball.dx*dt < wall_x[i] + w/2))&&(!(
				(wall_x[i] - w/2 < ball.x - ball.radius && ball.x - ball.radius < wall_x[i] + w/2)||
				(wall_x[i] - w/2 < ball.x + ball.radius && ball.x + ball.radius < wall_x[i] + w/2)))){
					// console.log("x collision");
					ball.dx *= -1;
					}
					if(((wall_y[j] - w/2 < ball.y - ball.radius + ball.dy*dt && ball.y - ball.radius + ball.dy*dt < wall_y[j] + w/2)||
				(wall_y[j] - w/2 < ball.y + ball.radius + ball.dy*dt && ball.y + ball.radius + ball.dy*dt < wall_y[j] + w/2))&&(!(
				(wall_y[j] - w/2 < ball.y - ball.radius && ball.y - ball.radius < wall_y[j] + w/2)||
				(wall_y[j] - w/2 < ball.y + ball.radius && ball.y + ball.radius < wall_y[j] + w/2)))){
					// console.log("y collision");
					ball.dy *= -1;
					}
				}	
			}		
		}
	}
}

function ballCollision() {
    for (let i=0; i<objArray.length-1; i++) {
        for (let j=i+1; j<objArray.length; j++) {
            let ob1 = objArray[i]
            let ob2 = objArray[j]
            let dist = distance(ob1, ob2)

            if (dist < ob1.radius + ob2.radius) {
                let theta1 = ob1.angle();
                let theta2 = ob2.angle();
                let phi = Math.atan2(ob2.y - ob1.y, ob2.x - ob1.x);
                let m1 = ob1.mass;
                let m2 = ob2.mass;
                let v1 = ob1.speed();
                let v2 = ob2.speed();

                let dx1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.cos(phi) + v1*Math.sin(theta1-phi) * Math.cos(phi+Math.PI/2);
                let dy1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.sin(phi) + v1*Math.sin(theta1-phi) * Math.sin(phi+Math.PI/2);
                let dx2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.cos(phi) + v2*Math.sin(theta2-phi) * Math.cos(phi+Math.PI/2);
                let dy2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.sin(phi) + v2*Math.sin(theta2-phi) * Math.sin(phi+Math.PI/2);

                ob1.dx = dx1F;
                ob1.dy = dy1F;
                ob2.dx = dx2F;
                ob2.dy = dy2F;

                staticCollision(ob1, ob2)

            }
        }
        wallCollision(objArray[i]);
    }

    if (objArray.length > 0)
        wallCollision(objArray[objArray.length-1])
}

function staticCollision(ob1, ob2, emergency=false)
{
    let overlap = ob1.radius + ob2.radius - distance(ob1, ob2);
    let smallerObject = ob1.radius < ob2.radius ? ob1 : ob2;
    let biggerObject = ob1.radius > ob2.radius ? ob1 : ob2;

    // When things go normally, this line does not execute.
    // "Emergency" is when staticCollision has run, but the collision
    // still hasn't been resolved. Which implies that one of the objects
    // is likely being jammed against a corner, so we must now move the OTHER one instead.
    // in other words: this line basically swaps the "little guy" role, because
    // the actual little guy can't be moved away due to being blocked by the wall.
    if (emergency) [smallerObject, biggerObject] = [biggerObject, smallerObject]

    let theta = Math.atan2((biggerObject.y - smallerObject.y), (biggerObject.x - smallerObject.x));
    smallerObject.x -= overlap * Math.cos(theta);
    smallerObject.y -= overlap * Math.sin(theta);

    if (distance(ob1, ob2) < ob1.radius + ob2.radius) {
        // we don't want to be stuck in an infinite emergency.
        // so if we have already run one emergency round; just ignore the problem.
        if (!emergency) staticCollision(ob1, ob2, true)
    }
}

function applyGravity() {
    for (let obj in objArray) {
        let ob = objArray[obj]

        // apply basic drag
        // console.log(ob.dx);
	// console.log(ob.dy);
	// if(abs(ob.dx) < 0.5) ob.dx = 0;
	// if(abs(ob.dy) < 0.5) ob.dy = 0;
	if(ob.speed() < 0.5){
		ob.dx = 0;
		ob.dy = 0;
	}
	ob.dx *= .9999
        ob.dy *= .9999
    }
}

function moveObjects() {
    for (let i=0; i<objArray.length; i++) {
        let ob = objArray[i];
        if(done == false && ball_in_hole(ob)){
          winner = i + 1;
          done = true;
          message = "Player " + winner + " wins!";
        }
	barrierCollision(ob);
        ob.x += ob.dx * dt;
        ob.y += ob.dy * dt;
    }
}

function ball_in_hole(ob){
    if (Math.abs(ob.x - hole_x) <= 5 && Math.abs(ob.y -  hole_y) <= 5){
      console.log("Ball in hole");
      return true;
    } else {
      return false;
    }
}

function drawObjects() {
    for (let obj in objArray) {
        objArray[obj].draw();
    }
}

function draw() {
    currentTime = (new Date()).getTime();
    // dt = (currentTime - lastTime) / 1000; // delta time in seconds
    dt = 1/30;

    if (clearCanv) clearCanvas();
    canvasBackground();
    // console.log("Before eval");
    if(inGame && (!blocks_set)){
        // console.log("inGame and no blocks set");
	rectMode(CENTER);
	stroke(0);
      drawObjects();
      draw_hole();
	for(var j = 0; j < wall_y.length; j++){
		for(var i = 0; i < wall_x.length; i++){
			if (col[j*wall_x.length + i]) fill("green");
			else fill("white");
			rect(wall_x[i], wall_y[j], w, w);		
		}
	}
    } else if(inGame && blocks_set){
      // console.log("inGame and blocks set");
      if (!paused) {
          if (gravityOn) {
              applyGravity(); // (and drag)
          }
          moveObjects();
          ballCollision();
      }

      set_blocks();
      drawObjects();
      draw_hole();
      drawMessage();
      draw_arrow();

    } else {
	// console.log("not inGame");
	// background(0);
	/*
        rectMode(CENTER);
	stroke(0);
	for(var j = 0; j < wall_y.length; j++){
		for(var i = 0; i < wall_x.length; i++){
			if (col[j*wall_x.length + i]) fill("green");
			else fill("white");
			rect(wall_x[i], wall_y[j], w, w);		
		}
	}
	*/
    }
    //logger();

    lastTime = currentTime;
    window.requestAnimationFrame(draw);
}

function logger() {
    // log stuff
}

    /*
     */
function startGame() {
    if(done == true){
	inGame = false;
	winner = "";
	turn = 0;
	message = '';
	numberTextSize = 24;
	curr_turns = 0;
	curr_barriers = 0;
	numBarriers = 0
	wall_x = [];
	wall_y = [];
	col = [];
	w = 70;
	displacement = 0;
	blocks_set = false;
	hole_x = 0;
	hole_y = 0; 
	objArray = [];
	paused = false;
	gravityOn = true;
	clearCanv = true;
	lastTime = (new Date()).getTime();
	currentTime = 0;
	dt = 0;
	numStartingSmallBalls = 2;
	setup();
	draw();
	done = false;
    }
    player1 = document.getElementById("player-1").value;
    player2 = document.getElementById("player-2").value;
    message = player1 + "'s turn";
    numBarriers = document.getElementById("number-of-barriers").value;
    if(numBarriers < 3) numBarriers = 3;
    numTurns = 2*document.getElementById("number-of-turns").value;

    inGame = true
}

function nextTurn() {
    //logic for next turn
    if(done == true){
      return;
    }
    
    if(!blocks_set){
	blocks_set = true;
	return;
    }
	
    if(objArray[0].speed() != 0 || objArray[1].speed() != 0) return;

    velocity_str = input_box_1.value();
    input_box_1.value('Velocity (Max 30)');
    if(isNaN(velocity_str)){
	 velocity = 3;
    } else {
	velocity = parseInt(velocity_str);
    }    
    velocity = velocity%31;

    degree_str = input_box_2.value();
    input_box_2.value('Angle (Degrees)');
    if(isNaN(degree_str)){
        degree = 0;
    } else {
        degree = -1*parseInt(degree_str);
    }
    degree = degree%360;

    objArray[turn].dx = velocity*Math.cos((degree/360)*2*Math.PI);
    objArray[turn].dy = velocity*Math.sin((degree/360)*2*Math.PI);

    if(turn == 0){
      turn = 1;
      message = player1 + "'s turn";
    } else {
      turn = 0;
      message = player2 + "'s turn";
    }
    curr_turns += 1;

    if(curr_turns == numTurns){
        done = true;
    }

}


function drawMessage() {
	if(curr_turns == numTurns && objArray[0].speed() == 0 && objArray[1].speed() == 0){
		dist1 = Math.sqrt((objArray[0].x - hole_x)**2 + (objArray[0].y - hole_y)**2);
		dist2 =  Math.sqrt((objArray[1].x - hole_x)**2 + (objArray[1].y - hole_y)**2); 
		// console.log("here");
		if(dist1 < dist2){
			message = player1 + " wins!";
		} else if(dist2 < dist1){
			message = player2 + " wins!"
		} else {
			message = "Tie!";
		}
		fill(0,0,0);
		stroke(0,0,0);
    		strokeWeight(1);
    		textSize(30);
    		textAlign(CENTER, CENTER);

    		text(message, width / 2, height / 2 - 50);
	} else {
		fill(0,0,0);
		stroke(0,0,0);
    		strokeWeight(1);
    		textSize(30);
    		textAlign(CENTER, CENTER);	
    		text(message, width / 2, height / 2 - 50);
	}
}

function randomColor() {
    let red = Math.floor(Math.random() * 3) * 127;
    let green = Math.floor(Math.random() * 3) * 127;
    let blue = Math.floor(Math.random() * 3) * 127;

    // dim down the small balls

    let rc = "rgb(" + red + ", " + green + ", " + blue + ")";
    return rc;
}

function pickColor(i){
  if(i == 0){
    return "#ff0000";
  } else if (i == 1) {
    return "#0000ff";
  } else {
    return randomColor();
  }
}

function randomX() {
    let x = Math.floor(Math.random() * width);
    if (x < 30) {
        x = 30;
    } else if (x + 30 > width) {
        x = width - 30;
    }
    return x;
}

function randomY() {
    let y = Math.floor(Math.random() * height);
    if (y < 30) {
        y = 30;
    } else if (y + 30 > height) {
        y = height - 30;
    }
    return y;
}

function randomRadius() {
        // let r = Math.ceil(Math.random() * 2 + 2);
        let r = 5;
        return r;
}

function randomDx() {
    let r = Math.floor(Math.random() * 10 - 4);
    return r;
}

function randomDy() {
    let r = Math.floor(Math.random() * 10 - 3);
    return r;
}

function distanceNextFrame(a, b) {
    return Math.sqrt((a.x + a.dx - b.x - b.dx)**2 + (a.y + a.dy - b.y - b.dy)**2) - a.radius - b.radius;
}

function distance(a, b) {
    // console.log(a.x - b.x);
    return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2);
}

function mousePressed(){
	console.log("here");
	if(blocks_set) return;
	// console.log(mouseX);
	// console.log(mouseY);
	for(var j = 0; j < wall_y.length; j++){
		for(var i = 0; i < wall_x.length; i++){
			var dis = dist(mouseX, mouseY, wall_x[i], wall_y[j]);
			if(dis<w/2){
				col[j*wall_x.length + i]=! col[j*wall_x.length + i];	
				if(col[j*wall_x.length + i] == true){
					if(curr_barriers < numBarriers){
						curr_barriers += 1;
					} else {
						col[j*wall_x.length + i]=! col[j*wall_x.length + i];	
					}
				} else {
					curr_barriers -= 1;
					console.assert(curr_barriers <= numBarriers);
				}
			}
		}
	}
}

function set_blocks(){
	rectMode(CENTER);
	stroke(0);
	for(var j = 0; j < wall_y.length; j++){
		for(var i = 0; i < wall_x.length; i++){
			if (col[j*wall_x.length + i]){
				fill("green");
				rect(wall_x[i], wall_y[j], w, w);
			}		
		}
	}
	
}
