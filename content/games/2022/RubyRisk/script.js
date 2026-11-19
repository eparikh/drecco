var rubies_in_each_box = [];
var inGame = false;
var done = false;
var numRubies;
var numStones;
var turn = 0;
var player1Total = 0;
var player2Total = 0;
var game_timer = 0;

var game;
var message = '';
// create a global variable to save the selected box
var selectedBox = -1;

function startGame() {
    wipe();
    message = '';
    player1 = document.getElementById("player-1").value;
    player2 = document.getElementById("player-2").value;
    numRubies = document.getElementById("number-of-rubies").value;
    numBoxes = document.getElementById("number-of-boxes").value;

    if(numBoxes < 2) {
            document.getElementById('error-message').innerText = "Number of boxes cannot be lesser than 2";
            document.getElementById('error-container').style.display = 'block';
            inGame = false;
            return;
    }

    if(numRubies < 1) {
        document.getElementById('error-message').innerText = "Number of rubies cannot be lesser than 1";
        document.getElementById('error-container').style.display = 'block';
        inGame = false;
        return;
    }
    if(numRubies%2!=1) {
      document.getElementById('error-message').innerText = "Number of rubies must be odd";
      document.getElementById('error-container').style.display = 'block';
      inGame = false;
      return;
    }
    game_timer = 120;

    done = false;
    boxRubies = 0;
    totalRubiesUsed = 0;
    rubies_in_each_box = [];
    var randoms = [];
    randoms.push(0);
    randoms.push(parseInt(numRubies));

    for(var i = 0; i < numBoxes - 1; i++) {
        boxRubies = Math.floor(Math.random() * numRubies)
        randoms.push(boxRubies);
    }

    randoms.sort(function(a, b) {
      return a - b;
    });    
    console.log(randoms);
    for(var i = 1; i <= numBoxes; i++) {
      rubies_in_each_box.push(randoms[i] - randoms[i-1])
    }

    makeBoxes(numBoxes);

    inGame = true;
}

function makeBoxes(numBoxes) {
  for (var i = 0; i < numBoxes; i++) {  
      var img = "<div class='photo'> <img src ='images/box.drawio.png' id='boxid"+i+"' onclick='selectBox("+i+")'/> </div>"; 
      $(".game-box").append(img);
  }
}

function makeRubies() {
  // unMakeRubies();
  for (var i = 0; i < p1s-p1sprev; i++) {  
    var img = "<div class='rubies-image'> <img src ='images/gem.drawio.png' id='rubyid1_"+i+"'/> </div>"; 
    $("#p1_rubies").append(img);
  }
  for (var i = 0; i < p2s-p2sprev; i++) {  
    var img = "<div class='rubies-image'> <img src ='images/gem.drawio.png' id='rubyid2_"+i+"'/> </div>"; 
    $("#p2_rubies").append(img);
  }
}

function unMakeRubies() {
  // remove the divs of the placed rubies
  var i = 0;
  var img = document.getElementById('rubyid1_'+i);
  while (img) {
    i += 1;
    if(img) {
      img.remove();
    }
    img = document.getElementById('rubyid1_'+i);
  }
  i = 0;
  img = document.getElementById('rubyid2_'+i);
  while (img) {
    i += 1;
    if(img) {
      img.remove();
    }
    img = document.getElementById('rubyid2_'+i);
  }
}

// function unMakeRubies() {
// // hide the divs of the rubies

//   var i = 0;
//   var img = document.getElementById('rubyid1_'+i);
//   while (img) {
//     i += 1;
//     if(img) {
//       img.style.display = 'none';
//     }
//     img = document.getElementById('rubyid1_'+i);
//   }

// }


function selectBox(id) {
  unSelect();
  var img = document.getElementById('boxid'+id);
  img.setAttribute('src', 'images/box_selected.drawio.png')
  var selection_msg = "<div class='message' id='msg"+id+"'>Selected Box number "+(id + 1)+"</div>";
  $(".game-box").append(selection_msg);
  selectedBox = id;
}

function unSelect() {
  for(var i = 0; i < numBoxes; i++) {
    var img = document.getElementById('boxid'+i);
    var msg = document.getElementById('msg'+i);
    img.setAttribute('src', 'images/box.drawio.png');
    if(msg) {
      msg.remove();
    }
  }
}

function wipe() {
  var img = document.getElementById('boxid0');
  var msg = document.getElementById('msg0');
  var i = 0;
  while(img || msg) {
    i += 1;
    if(msg) {
      msg.remove();
    }
    if(img) {
      img.remove();
    }
    var img = document.getElementById('boxid'+i);
    var msg = document.getElementById('msg'+i);
  }

  const resetParas = document.querySelectorAll('.resultParas p');
  for (const resetPara of resetParas) {
    resetPara.textContent = '';
  }
}

var p1s = 0;
var p1sprev=0;
var p2s = 0;
var p2sprev=0;
var curPlayer = 1;
var guessCount = 1;
var reverse = false;

const guessSubmit = document.querySelector('.guessSubmit');
let resetButton;

