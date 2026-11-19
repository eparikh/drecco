
function w_get_board(mboard, x, y) {
  if(x < 0 || x >= mboard.length - 1 ||
     y < 0 || y >= mboard.length - 1) {
    return -1;
  } else {
    return mboard[y][x];
  }
}

function w_can_place(mboard, x, y) {
  return w_get_board(mboard, x, y) == 0 &&
         (w_get_board(mboard, x + 1, y) > 0 ||
          w_get_board(mboard, x - 1, y) > 0 ||
          w_get_board(mboard, x, y - 1) > 0 ||
          w_get_board(mboard, x, y + 1) > 0);
}

function w_score_location(mboard, x, y) {
  let counts = [[0,0,0,0],[0,0,0,0]];
  let tmp = [w_get_board(mboard, x - 1, y),
             w_get_board(mboard, x + 1, y),
             w_get_board(mboard, x, y - 1),
             w_get_board(mboard, x, y + 1)];
  let rt = [0,0,0,0];
  for(let i = 0; i < 4; i++) {
    rt[tmp[i] + 1]++;
  }
  if(rt[0] > 0 || (rt[2] > 0 && rt[3] > 0)) {
    return counts;
  } else if(rt[2] > 0) {
    counts[0][rt[2] - 1] = 1;
  } else if(rt[3] > 0) {
    counts[1][rt[3] - 1] = 1;
  }
  return counts;
}

// TO DO, corners stuff
function w_score_board(mboard, current_turn) {
  let counts = [[0,0,0,0],[0,0,0,0]];
  for(let y = 1; y < mboard.length - 1; y++) {
    for(let x = 1; x < mboard.length - 1; x++) {
      let local_count = w_score_location(mboard, x, y);
      for(let i = 0; i < 2; i++) {
        for(let j = 0; j < 4; j++) {
          counts[i][j] += local_count[i][j];
        }
      }
    }
  }
  let temp_score = 0;
  if(counts[0][2] > 1) {
    temp_score += 100;
  }
  if(counts[1][2] > 1) {
    temp_score += -100;
  }
  if(mboard[0][0] > 0) { temp_score += 10000 * (current_turn ? 1 : -1);}
  if(mboard[mboard.length - 1][0] > 0) { temp_score += 10000 * (current_turn ? 1 : -1);}
  if(mboard[0][mboard.length - 1] > 0) { temp_score += 10000 * (current_turn ? 1 : -1);}
  if(mboard[mboard.length - 1][mboard.length - 1] > 0) { temp_score += 10000 * (current_turn ? 1 : -1);}

  return temp_score + (counts[0][0] - counts[1][0]) + 4 * (counts[0][1] - counts[1][1]) + 16 * (counts[0][2] - counts[1][2]) + 10000 * (counts[0][3] - counts[1][3]);
}

function w_determine_next_move(mboard, current_turn, difficulty, toplvl) {
  // TO DO
  let bm, bs;
  let initial = true;
  for(let y = 0; y < mboard.length; y++) {
    for(let x = 0; x < mboard.length; x++) {
      if(w_can_place(mboard, x, y)) {
        mboard[y][x] = current_turn;
        let temp_score = w_score_board(mboard);
        if(difficulty > 0 && temp_score < 3000 && temp_score > -3000) {
          temp_score = w_determine_next_move(mboard, (current_turn == 1 ? 2 : 1), difficulty - 1, false);
        }
        if(current_turn == 1 && (initial || temp_score > bs)) {
          bm = {x: x, y: y};
          bs = temp_score;
          initial = false;
        }
        if(current_turn == 2 && (initial || temp_score < bs)) {
          bm = {x: x, y: y};
          bs = temp_score;
          initial = false;
        }
        mboard[y][x] = 0;
      }
    }
  }
  if(toplvl) {
    return bm;
  } else {
    return bs;
  }
}

onmessage = function(event) {
  console.log(event.data);
  let longboard = event.data.boardstr.split(",");
  let mboard = [];
  let id = 0;
  for(let i = 0; i < event.data.board_width; i++) {
    mboard.push([]);
    for(let j = 0; j < event.data.board_width; j++) {
      console.log(longboard[id]);
      mboard[mboard.length - 1].push(Number(longboard[id]));
      id++;
    }
  }
  next_move = w_determine_next_move(mboard, event.data.current_turn, event.data.difficulty, true);
  postMessage({next_move: next_move});
}
