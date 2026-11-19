let N = 11; // Grid size
let treasureCount = 7; // Number of treasure cells
let wallCount = 5; // Number of wall cells
let teleportCount = 3; // Number of teleport cells
let thiefPos = `cell-${Math.floor(N / 2)}-${Math.floor(N / 2)}`; // Cell id of thief cell

const MIN_GAP = 3; // Minimum gap between cells
const MAX_ITERATIONS = 1000000;

// Dicts to store positions of different kinds of cells - will stay same throughout both games
let treasureCellPos = {};
let wallCellPos = {};
let teleportCellPos = {};
let allCells = {};

// Dicts to store the positions of different cells in current game
let treasureCells = {};
let wallCells = {};
let teleportCells = {};

let player1Pos = [0, 0]; // Starting position for Player 1
let player1EndPos = [N - 1, N - 1]; // Ending position for Player 1
let player2Pos = [N - 1, N - 1]; // Starting position for Player 2
let player2EndPos = [0, 0]; // Ending position for Player 2
let final_points = [0, 0];
let points = [0, 0]; // Current score of players
let stolen = false; // Flag to store if points were stolen first
let isTeleportMode = false; // flag to store whether current player is in teleport cell or not
let finished = false; // flag to store whether game is finished
let player1Name = "Player 1";
let player2Name = "Player 2";

// Dicts to store the treasure that is picked up by both players
let p1TreasureCells = {};
let p2TreasureCells = {};

// Flag to store currentPlayer
let currentPlayer = 1;
let gameCount = 1;

// decided winner based on points or if tie, then chooses first player to reach corner
function getWinner(player) {
  if (points[0] > points[1]) {
    return 1;
  }
  if (points[0] < points[1]) {
    return 2;
  }
  points[player - 1]++;
  return player;
}

// initialize the grid and place the T, W and P cells
function initializeGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  // set all errors to hidden
  document.getElementById(`move-error1`).hidden = true;
  document.getElementById(`move-error2`).hidden = true;

  // hide result div
  document.getElementById(`result`).hidden = true;

  // Add the T, W and P count config to UI
  document.getElementById(
    `treasure-heading`
  ).innerHTML = `Grid Size: ${N}<br> Total Treasure: ${treasureCount}<br> Total Walls: ${wallCount}<br> Total Teleports: ${teleportCount}`;

  grid.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${N}, 1fr)`;

  for (let row = 0; row < N; row++) {
    for (let col = 0; col < N; col++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      cell.id = `cell-${row}-${col}`;
      grid.appendChild(cell);
    }
  }

  // add initial position of player1 and player2 to excluded list
  // also add position of theif cell
  let p1Pos = `cell-${player1Pos[0]}-${player1Pos[1]}`,
    p2Pos = `cell-${player2Pos[0]}-${player2Pos[1]}`;
  document.getElementById(thiefPos).classList.add("thief");
  allCells[p1Pos] = true;
  allCells[p2Pos] = true;
  allCells[thiefPos] = true;

  // place T, W and P cells
  let countTreasure = placeCells(
    treasureCells,
    treasureCellPos,
    allCells,
    treasureCount,
    "treasure"
  );
  let countWall = placeCells(
    wallCells,
    wallCellPos,
    allCells,
    wallCount,
    "wall"
  );
  let countTeleport = placeCells(
    teleportCells,
    teleportCellPos,
    allCells,
    teleportCount,
    "teleport"
  );

  // add player classes to current position of players
  document.getElementById(p1Pos).classList.add("player1");
  document.getElementById(p2Pos).classList.add("player2");

  return (
    countTreasure === treasureCount &&
    countWall === wallCount &&
    countTeleport === teleportCount
  );
}

function reinitializeGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  // set all errors to hidden
  document.getElementById(`move-error1`).hidden = true;
  document.getElementById(`move-error2`).hidden = true;

  // hide result div
  document.getElementById(`result`).hidden = true;
  document.getElementById("controls").style.display = "block";

  grid.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${N}, 1fr)`;

  for (let row = 0; row < N; row++) {
    for (let col = 0; col < N; col++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      cell.id = `cell-${row}-${col}`;
      grid.appendChild(cell);
    }
  }

  for (cellId in treasureCellPos) {
    document.getElementById(cellId).classList.add("treasure");
    treasureCells[cellId] = true;
  }
  for (cellId in wallCellPos) {
    document.getElementById(cellId).classList.add("wall");
    wallCells[cellId] = true;
  }
  for (cellId in teleportCellPos) {
    document.getElementById(cellId).classList.add("teleport");
    teleportCells[cellId] = true;
  }

  let p1Pos = `cell-${player1Pos[0]}-${player1Pos[1]}`,
    p2Pos = `cell-${player2Pos[0]}-${player2Pos[1]}`;
  document.getElementById(thiefPos).classList.add("thief");

  // add player classes to current position of players
  document.getElementById(p1Pos).classList.add("player1");
  document.getElementById(p2Pos).classList.add("player2");
}

