/* GLOBAL VARIABLES */
var image_normal = new Image();
image_normal.src = "person.png";
var image_highlight = new Image();
image_highlight.src = "person_highlight.png";
// sprites are 21px by 32px (make all cells min of 16x16)
var terrain = new Image();
terrain.src = "dropzone.png";

var index_positions;
var survivors;
var sprites;
var inside_dropzone;
var resources_acquired;

var background_ctx, numbers_ctx, people_ctx, mouse_ctx, ctx;

var sliderval;
var slider;
var slider_radius;
var gridsize;

var canvasPos;

var game_active = 0;
var slider_keypress = 0;

var update;
var first_draw = 1;
var removePerson = 0;

var num_supplies;
var num_survivors;
var players = [];
var player_turn;


var ai_flag = 0;
var ai_people;
/////////////////////

/* Objects */
function Player(name, isAI) {
	this.name = name;
	this.isAI = isAI;
	this.score = 0;
}

function Person(x, y, resources, pid) {
	var self = this;
	this.x = x;
	this.y = y;
	this.resources = resources;
	this.pid = pid;
	this.highlight = 0;
	this.isActive = false;
	this.isVisible = true;
}

//////////////

/* UTILITY FUNCTIONS */
function initParams() {
	players = [];
	resetParams();

	// first player
	var p1 = $('#player1-name').val();
	var name = p1 == '' ? "Player1" : p1; 
	var player1 = new Player(name, false);
	players.push(player1);

	// second player
	if ($('#game-mode').val() == "robot") {
		player2 = new Player("Robot", true);
	} else {
		var p2 = $('#player2-name').val();
		var name = p2 == '' ? "Player2" : p2; 
		var player2 = new Player(name, false);
	}

	players.push(player2);

	var supplies = $('#num-supplies').val();
	num_supplies = supplies == '' ? 30 : parseInt(supplies);

	var survivors = $('#num-survivors').val();
	num_survivors = survivors == '' ? 50 : parseInt(survivors);

	// update html fields
	$("#player1-display").append(player1.name);
	$("#player2-display").append(player2.name);

	$("#player-turn").append(player1.name);
	$("#player-turn").addClass("label label-info");
	$("#num-supplies-display").append(num_supplies);
	$("#num-supplies-display").addClass("label label-info");
	$("#num-survivors-display").append(num_survivors);	
	$("#num-survivors-display").addClass("label label-info");

}


function resetParams() {

	$("#player1-display").empty();
	$("#player2-display").empty();
	$("#player1-score").text(0);
	$("#player2-score").text(0);

	$("#player-turn").empty();
	$("#player-turn").removeClass("label label-info");
	$("#num-supplies-display").empty();
	$("#num-supplies-display").removeClass("label label-info");
	$("#num-survivors-display").empty();
	$("#num-survivors-display").removeClass("label label-info");
}

function resetSameGame() {
	$("#player1-score").text(0);
	$("#player2-score").text(0);
	players[0].score = 0;
	players[1].score = 0;

	player_turn = 0;
	$("#player-turn").text(players[player_turn].name);

	sprites = JSON.parse(JSON.stringify( survivors ));
	// console.log(survivors);
	first_draw = 1;
	update();
	first_draw = 0;
	game_active = 1;
}


function uniCharCode(event) {
	if (slider_keypress == 1) {
		var char = event.which || event.keyCode;
		if (char == 119) {
			if (parseInt(sliderval.innerHTML) < 50) {
				var temp_val = parseInt(sliderval.innerHTML) + 1;
				slider_radius = Math.round((temp_val * gridsize)/5);
				sliderval.innerHTML = temp_val;
				slider.value = temp_val;
				update();
			}
		}
		else if (char == 115) {
			if (parseInt(sliderval.innerHTML) > 10) {
				var temp_val = parseInt(sliderval.innerHTML) - 1;
				slider_radius = Math.round((temp_val * gridsize)/5);
				sliderval.innerHTML = temp_val;
				slider.value = temp_val;
				update();
			}
		}
	}
}

function sliderSwitch(value) {
	slider_keypress = value;
}