function checkGuess() {
      // let randomNumber = Math.floor(Math.random() * 100) + 1;
      const p1score = document.querySelector('.p1score');
      const p2score = document.querySelector('.p2score');
      const p1guesses = document.querySelector('.p1guesses');
      const p1guesses2 = document.querySelector('.p1guesses2');
      const p2guesses = document.querySelector('.p2guesses');
      const p2guesses2 = document.querySelector('.p2guesses2');
      const lastResult = document.querySelector('.lastResult');
      const lowOrHi = document.querySelector('.lowOrHi');
      const player = document.querySelector('.player');
      const ruby = document.querySelector('.ruby');

      const guessField = document.querySelector('.guessField');
      // player.textContent = "Player: " + curPlayer + " - Guess Number: " + guessCount;
      p2score.textContent = "Player 1: " + player1 + "< ---------- >" + "Player 2: " + player2;
      player.textContent = "Player: " + curPlayer + " - Guess Number: " + guessCount;
      // player.textContent = "Player: " + "1" + "< ---------- >" + "Player: " + "2" ;
      
      const userGuess = Number(guessField.value);
      // const userGuess2 = Number(guessField2.value) - 1;
      if (guessCount == 1) {
        // p1guesses.textContent = 'P1 guesses:     ';
        // p1guesses2.textContent = 'P1 guesses box: ';
        // p2guesses.textContent = 'P2 guesses:     ';
        // p2guesses2.textContent = 'P2 guesses box: ';
        // p2score.textContent = 'P2 score: ';
        // p1score.textContent = 'P1 score: ';
        p1guesses.textContent = '';
        p1guesses2.textContent = ' ';
        p2guesses.textContent = '';
        p2guesses2.textContent = '';
        p2score.textContent = '';
        p1score.textContent = ' ';
      }
      console.log("selectedBox: " + selectedBox);
      // console log the type of selectedBox
      console.log(typeof selectedBox);
      if (curPlayer === 1) {
        // p1guesses.textContent += userGuess + ' ';
        // p1guesses2.textContent += (selectedBox + 1) + ' ';
        p1guesses.textContent += ' ';
        p1guesses2.textContent += ' ';
      } else {
        // p2guesses.textContent += userGuess + ' ';
        // p2guesses2.textContent += (selectedBox + 1) + ' ';
        p2guesses.textContent += ' ';
        p2guesses2.textContent += ' ';
      }

      if (userGuess <= rubies_in_each_box[selectedBox]) {
        lastResult.textContent = 'Great';
        lastResult.style.backgroundColor = 'green';
        lowOrHi.textContent = '';
        rubies_in_each_box[selectedBox] -= userGuess;
        if (curPlayer === 1) {p1s = p1s + userGuess;}
        if (curPlayer === 2) {p2s = p2s + userGuess;}
        // setGameOver();
      } else if (guessCount === 5) {
        lastResult.textContent = '!!!GAME OVER!!!';
        lowOrHi.textContent = '';
        if (p1s > p2s) {
          lowOrHi.textContent = 'p1 -> WINNER';
        }
        else if (p1s < p2s) {
          lowOrHi.textContent = 'p2 -> WINNER';
        }
        else {
          lowOrHi.textContent = 'DRAW';
        }

        setGameOver();
      } else {
        lastResult.textContent = 'Too Many!';
        lastResult.style.backgroundColor = 'red';
        // if (userGuess < randomNumber) {
        //   lowOrHi.textContent = 'Last guess was too low!';
        // } else if (userGuess > randomNumber) {
        //   lowOrHi.textContent = 'Last guess was too high!';
        // }
      }
      
      console.log("P1S:"+p1s);
      console.log("P2S:"+p2s);

      // print current score using lowOrHi
      lowOrHi.textContent = player1 + ' ' + 'score: ' + p1s + ' <-------> ' + player2 + ' '+' score: ' + p2s;
      makeRubies();
      p1sprev=p1s;
      p2sprev=p2s;
      if (guessCount){
        // p1score.textContent += p1s + ' -> ';
        // p2score.textContent += p2s + ' -> ';
        p1score.textContent += ' ';
        p2score.textContent += ' ';
      }
      
      // ruby.textContent = 'Rubies in each box (remaining) - to hide : \n';
      // ruby.textContent += rubies_in_each_box;
      ruby.textContent = ' ';
      console.log(rubies_in_each_box);

      sum=0;
      console.log(sum);
      for (i=0; i< numBoxes; i++) {sum += rubies_in_each_box[i];}
      console.log(sum);
        if (sum === 0) {
          lastResult.textContent = '!!!GAME OVER!!!';
          lastResult.style.backgroundColor = 'purple';
          if (p1s > p2s) {
            lastResult.textContent = 'Player 1 is the WINNER';
          }
          else if (p1s < p2s) {
            lastResult.textContent = 'Player 2 is the WINNER';
          }
          else {
            lastResult.textContent = 'DRAW';
          }
          setGameOver();
        }

      if (curPlayer == 1) {
        curPlayer = 2;
      } else {
        curPlayer = 1;
      }
    
      guessCount++;
      guessField.value = '';
      guessField.focus();
    }

    if(guessSubmit) {
      guessSubmit.addEventListener('click', checkGuess);
    }

    function setGameOver() {
      guessField.disabled = true;
      guessSubmit.disabled = true;
      resetButton = document.createElement('button');
      resetButton.textContent = 'Start new game';
      document.body.appendChild(resetButton);
      resetButton.addEventListener('click', resetGame);
    }

    function resetGame() {
      guessCount = 1;
      const resetParas = document.querySelectorAll('.resultParas p');
      for (const resetPara of resetParas) {
        resetPara.textContent = '';
      }

      if(resetButton) {
        resetButton.parentNode.removeChild(resetButton);
      }
      guessField.disabled = false;
      guessSubmit.disabled = false;
      guessField.value = '';
      guessField.focus();
      lastResult.style.backgroundColor = 'white';
      randomNumber = Math.floor(Math.random() * 100) + 1;
}