const CANVAS_SIZE = 600,
	MIN_BOARD_SIZE = 3,
	MAX_BOARD_SIZE = 50,
	BOARD_BORDER_COLOR = "rgba(0,0,0,0.4)",
	SELECTED_BLOCK_COLOR = "rgba(200,0,0,0.9)",
	SELECTED_BLOCK_INSET = 8,
	HIGHLIGHTED_BLOCK_COLOR = "rgba(200,0,0,0.04)",
	PIECE_COLOR = "rgba(200,0,0,0.7)";
	PREVIOUS_JUMP_PIECE_COLOR = "rgba(0,0,200,0.7)"

let board = [],
	cellSide,
	ctx,
	player = 0,
	winner = -1,
	pieces = [],
	piece_num = 0,
	currently_jump = 0,
	preX = -1,
	preY = -1,
	selected = -1,
	highlighted = -1,
	isJumping = false;

const boardSizeInput = document.getElementById("boardSize"),
	canvas = document.querySelector('canvas'),
	startBtn = document.getElementById("gameStart"),
	turn = document.getElementById("turn"),
	moveType = document.getElementById("moveType"),
	stopJumpBtn = document.getElementById("StopJump"),
	Hint = document.getElementById("Hint")
	closePopupBtn = document.getElementById('closePopupBtn'),
	popupText = document.getElementById('popupText'),
	popupOverlay = document.getElementById('popupOverlay'),
	setupInfo = document.getElementById('setupInfo');
	

// Initialize Board Size Input
boardSizeInput.min = MIN_BOARD_SIZE;
boardSizeInput.max = MAX_BOARD_SIZE;
boardSizeInput.value = MIN_BOARD_SIZE;

let n = boardSizeInput.value;



document.body.onkeyup = function(e){
    if(isJumping && e.keyCode == 27)
    	stopjump();
}

startBtn.addEventListener("click", setup);
canvas.addEventListener('mousemove', e => updateHighlighted(e));
canvas.addEventListener('mousedown', e => updateSelected(e));
stopJumpBtn.addEventListener("click", stopjump);
closePopupBtn.addEventListener("click", e => {showPopup(false);})
popupOverlay.addEventListener("click", e => {showPopup(false);})

function validateBoardDimensions(n) {
  return n >= MIN_BOARD_SIZE && n <= MAX_BOARD_SIZE;
}

function finish () {
		stopJumpBtn.style.display = "none";
		moveType.style.display = "none";
		turn.style.display = "none";
		setupInfo.style.textAlign = "center";
		setupInfo.style.marginTop = "10%";
		canvas.style.display = "none";
		startBtn.value = "Play Again";
}
function setup() {
	n = boardSizeInput.value;
	if (validateBoardDimensions(n)) {
		board = initBoard();
		stopJumpBtn.style.display = "block";
		moveType.style.display = "block";
		turn.style.display = "block";
		setupInfo.style.textAlign = "right";
		setupInfo.style.marginTop = 0;
		updateCanvas();
		startBtn.value = "Restart Game";
		turn.innerText = `Turn: Player ${player+1}`;
		if(check_jump(board, board.length)) {
			moveType.innerText = "Move: JUMP";
			setJumping(true);
			Hint.innerText = "At least one jump should be made. You should try to make a jump or slide if not possible";
		}
		else {
			moveType.innerText = "Move: SLIDE";
			setJumping(false);
			if(check_possible_jump(board, board.length))
				Hint.innerText = "After your sliding move, there could and should be at least one possible jump";
			else 
				Hint.innerText = "Your sliding move should reduce the pairwise distances among the pieces"
		}
	}
	else {
		showPopup(true, "Board size should be between 3 and 50 (both included)");
		canvas.style.display = "none";
		startBtn.value = "Start Game";
		turn.innerText = "";
		moveType.innerText = "";
		Hint.innerText = "";
		boardSizeInput.value = MIN_BOARD_SIZE;
	}
}