function remove(array, element) {
  const index = array.indexOf(element);

  if (index !== -1) {
    array.splice(index, 1);
  }
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function generateSurvivors(splits, numSurvivors) {
	index_positions = [];
	survivors = [];
	sprites = [];

	for (var x=1; x<splits-2; x++) {
		for (var y=1; y<splits; y++) {
			index_positions.push([x,y]);
		}
	}
	// console.log(index_positions);

	var open_indices = index_positions.slice();

	for (var id=0; id<numSurvivors; id++) {
		var good_position = false;
		var survivor_resources = Math.floor(Math.random() * 40) + 20;
		while (good_position == false) {
			var good_candidate = true;
			var rand = open_indices[Math.floor(Math.random() * open_indices.length)];
			for (i = 0; i < survivors.length; i++) {
		    	other_survivor = survivors[i];
		    	dist_between_survivors = distance(rand[0], rand[1], other_survivor[0], other_survivor[1]);
		    	if (dist_between_survivors < 4) {
		    		good_candidate = false;
		    		remove(open_indices, rand);
		    		break;
		    	}
		    }
		    if (good_candidate == true) {
		    	good_position = true;
		    }
		}
		survivor = rand.slice();
		survivor.push(survivor_resources);
		// console.log(survivor);
		survivors.push(survivor);
		sprites.push(new Person(survivor[0], survivor[1], survivor[2], id))
		remove(open_indices, rand);
	}

	survivors = JSON.parse(JSON.stringify( sprites ));
	// console.log(survivors);
}



/////////////////////

/* MAIN */
$(document).ready(function(){

	// console.log(($("#canvasParent").outerWidth()));
	// console.log(($("#canvasParent").outerHeight()));

    gridsize = 16;
    var splits = 50;
    var total_length = 800;

    var c = document.getElementById("canvas_background");
    background_ctx = c.getContext("2d");

    var c_numbers = document.getElementById("canvas_numbers");
    numbers_ctx = c_numbers.getContext("2d");

    var c_people = document.getElementById("canvas_people");
    people_ctx = c_people.getContext("2d");

    var c_mouse = document.getElementById("canvas_mouse");
    mouse_ctx = c_mouse.getContext("2d");

    var mouseX = 0;
	var mouseY = 0;
	 
	window.addEventListener("mousemove", setMousePosition);
	document.getElementById("canvas_mouse").addEventListener("click", mouse_clicked);

	slider_radius = Math.round((30*gridsize)/5);
	slider = document.getElementById("airdropRadius")
	sliderval = document.getElementById("slidervalue")
	slider.oninput = function() {
    	slider_radius = Math.round((this.value * gridsize)/5);
    	sliderval.innerHTML = this.value;
	}
	 
	function setMousePosition(e) {
		if (game_active == 1) {
	  		var rect = c.getBoundingClientRect();
		 	mouseX = e.clientX - rect.x;
		  	mouseY = e.clientY - rect.y;
	  		update();
		}
	}

	function mouse_clicked(e) {
		console.log(ai_flag);
		if (ai_flag == 0) {
			selectedDropzone();
		}
	}

	function selectedDropzone(ai=false, inside=null) {
		console.log('select dropzone at ' + mouseX + ',' + mouseY );
		console.log(inside_dropzone);
		if (inside != null) {
			inside_dropzone = inside;
		}
		if (ai || game_active == 1) {
			// console.log('dropping');
			removePerson = 0;
			var people_to_remove = [];
			for(var idx=0; idx<inside_dropzone.length; idx++) {
				var amount = Math.max(sprites[inside_dropzone[idx]].resources - resources_acquired, 0);
				sprites[inside_dropzone[idx]].resources = amount;
				if (amount == 0) {
					people_to_remove.push(sprites[inside_dropzone[idx]]);
					removePerson = 1;
					players[player_turn].score += 1;
				}
			}
			if (removePerson == 1) {
				for (var idx=0; idx<people_to_remove.length; idx++) {
					remove(sprites, people_to_remove[idx]);
				}
				if (player_turn == 0) {
					$("#player1-score").text(players[player_turn].score);
				} else {
					$("#player2-score").text(players[player_turn].score);
				}
				first_draw = 1;
				update(ai);
				first_draw = 0;
			} else {
				update(ai);
			}
			player_turn = 1 - player_turn;
			$("#player-turn").text(players[player_turn].name);

			if (sprites.length == 0) {
				var message;
				if (players[0].score > players[1].score) {
					message = players[0].name + ' wins!';
				} else if (players[0].score < players[1].score) {
					message = players[1].name + ' wins!';
				} else {
					message = 'It\'s a tie!';
				}
				mouse_ctx.clearRect(0, 0, c.width, c.height);
				mouse_ctx.globalAlpha = 0.3;
				mouse_ctx.fillStyle = 'black';
				mouse_ctx.fillRect(0, 0, c.width, c.height);
				mouse_ctx.globalAlpha = 1;
				mouse_ctx.font = "40px Courier";
		    	mouse_ctx.strokeStyle = 'black';
		    	mouse_ctx.fillStyle = 'white';
				mouse_ctx.lineWidth = 5;
				var offset = (800 - mouse_ctx.measureText(message).width)/2;
				mouse_ctx.strokeText(message, offset, 400);
				mouse_ctx.fillText(message, offset, 400);

				game_active = 0;
				$("#instruction").text("Click Start Game to begin the game.");
			} else {
				// console.log(survivors);
				if (players[player_turn].isAI) {
					AIResponse();
				}
			}
		}
	}

	function AIdraw() {
		console.log(mouseX + ',' + mouseY);
		
		var ai_inside = drawSurvivors();
		console.log(ai_inside);

		// console.log(mouseX + ',' + mouseY);

		mouse_ctx.clearRect(0, 0, c.width, c.height);
		mouse_ctx.lineWidth = 3;
    	mouse_ctx.strokeStyle = "#0077B5";
		mouse_ctx.beginPath();
		mouse_ctx.arc(mouseX, mouseY, slider_radius, 0, 2 * Math.PI, true);
		mouse_ctx.stroke();
		return ai_inside;
	}

	function activateGame() {
		selectedDropzone(ai=true, inside=ai_people);
		game_active = 1;
		ai_flag = 0;
		var playerRadius = parseInt(sliderval.innerHTML);
		slider_radius = Math.round((playerRadius * gridsize)/5);
	}

	function AIResponse() {
		// AI turn should disable mouse move 
		// earlier turns- maximize radius to minimize chance of fulfilling supplies first
		// later turns- small, targeted radius to fulfill last drop
		game_active = 0;
		ai_flag = 1;


		var r;
		if (sprites.length < num_survivors * 0.8) {
			r = Math.round((20 * gridsize)/5); 
		} else {
			r = Math.round((50 * gridsize)/5);
		}
		
		
		// random number between 0+r/2 and 800-r/2
		//var lowerBound = r / 2;
		//var upperBound = 800 - r / 2;
		//var randX = Math.floor(Math.random() * (upperBound-lowerBound)) + lowerBound;
		//var randY = Math.floor(Math.random() * (upperBound-lowerBound)) + lowerBound;
		var randNum = Math.floor(Math.random()*sprites.length);	
		var randSprite = sprites[randNum];

		//mouseX = randX;
		//mouseY = randY;
		mouseX = randSprite.x * gridsize;
		mouseY = randSprite.y * gridsize;
		slider_radius = r;


		// draw the circle to simulate robot turn
		ai_people = AIdraw();
		setTimeout(activateGame, 3000);
	}

    function drawSurvivors() {
    	offscreen_canvas = document.createElement('canvas');
		offscreen_canvas.width = c_people.width;
		offscreen_canvas.height = c_people.height;
    	ctx = offscreen_canvas.getContext("2d");

    	offscreen_canvas_2 = document.createElement('canvas');
		offscreen_canvas_2.width = c_people.width;
		offscreen_canvas_2.height = c_people.height;
    	var num_ctx = offscreen_canvas_2.getContext("2d");

    	num_ctx.font = "19px Courier";
    	num_ctx.strokeStyle = 'black';
		num_ctx.lineWidth = 4;
		// ctx.strokeText(text, x, y);
		// ctx.fillStyle = 'white';
		// ctx.fillText(text, x, y);

		inside_dropzone = [];

		if (first_draw == 1) {
			people_ctx.clearRect(0, 0, c_numbers.width, c_numbers.height);
		}
 
		for (var id=0; id<sprites.length; id++) {
			if (distance(sprites[id].x * gridsize, sprites[id].y * gridsize, mouseX, mouseY) <= slider_radius) {
				inside_dropzone.push(id);

				if (first_draw == 1) {
					ctx.drawImage(image_highlight, sprites[id].x*gridsize - 10, sprites[id].y*gridsize - 16);
					sprites[id].highlight = 1;
			    	// console.log('drew highlight');
				}

				if (sprites[id].highlight == 0) {
			    	ctx.drawImage(image_highlight, sprites[id].x*gridsize - 10, sprites[id].y*gridsize - 16);
			    	sprites[id].highlight = 1;
			    	// console.log('drew highlight');
			    }
			  //   	ctx.fillStyle = "white";
				// ctx.fillRect(sprites[id].x*gridsize+10, sprites[id].y*gridsize-12, 24, 24);
				

				// if (!sprites[id].isActive) {
					// console.log("not active on mouse move");
				// 	sprites[id].isActive = true;
				// 	// sprites[id].interval = setInterval(sprites[id].blink, 200);
				// }

			} else {

				if (first_draw == 1) {
					ctx.drawImage(image_normal, sprites[id].x*gridsize - 10, sprites[id].y*gridsize - 16);

					// ctx.fillStyle = "white";
					// ctx.fillRect(sprites[id].x*gridsize+10, sprites[id].y*gridsize-12, 24, 24);
				
					num_ctx.fillStyle = "white";
					num_ctx.strokeText(sprites[id].resources, sprites[id].x*gridsize+11 , sprites[id].y*gridsize+7);
					num_ctx.fillText(sprites[id].resources, sprites[id].x*gridsize+11 , sprites[id].y*gridsize+7);

				} else {
					if (sprites[id].highlight == 1) {
						ctx.drawImage(image_normal, sprites[id].x*gridsize - 10, sprites[id].y*gridsize - 16);
						sprites[id].highlight = 0;

						// if (sprites[id].isActive) {
						// 	sprites[id].isActive = false;
						// 	clearInterval(sprites[id].interval);
						// }
						
						// ctx.fillStyle = "white";
						// ctx.fillRect(sprites[id].x*gridsize+10, sprites[id].y*gridsize-12, 24, 24);
					}
					num_ctx.fillStyle = "white";
					num_ctx.strokeText(sprites[id].resources, sprites[id].x*gridsize+11 , sprites[id].y*gridsize+7);
					num_ctx.fillText(sprites[id].resources, sprites[id].x*gridsize+11 , sprites[id].y*gridsize+7);
				}
			}
		}
		
		//#5bc0de
		num_ctx.fillStyle = "#FFFF00";
		resources_acquired = Math.floor(num_supplies / inside_dropzone.length);
		for(var idx=0; idx<inside_dropzone.length; idx++) {
			// calculate how much to subtract here. subtracting 5 as a placeholder
			var amount = Math.max(sprites[inside_dropzone[idx]].resources - resources_acquired, 0);
			num_ctx.strokeText(amount, sprites[inside_dropzone[idx]].x*gridsize+11 , sprites[inside_dropzone[idx]].y*gridsize+7);
			num_ctx.fillText(amount, sprites[inside_dropzone[idx]].x*gridsize+11 , sprites[inside_dropzone[idx]].y*gridsize+7);
		}

		people_ctx.drawImage(offscreen_canvas, 0, 0);
		numbers_ctx.clearRect(0, 0, c_numbers.width, c_numbers.height);
		numbers_ctx.drawImage(offscreen_canvas_2, 0, 0);
		return inside_dropzone;
    }

    update = function(ai=false) {
    	// Mouse Position Tracker
    	// canvasPos = getPosition(c);
    	if (first_draw == 1) {
    		offscreen_canvas = document.createElement('canvas');
    		offscreen_canvas.width = c.width;
    		offscreen_canvas.height = c.height;
	    	ctx = offscreen_canvas.getContext("2d");
	    	ctx.drawImage(terrain, 0, 0);
	    	ctx.strokeStyle = "#000000";

			background_ctx.drawImage(offscreen_canvas, 0, 0);
			var temp = drawSurvivors();

	    	mouse_ctx.lineWidth = 3;
	    	if (ai) {
	    		mouse_ctx.strokeStyle = "#0077B5";
	    	} else {
	    		//"#FF6A6A";
	    		mouse_ctx.strokeStyle = "#F25757";
	    	}
			mouse_ctx.beginPath();
			mouse_ctx.arc(mouseX, mouseY, slider_radius, 0, 2 * Math.PI, true);
			mouse_ctx.stroke();

    	} else {
			var temp = drawSurvivors();

    		mouse_ctx.clearRect(0, 0, c.width, c.height);
    		mouse_ctx.lineWidth = 3;
	    	if (ai) {
	    		mouse_ctx.strokeStyle = "#0077B5";
	    	} else {
	    		mouse_ctx.strokeStyle = "#F25757";
	    	}
			mouse_ctx.beginPath();
			mouse_ctx.arc(mouseX, mouseY, slider_radius, 0, 2 * Math.PI, true);
			mouse_ctx.stroke();

			// console.log('no background update');
    	}
	}
	

	$('#drawGrid').click(function() {
		$('#modal-form').modal('hide');
		initParams();
		game_active = 1;
    	first_draw = 1;
    	generateSurvivors(splits, num_survivors);
		update();
		first_draw = 0;
		player_turn = 0;
		$("#instruction").text("Adjust radius below and select a region on the terrain. Hover over to see the amount of supplies that would remain for each survivor. Click to confirm your drop.")

	});

	$('#reset-game').click(function() {
		resetSameGame();
		$("#instruction").text("Click Start Game to begin the game.");
	});


  	$("#game-mode").change(function(){      
		if($(this).val() === 'robot') {
	    	$('.form-hide').hide();        
		} else {
	    	$('.form-hide').show(); 
		}    
	});

});