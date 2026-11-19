// Game state
let biases;
let guesses;
let history;
let bias;
let numGuesses = [3, 3];
let players = ["Player 1", "Player 2"];
let nCoins = 5;
let turn;
let currentRow;
let gameOver;

function gameKeyPressListener(event) {
    if (!gameOver) {
        let k = event.key.toUpperCase();
        console.log(k);
        if (k === "H" || k === "T") {
            makeGuess(k);
        } else if (k === "BACKSPACE" || k === "DELETE"){
            deleteGuess();
        }
    }
}

function showOptions(){
    document.getElementById("make-guess-btn").style.display = 'none';
    document.getElementById("heads-btn").style.display = 'block';
    document.getElementById("tails-btn").style.display = 'block';
}

function toggleTurn(){
    turn = (turn + 1) % 2;
    document.getElementById("make-guess-btn").style.display = 'block';
    document.getElementById("heads-btn").style.display = 'none';
    document.getElementById("tails-btn").style.display = 'none';
}

function updateStatus(){
    document.getElementById('status').innerHTML = 
        `<span class="neutral-message"> ${players[turn]}'s turn. Flip a coin or make a guess!<br><br>
        Guesses remaining <br> ${players[0]}: ${numGuesses[0]} | ${players[1]}: ${numGuesses[1]} </span>`;
}

function deleteGuess() {
    if (gameOver) return;
    const emptyIndex = guesses[currentRow].findIndex(g => g === '');
    if (emptyIndex === 0) return;
    var lastIndex;
    if (emptyIndex===-1){
        lastIndex = -1;
    } else{
        lastIndex = emptyIndex - 1;
    }
    guesses[currentRow][lastIndex] = ''
    document.getElementById(`cell-${currentRow}-${lastIndex}`).innerHTML = '';
}

function showBiases(){
    var html = '';
    for (var i = 0; i < nCoins; i++) {
        var p = (biases[i] * 100);
        html += p>50? '<div> ' + Math.round(p) + '% H </div>' : '<div> ' + Math.round(100-p) + '% T </div>';
    }
    document.getElementById('biases').innerHTML = html;
}

function showStats() {
    var html = '';
    for (var i = 0; i < nCoins; i++) {
        var h = history[i];
        if (h.length > 0) {
            var heads = 0;
            for (var j = 0; j < h.length; j++) {
                if (h[j] == 'H') heads++;
            }
            var p = (heads * 100 / h.length).toFixed(1);
            html += '<div><br>H: ' + heads + 
                   '<br>T: ' + (h.length - heads) + '</div>';
        } else {
            html += '<div></div>';
        }
    }
    document.getElementById('stats').innerHTML = html;
}

// Initialize grid
function initializeGrid() {
    const grid = document.getElementById('grid');
    const stats = document.getElementById('stats');
    const biasElem = document.getElementById('biases');

    document.addEventListener("keyup", gameKeyPressListener);

    bias_weight = (1-bias)
    biases = Array(nCoins).fill().map(() => Math.random()>0.5 ?  bias : 1-bias); // Initialize biases array
    guesses = Array(5).fill().map(() => Array(nCoins).fill(''));
    history = Array(nCoins).fill().map(() => []);
    turn = 0;
    currentRow = 0;
    gameOver = false;
    grid.style.gridTemplateColumns = `repeat(${nCoins}, 60px)`;
    stats.style.gridTemplateColumns = `repeat(${nCoins}, 60px)`;
    biasElem.style.gridTemplateColumns = `repeat(${nCoins}, 60px)`;

    updateStatus();

    for(let i = 0; i<nCoins; i++){
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.textContent = '?';
        coin.onclick = ()=>flipCoin(i);
        document.getElementById('coins').appendChild(coin);
    }

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < nCoins; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${row}-${col}`;
            grid.appendChild(cell);
        }
    }
}

function drawRow(row){
    const grid = document.getElementById('grid');
    for (let col = 0; col < nCoins; col++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell-${row+1}-${col}`;
        grid.appendChild(cell);
    }
    guesses.push(Array(nCoins).fill(''));
}