function initBoard() {
	player = 0;
	winner = -1;
	currently_jump = 0;
	preX = -1;
	preY = -1;
	const _board = [], pieces = rand(0, n * n - 1, n * n - 2 * n + 1);
	piece_num = pieces.length;
	ind = 0;
	for (let i = 0; i < n; i++) {
		_row = [];
		for (let j = 0; j < n; j++) {
			_val = pieces.indexOf(ind) === -1 ? 0 : 1;
			_row.push(_val);
			ind++;
		}
		_board.push(_row);
	}
	return _board;
}

function setJumping(jumping) {
	isJumping = jumping;
	stopJumpBtn.style.visibility = isJumping ? "visible" : "hidden";
}

function updateCanvas() {
	canvas.width = CANVAS_SIZE;
	canvas.height = CANVAS_SIZE;
	canvas.style.display = "block";
	canvas.style.border = `1px solid ${BOARD_BORDER_COLOR}`;
	cellSide = canvas.width / board.length;
	ctx = canvas.getContext('2d');
	// draw base layer of board
	for (let i = 0; i < board.length; i++) {
	    for (let j = 0; j < board[i].length; j++) {
	        let x = j * cellSide;
	        let y = i * cellSide;
	        ctx.beginPath();
	        ctx.strokeStyle = BOARD_BORDER_COLOR;
	        ctx.strokeRect(x, y, cellSide, cellSide);  
	    }
	}
	// handle selected change
	if (selected !== -1) {
		let x = selected % board.length * cellSide,
			y = parseInt(selected / board.length) * cellSide;
        ctx.beginPath();
        ctx.strokeStyle = SELECTED_BLOCK_COLOR;
        ctx.strokeRect(x + SELECTED_BLOCK_INSET, y + SELECTED_BLOCK_INSET, cellSide - 2 * SELECTED_BLOCK_INSET, cellSide - 2 * SELECTED_BLOCK_INSET);
	}
	// handle highlighted change
	if (highlighted !== -1) {
		if (highlighted !== selected) {
			let x = highlighted % board.length * cellSide,
				y = parseInt(highlighted / board.length) * cellSide;
	        ctx.beginPath();
	        ctx.fillStyle = HIGHLIGHTED_BLOCK_COLOR;
	        ctx.fillRect(x, y, cellSide, cellSide);
	        canvas.style.cursor = "pointer";
    	} else {
			let x = selected % board.length * cellSide,
				y = parseInt(selected / board.length) * cellSide;
	        ctx.beginPath();
	        ctx.strokeStyle = "#000";
	        ctx.strokeRect(x + SELECTED_BLOCK_INSET, y + SELECTED_BLOCK_INSET, cellSide - 2 * SELECTED_BLOCK_INSET, cellSide - 2 * SELECTED_BLOCK_INSET);
    	}
	} else
        canvas.style.cursor = "not-allowed";
	// draw pieces over the board
	for (let i = 0; i < board.length; i++)
		for (let j = 0; j < board.length; j++)
			if (board[i][j] == 1) {
		        ctx.beginPath();
				if(i == preX && j == preY)
					ctx.fillStyle = PREVIOUS_JUMP_PIECE_COLOR;
				else
					ctx.fillStyle = PIECE_COLOR;
		        ctx.arc((j + 0.5) * cellSide, (i+0.5) * cellSide, cellSide/4, 0, 2 * Math.PI);
		        ctx.fill();
			}
}

function getSelection(e) {
	const [y, x] = getCursorPosition(canvas, e);
	return parseInt(x / cellSide) * board.length + parseInt(y / cellSide);
}

function validateHighlighted(selection) {
	if (selection === selected)
		return true;
	if (selected === -1)
		return board[parseInt(selection/board.length)][selection%board.length] === 1;
	else
		return board[parseInt(selection/board.length)][selection%board.length] === 0;
}

function updateHighlighted(e) {
	_selection = getSelection(e);
	if (_selection !== highlighted) {
		highlighted = validateHighlighted(_selection) ? _selection : -1;
		updateCanvas();
	}
}