function checkGap(newCellId, allCells) {
  const [row, col] = newCellId.split("-").slice(1).map(Number);
  for (cellId in allCells) {
    let [row_e, col_e] = cellId.split("-").slice(1).map(Number);
    if (Math.abs(row - row_e) + Math.abs(col - col_e) < MIN_GAP) return false;
  }
  return true;
}

// places the T, W and P cells - assigns respective CSS classes and content
function placeCells(dict, posDict, allCells, count, className) {
  let i = 0;
  let iterations = 0;
  while (i < count && iterations < MAX_ITERATIONS) {
    const row = Math.floor(Math.random() * N);
    const col = Math.floor(Math.random() * N);
    const cellId = `cell-${row}-${col}`;

    if (!(cellId in allCells) && checkGap(cellId, allCells)) {
      dict[cellId] = true;
      posDict[cellId] = true;
      allCells[cellId] = true;
      document.getElementById(cellId).classList.add(className);
      i++;
    }
    iterations++;
  }
  return i;
}

// perform the player's position update based on the move
function movePlayer(player, direction) {
  let pos = player1Pos,
    otherPos = player2Pos,
    playerString = "player1";
  if (player === 2) {
    pos = player2Pos;
    otherPos = player1Pos;
    playerString = "player2";
  }

  const [row, column] = [pos[0], pos[1]];
  const currentCellId = `cell-${pos[0]}-${pos[1]}`;

  // update position of cell after checking that it doesn't collide with a Wall cell
  switch (direction) {
    case "right":
      if (pos[1] < N - 1 && !(`cell-${pos[0]}-${pos[1] + 1}` in wallCells))
        pos[1]++;
      break;
    case "up":
      if (pos[0] > 0 && !(`cell-${pos[0] - 1}-${pos[1]}` in wallCells))
        pos[0]--;
      break;
    case "left":
      if (pos[1] > 0 && !(`cell-${pos[0]}-${pos[1] - 1}` in wallCells))
        pos[1]--;
      break;
    case "down":
      if (pos[0] < N - 1 && !(`cell-${pos[0] + 1}-${pos[1]}` in wallCells))
        pos[0]++;
      break;
  }

  const newCellId = `cell-${pos[0]}-${pos[1]}`;
  const otherCellId = `cell-${otherPos[0]}-${otherPos[1]}`;
  const errorElement = document.getElementById(`move-error${player}`);

  // check if any position update was made at all or if same cell as other player
  if (newCellId !== currentCellId && newCellId !== otherCellId) {
    // hide any errors and remove player class from current cell
    errorElement.hidden = true;
    document.getElementById(currentCellId).classList.remove(playerString);

    // update player config for new cell
    updatePlayers(player);

    // check if new position is a Teleport cell
    if (newCellId in teleportCells) {
      // handle teleport
      handleTeleportCell(player, newCellId, playerString);
    } else {
      // change game turn to next player
      simulateGame(player === 1 ? 2 : 1);
    }
  } else {
    // show invalid move error after assigning previous positions
    pos[0] = row;
    pos[1] = column;
    errorElement.hidden = false;
  }
}