function colorRow(row, isCorrect){
    for(let col = 0; col<nCoins; col++){
        document.getElementById(`cell-${row}-${col}`).classList.add(isCorrect ? 'correct':'wrong');
    }
}

// Flip a coin
function flipCoin(index) {
    if (gameOver) return;
    
    const result = Math.random() < biases[index] ? 'H' : 'T';
    history[index].push(result);
    
    // Update coin display
    const coins = document.getElementsByClassName('coin');
    coins[index].classList.toggle('flip');
    setTimeout(()=>{
        coins[index].textContent = result;
    }, 300) //ms

    toggleTurn();
    updateStatus();

    if(document.getElementById('showStats').checked){
        showStats();
    }
}

// Handle guess
function makeGuess(value) {
    if (gameOver) return;
    
    const currentGuesses = guesses[currentRow];
    const emptyIndex = currentGuesses.findIndex(g => g === '');

    console.log(currentRow, emptyIndex);
    
    if (emptyIndex === -1) return;
    
    // Update guess in array and display
    currentGuesses[emptyIndex] = value;
    document.getElementById(`cell-${currentRow}-${emptyIndex}`).textContent = value;
    
    // Check if row is complete
    if (currentGuesses.every(g => g !== '')) {
        const correct = currentGuesses.reduce((count, guess, index) => {
            const isHeadsBiased = biases[index] > 0.5;
            return count + (guess === (isHeadsBiased ? 'H' : 'T') ? 1 : 0);
        }, 0);

        colorRow(currentRow, correct===nCoins);
        
        if (correct === nCoins) {
            gameOver = true;
            showBiases();
            document.getElementById('stats').style.display = 'none';
            document.getElementById('status').innerHTML = '';
            document.getElementById('message').innerHTML = 
                '<span class="win-message">Congratulations! ' +players[turn]+ ' won!</span>';
            document.getElementById('reset-btn').style.display = 'block';
        } else if (numGuesses[turn] - 1 === 0) {
            gameOver = true;
            showBiases();
            document.getElementById('stats').style.display = 'none';
            document.getElementById('status').innerHTML = '';
            document.getElementById('message').innerHTML = 
                `<span class="lose-message">Game Over! ${players[(turn+1)%2]} wins.</span>`;
            document.getElementById('reset-btn').style.display = 'block';
        } else {
            if (currentRow >= 4){
                drawRow(currentRow);
                document.getElementById('grid').lastElementChild.scrollIntoView({behavior: 'smooth', block: 'nearest'}); 
            }
            numGuesses[turn]--;
            console.log(numGuesses);
            currentRow++;
            toggleTurn();
            updateStatus();
        }
    }
}

function startGame() {
    const player1 = document.getElementById('player1').value;
    const player2 = document.getElementById('player2').value;
    const coins = document.getElementById('nCoins').value;
    const difficulty = document.getElementById('difficulty').value;

    const nGuesses = parseInt(document.getElementById('nGuesses').value);
    numGuesses = [nGuesses, nGuesses];

    document.getElementById('overlay').style.display = 'none';
    players[0] = player1 ? player1 : "Alice";
    players[1] = player2 ? player2 : "Bob";
    nCoins = parseInt(coins);
    bias = parseFloat(difficulty)/100;

    document.getElementById('reset-btn').style.display = 'block';
    // Initialize the game
    initializeGrid();
}

// Show the overlay when the page loads
window.onload = function() {
    document.getElementById('overlay').style.display = 'flex';
}

function resetGame(){
    document.getElementById('status').innerHTML = '';
    document.getElementById('coins').innerHTML = '';
    document.getElementById('stats').innerHTML = '';
    document.getElementById('biases').innerHTML = '';
    document.getElementById('grid').innerHTML = '';
    document.getElementById('message').innerHTML = '';


    document.getElementById('reset-btn').style.display = 'none';
    document.getElementById('stats').style.display = 'grid';
    document.getElementById('overlay').style.display = 'flex';

    document.getElementById("make-guess-btn").style.display = 'block';
    document.getElementById("heads-btn").style.display = 'none';
    document.getElementById("tails-btn").style.display = 'none';
}