function stopjump() {
	if(currently_jump == 0)
		return;
	if(winner != -1)
		return;
	
	currently_jump = 0;
	preX = -1;
	preY = -1;
	
	player = 1 - player;
	if(winner == -1)
		turn.innerText = `Turn: Player ${player+1}`;
	else
		turn.innerText = `Winner: Player ${winner+1}`;
	
	if(check_jump(board, board.length)) {
		moveType.innerText = "Move: JUMP";
		setJumping(true);
		Hint.innerText = "At least one jump sould be made. You should make a jump or a sliding move";
	}
	else {
		moveType.innerText = "Move: SLIDE";
		setJumping(false);
		if(check_possible_jump(board, board.length))
			Hint.innerText = "After your sliding move, there could and should be at least one possible jump";
		else 
			Hint.innerText = "Your sliding move should reduce the minimum of the pairwise distances"
	}
	updateCanvas();
}


function is_valid_move(board, X1, Y1, X2, Y2) {
	var disX = Math.abs(X1 - X2);
	var	disY = Math.abs(Y1 - Y2);
	
	if(disX <= 1 && disY <= 1)
		return "slide";
	
	if((disX == 2 || disX == 0) && (disY == 2 || disY == 0) && (disX + disY > 0)) {
		var midX = (X1 + X2) / 2, midY = (Y1 + Y2) / 2;
		if(board[midX][midY] == 1)
			return "jump";
	}
	
	return "invalid";
}

function check_jump(board, n) {
	for(var i = 0; i < n; i++)
		for(var j = 0; j < n; j++) {
			if(board[i][j] == 0) continue;
			for(var tx = -1; tx <= 1; tx++)
				for(var ty = -1; ty <= 1; ty++) {
					if(tx == 0 && ty == 0) continue;
					if(i + tx < 0 || i + tx >= n || j + ty < 0 || j + ty >= n) continue;
					if(i - tx < 0 || i - tx >= n || j - ty < 0 || j - ty >= n) continue;
					if(board[i + tx][j + ty] == 1 && board[i - tx][j - ty] == 0)
						return true;
				}
			
		}
		
	return false;
}

function check_possible_jump(board, n) {
	for(var i = 0; i < n; i++)
		for(var j = 0; j < n; j++) {
			
			if(board[i][j] == 0) continue;
			for(var tx = -1; tx <= 1; tx++)
				for(var ty = -1; ty <= 1; ty++) {
					
					if(tx == 0 && ty == 0) continue;
					if(i + tx < 0 || i + tx >= n || j + ty < 0 || j + ty >= n) continue;
					var ti = i + tx, tj = j + ty;
					if(board[ti][tj] == 1) continue;
					
					board[i][j] = 0;	// possible change
					board[ti][tj] = 1;
					
					var res = check_jump(board, n);
					
					board[i][j] = 1;	// redo
					board[ti][tj] = 0;
					
					if(res == true)
						return true;
				}
			
		}
	return false;
}


function compute_min_distance(board, n) {
	var min_dis = n*n;
	for(var i = 0; i < n; i++)
		for(var j = 0; j < n; j++) {
			if(board[i][j] == 0) continue;
			for(var x = 0; x < n; x++)
				for(var y = 0; y < n; y++) {
					if(x == i && j == y) continue;
					if(board[x][y] == 0) continue;
					
					var disX = Math.abs(i - x), disY = Math.abs(j - y);
					var dis = Math.max(disX, disY);
					min_dis = Math.min(min_dis, dis);
				}
		}
	return min_dis;
	
}