// handles teleport to a new position for current cell
function handleTeleportCell(player, newCellId, playerString) {
  const teleportCellElement = document.getElementById(newCellId);

  // Activate teleport mode
  isTeleportMode = true;

  // highlight the current teleport cell and change player instructions
  teleportCellElement.classList.add("highlight");
  document.getElementById(`buttons${player}`).hidden = true;
  document.getElementById(`move-placeholder${player}`).textContent =
    "Pick a Position";
  const errorElement = document.getElementById(`move-error${player}`);

  const grid = document.getElementById("grid");

  // add event listener to get the new clicked cell
  grid.addEventListener("click", function onGridClick(event) {
    const target = event.target;

    // check if new clicked cell is valid - shouldn't be another teleport or wall cell
    if (
      target.classList.contains("grid-cell") &&
      target.id !== newCellId &&
      target.id in teleportCells
    ) {
      // Exit teleport mode
      isTeleportMode = false;

      // hide any error and remove highlight from previous teleport cell
      errorElement.hidden = true;
      teleportCellElement.classList.remove("highlight");

      // get details of newly selected cell and remove player class from teleport cell
      document.getElementById(newCellId).classList.remove(playerString);
      const pos = player === 1 ? player1Pos : player2Pos;
      const [row, col] = target.id.split("-").slice(1).map(Number);
      pos[0] = row;
      pos[1] = col;

      // remove event listener and set player instructions back to original
      grid.removeEventListener("click", onGridClick);
      document.getElementById(`buttons${player}`).hidden = false;
      document.getElementById(`move-placeholder${player}`).textContent =
        "Make a Move";

      // update player config
      updatePlayers(player);
      simulateGame(player === 1 ? 2 : 1);
    } else {
      // show invalid move error
      errorElement.hidden = false;
    }
  });
}

// update player config
function updatePlayers(player) {
  const pos = player === 1 ? player1Pos : player2Pos,
    otherPlayer = player === 1 ? "2" : "1";

  // if new position is a treasure cell, update the player's points
  const newCellId = `cell-${pos[0]}-${pos[1]}`;
  if (newCellId in treasureCells) {
    if (player === 1 && !(newCellId in p1TreasureCells)) {
      points[0] += 1;
      p1TreasureCells[newCellId] = true;
    } else if (player === 2 && !(newCellId in p2TreasureCells)) {
      points[1] += 1;
      p2TreasureCells[newCellId] = true;
    }

    delete treasureCells[newCellId];
    document.getElementById(newCellId).classList.remove("treasure");
  }

  // check if player landed on thief cell, steal point from other player
  if (!stolen && newCellId === thiefPos) {
    stolen = true;
    if (points[otherPlayer - 1] !== 0) {
      points[player - 1] += 1;
      points[otherPlayer - 1] -= 1;
    }
    document.getElementById(thiefPos).classList.remove("thief");
  }

  // add player class to new cell and update score UI
  document.getElementById(newCellId).classList.add(`player${player}`);
  document.getElementById(`player${player}-score`).textContent =
    points[player - 1];
  document.getElementById(`player${otherPlayer}-score`).textContent =
    points[otherPlayer - 1];
}

// simulate game for a particular player - hides options for other player
function simulateGame(player) {
  if (
    (player1Pos[0] === player1EndPos[0] &&
      player1Pos[1] === player1EndPos[1]) ||
    (player2Pos[0] === player2EndPos[0] && player2Pos[1] === player2EndPos[1])
  ) {
    // game has finished
    finished = true;

    // fetch winner
    const winner = getWinner(player === 1 ? 2 : 1);

    // hide controls
    document.getElementById("controls").style.display = "none";

    // show result and assign winner's image
    document.getElementById(`result`).hidden = false;
    let currentPlayerImg =
      winner === 1 ? "assets/adventurer_m.png" : "assets/adventurer_f.png";
    document.getElementById("result-img").src = currentPlayerImg;
    document.getElementById(
      "result-text"
    ).textContent = `Wins Stage ${gameCount}`;
    return;
  }

  currentPlayer = player;
  const otherPlayer = player === 1 ? "2" : "1";
  document.getElementById(`controls-p${player}`).hidden = false;
  document.getElementById(`controls-p${otherPlayer}`).hidden = true;
}

// event listener for making moves for player using keystrokes
document.addEventListener("keydown", (event) => {
  // Block key presses during teleport mode
  if (isTeleportMode || finished) {
    event.preventDefault();
    return;
  }

  let direction = null;

  switch (event.key) {
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
      // Prevent the default scrolling behavior
      event.preventDefault();
      break;
  }

  switch (event.key) {
    case "ArrowUp":
      direction = "up";
      break;
    case "ArrowDown":
      direction = "down";
      break;
    case "ArrowLeft":
      direction = "left";
      break;
    case "ArrowRight":
      direction = "right";
      break;
    default:
      break;
  }

  if (direction) {
    movePlayer(currentPlayer, direction);
  }
});

const modal = document.getElementById("parameter-modal");
const overlay = document.getElementById("overlay");
const startGameButton = document.getElementById("startGameButton");
const gameBoard = document.getElementById("game-state");
const intermission = document.getElementById("intermission");
const startSecondGameButton = document.getElementById("start_game2");
const final_result = document.getElementById("final_result");
const replay_button = document.getElementById("replay");

window.onload = function () {
  modal.style.display = "block";
  overlay.style.display = "block";
  intermission.style.display = "none";
  gameBoard.hidden = true;
};

startGameButton.addEventListener("click", function () {
  player1Name = document.getElementById("player1Name").value;
  player2Name = document.getElementById("player2Name").value;
  const gridSize = document.getElementById("gridSize").value;
  const totalTreasures = document.getElementById("totalTreasures").value;
  const totalWalls = document.getElementById("totalWalls").value;
  const totalTeleports = document.getElementById("totalTeleports").value;

  if (
    !player1Name.trim() ||
    !player2Name.trim() ||
    !gridSize.trim() ||
    !totalTreasures.trim() ||
    !totalWalls.trim() ||
    !totalTeleports.trim()
  ) {
    document.getElementById("params-invalid-error").textContent =
      "Parameter Error: Please fill all the fields!";
    return;
  }

  // assign parameters for first game
  treasureCells = {};
  wallCells = {};
  teleportCells = {};
  treasureCellPos = {};
  wallCellPos = {};
  teleportCellPos = {};
  allCells = {};
  N = parseInt(gridSize);
  treasureCount = parseInt(totalTreasures);
  wallCount = parseInt(totalWalls);
  teleportCount = parseInt(totalTeleports);
  thiefPos = `cell-${Math.floor(N / 2)}-${Math.floor(N / 2)}`; // Cell id of thief cell
  player1Pos = [0, 0];
  player1EndPos = [N - 1, N - 1];
  player2Pos = [N - 1, N - 1];
  player2EndPos = [0, 0];
  currentPlayer = 1;
  finished = false;

  // remove invalid params error
  document.getElementById("params-invalid-error").textContent = "";

  // setting name
  document.getElementById("player1-name").innerHTML = player1Name;
  document.getElementById("player2-name").innerHTML = player2Name;
  document.getElementById(`player1-score`).textContent = 0;
  document.getElementById(`player2-score`).textContent = 0;

  // show controls
  document.getElementById("controls").style.display = "block";
  document.getElementById("game-count").textContent = "Stage 1";

  if (teleportCount < 2) {
    document.getElementById("params-invalid-error").textContent =
      "Parameter Error: Grid must have atleast 2 teleports cells";
    return;
  }
  if (gridSize < 10 || gridSize > 25) {
    document.getElementById("params-invalid-error").textContent =
      "Parameter Error: Grid size must be between 10 and 25";
    return;
  }

  // Start first game with first player starting
  let validGrid = initializeGrid();
  if (validGrid) {
    modal.style.display = "none";
    overlay.style.display = "none";
    gameBoard.hidden = false;

    simulateGame(1);
  } else {
    document.getElementById("params-invalid-error").textContent =
      "Parameter Error: Grid could not be generated with provided parameters! Please provide different parameters";
    return;
  }

  waitForGameToFinish().then(() => {
    result_str =
      "<strong>Stage 1 Scores</strong> <br><br>" +
      `${player1Name} - ` +
      points[0] +
      "<br>" +
      `${player2Name} - ` +
      points[1] +
      "<br>";
    document.getElementById("game1_result").innerHTML = result_str;
    intermission.style.display = "block";
    overlay.style.display = "block";
  });
});