function movePiece(curr, next) {
	
	selected = -1;

	if(winner != -1)	// game already end
		return;
	
	var X1 = parseInt(curr/board.length), Y1 = curr%board.length;
	var X2 = parseInt(next/board.length), Y2 = next%board.length;
	
	var move_result = is_valid_move(board, X1, Y1, X2, Y2);
	
	if(move_result == "invalid") {
		showPopup(true, "Invalid move");
		return;
	}
	
	if(check_jump(board, board.length)) {
		if(move_result == "slide") {
			showPopup(true, "You can only make a jumping move or choose to stop jumping");
			return;
		}
		if(currently_jump == 1) {
			if(preX != X1 || preY != Y1) {
				showPopup(true, "You can only make a jump with same piece");
				return;
			}
		}
		
		board[X1][Y1] = 0;
		board[X2][Y2] = 1;
		
		var midX = (X1 + X2) / 2, midY = (Y1 + Y2) / 2;
		board[midX][midY] = 0;
		piece_num -= 1;
		
		if(piece_num == 1) {	// player win
			winner = player;
		}
		currently_jump = 1;
		preX = X2;
		preY = Y2;
	}
	else
	{
		if(currently_jump == 1){
			showPopup(true, "You can either continue jumping or stop jumping if not possible");
			return;
		}
		// WARNING: current time complexity is O(n^4)
		var can_make_possible_jump = check_possible_jump(board, board.length);
		// WARNING: current time complexity is O(n^4)
		var current_min_distance = compute_min_distance(board, board.length);
		
		var result = is_valid_move(board, X1, Y1, X2, Y2);
		
		if(result == "jump") {
			showPopup(true, "Jump move is not possible");
			return;
		}
		
		board[X1][Y1] = 0;
		board[X2][Y2] = 1;
		
		if(can_make_possible_jump == true) {	// could make possible jump
		
			if(check_jump(board, n) == false) {
				board[X1][Y1] = 1; // redo
				board[X2][Y2] = 0;
				showPopup(true, "Your move should reduce the pairwaise distance among the pieces");
				return;
			}
		}
		else	// then should reduce distance
		{
			// WARNING: current time complexity is O(n^4)
			var new_min_distance = compute_min_distance(board, n);
			
			if(new_min_distance >= current_min_distance)
			{
				board[X1][Y1] = 1; // redo
				board[X2][Y2] = 0;
				showPopup(true, "The move should reduce the pairwise distances among pieces")
				return;
			}
		}
	}
	
	if(currently_jump == 0)
		player = 1 - player;
	if(winner == -1)
		turn.innerText = `Turn: Player ${player+1}`;
	else
		turn.innerText = `Winner: Player ${winner+1}`;
	

	
	if(currently_jump == 1 || check_jump(board, board.length)) {
		moveType.innerText = "Move: JUMP";
		setJumping(true);
		if(currently_jump == 0)
			Hint.innerText = "You must try to make a jumping move";
		else
			Hint.innerText = "You can only jump with the blue piece, or choose to stop jumping if not possible";
	}
	else if(winner == -1) {
		moveType.innerText = "Move: SLIDE";
		setJumping(false);
		if(check_possible_jump(board, board.length))
			Hint.innerText = "After your sliding move, there should be at least one possible jump";
		else 
			Hint.innerText = "Your sliding move should reduce the minimum of the pairwise distances"
	}
}

function updateSelected(e) {
	_selection = getSelection(e);
	if (selected === -1) {
		if (board[parseInt(_selection/board.length)][_selection%board.length] === 1)
			selected = _selection;
	} else {
		if (selected == _selection)
			selected = -1;
		else if (board[parseInt(_selection/board.length)][_selection%board.length] === 0)
			movePiece(selected, _selection);
	}
	updateCanvas();
	if(winner != -1) {
		moveType.innerText = "Game end";
		Hint.innerText = "";
		showPopup(true, `Player ${winner + 1} has won the game!!`);
		finish();
		selected = -1;
	}
}

function showPopup(show = false, text = "") {
	if (show) {
		popupText.innerText = text;
		popupText.style.display = "flex";
		popupOverlay.style.display = "block";
		closePopupBtn.style.display = "block";
		document.body.style.overflow = "hidden";
	} else {
		popupText.innerText = "";
		popupText.style.display = "none";
		popupOverlay.style.display = "none";
		closePopupBtn.style.display = "none";
		document.body.style.overflow = "auto";
	}
}