startSecondGameButton.addEventListener("click", function () {
  document.getElementById(`player1-score`).textContent = 0;
  document.getElementById(`player2-score`).textContent = 0;
  document.getElementById("game-count").textContent = "Stage 2";
  intermission.style.display = "none";
  overlay.style.display = "none";

  // Reset parameters for the second game
  p1TreasureCells = {};
  p2TreasureCells = {};
  player1Pos = [N - 1, N - 1];
  player2Pos = [0, 0];
  player1EndPos = [0, 0];
  player2EndPos = [N - 1, N - 1];
  currentPlayer = 2;
  finished = false;
  stolen = false;
  final_points = points;
  points = [0, 0];
  gameCount = 2;

  // Start second game with second player starting
  reinitializeGrid();
  simulateGame(2);

  waitForGameToFinish().then(() => {
    document.getElementById("tablePlayer1Name").textContent = player1Name;
    document.getElementById("tablePlayer2Name").textContent = player2Name;
    document.getElementById("game1Player1").textContent = final_points[0];
    document.getElementById("game1Player2").textContent = final_points[1];
    document.getElementById("game2Player1").textContent = points[0];
    document.getElementById("game2Player2").textContent = points[1];
    final_points[0] += points[0];
    final_points[1] += points[1];
    document.getElementById("totalPlayer1").textContent = final_points[0];
    document.getElementById("totalPlayer2").textContent = final_points[1];
    final_result.style.display = "block";
    overlay.style.display = "block";
    let finalResultText = `${player1Name} Wins!`;
    if (final_points[1] > final_points[0]) {
      finalResultText = `${player2Name} Wins!`;
    } else if (final_points[1] === final_points[0]) {
      finalResultText = "It is a draw!";
    }
    document.getElementById("final-result-text").textContent = finalResultText;
  });
});

// Helper function to wait for the game to finish
function waitForGameToFinish() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (finished) {
        clearInterval(interval);
        resolve();
      }
    }, 100); // Check every 100ms
  });
}

replay_button.addEventListener("click", function () {
  // reset the params;
  treasureCellPos = {};
  wallCellPos = {};
  teleportCellPos = {};

  // Dicts to store the positions of different cells in current game
  treasureCells = {};
  wallCells = {};
  teleportCells = {};
  allCells = {};

  p1TreasureCells = {};
  p2TreasureCells = {};
  player1Pos = [0, 0];
  player2Pos = [N - 1, N - 1];
  player1EndPos = [N - 1, N - 1];
  player2EndPos = [0, 0];
  currentPlayer = 1;
  finished = false;
  final_points = [0, 0];
  points = [0, 0];
  stolen = false;
  gameCount = 1;

  final_result.style.display = "none";
  modal.style.display = "block";
});
