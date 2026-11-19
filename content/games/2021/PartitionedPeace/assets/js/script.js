
// VARIABLES

var chart;

var canvas = document.getElementById('myChart');
var ctx = canvas.getContext("2d");

var results = document.getElementById("results");
var curr_score = document.getElementById("info-score");
const line_color = 'rgba(0,0,155, 0.1)';

var N = parseInt(document.getElementById("info-n").value);
var max_roads = parseInt(document.getElementById("info-max-r").value);
var swapScore = parseInt(document.getElementById("info-swap").value);
var addLineScore = parseInt(document.getElementById("info-road").value);

var score = 0;
var size = N + 1;
var line_count = 0;

curr_score.innerHTML = score;

var reds = [];
var blues = [];
var vlines = {};
var hlines = {};
var new_lines = 2 * N + 4;

var selected = [];
var unique = [];

var statelist = [];



function toggleRules() {
  var x = document.getElementById("rules");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function saveState() {
    console.log("Data: ")
    console.log(chart.data.datasets);
    statelist.push({"reds": reds.slice(), "blues": blues.slice(), "data": JSON.parse(JSON.stringify(chart.data.datasets)), "score": score, "line_count": line_count});
    console.log(statelist.length);
    console.log(statelist);
    return true;
}

function undo() {

    return true;
    // if(statelist.length <= 1){
    //     return false;
    // }
    // console.log("Undo");
    // statelist.pop();
    // var prevState = statelist[statelist.length - 1];
    // console.log(prevState);
    // reds = JSON.parse(JSON.stringify(prevState["reds"]));
    // blues = JSON.parse(JSON.stringify(prevState["blues"]));
    // score = JSON.parse(JSON.stringify(prevState["score"]));
    // line_count = JSON.parse(JSON.stringify(prevState["line_count"]));
    // chart.data.datasets = JSON.parse(JSON.stringify(prevState["data"]));
    // chart.update();
    // selected = [];
    // unique = [];
    // results.innerHTML = "";
    // curr_score.innerHTML = getScore();
    // console.log(statelist.length);
    // return true;

}

function reset() {
    chart.destroy();
    while(statelist.length > 0) {
        statelist.pop();
    }

    N = parseInt(document.getElementById("info-n").value);
    max_roads = parseInt(document.getElementById("info-max-r").value);
    swapScore = parseInt(document.getElementById("info-swap").value);
    addLineScore = parseInt(document.getElementById("info-road").value);

    score = 0;
    size = N + 1;
    line_count = 0;

    curr_score.innerHTML = score;

    reds = [];
    blues = [];
    vlines = {};
    hlines = {};
    new_lines = 2 * N + 4;

    selected = [];
    unique = [];
    create_chart();
}

function getScore() {
    return score;
}

function getManhattanDist(point1, point2) {
    return Math.abs(point1["x"] - point2["x"]) + Math.abs(point1["y"] - point2["y"]);
}

function swap() {
    if (selected.length > 1) {
        var vals = selected.slice(-2);
        console.log("vals");
        console.log(vals);
        var res = swapPoints(vals[0], vals[1]);
        if(res){
            document.getElementById("road-btn").innerHTML = "Select road";
            document.getElementById("swap-btn").innerHTML = "Select houses";
            console.log("Swap Successful");
            saveState();
        }
        selected = [];
        unique = [];
        results.innerHTML = "";
        curr_score.innerHTML = getScore();
        return true;
    }
    results.innerHTML = "Please select 2 houses to swap";
    return false;
}

function newline() {
    if (selected.length > 1) {
        var vals = selected.slice(-2);
        var res = addLine(vals[0], vals[1]);
        if(res){
            document.getElementById("road-btn").innerHTML = "Select road";
            document.getElementById("swap-btn").innerHTML = "Select houses";
            console.log("Newline Successful");
            saveState();
        }
        selected = [];
        unique = [];
        if (res)
            results.innerHTML = "";
        curr_score.innerHTML = getScore();
        return true;
    }
    results.innerHTML = "Please select 2 houses to build a road";
    return false;
}

function checkLimit(point, direction, size = 5){
    var x = point["x"] + direction[0];
    var y = point["y"] + direction[1];

    if(x < 0 || x >= size){
        return false;
    }
    if (y < 0 || y >= size){
        return false;
    }
    return true;

}

function submit() {
    // add path checker
    // create a red & a blue adjacency list
    red = adjacencyList("reds");
    blue = adjacencyList("blues");
    //run bfs on both and return true iff bfs on both colors returns true
    var valid = bfs(red) && bfs(blue);
    var score = 0;
    var config;
    if (valid)
    {
        score = getScore();
        config = "Valid";
    }
    else
    {
        score = 100000;
        config = "Invalid";
    }
    results.innerHTML = "Configuration: " + config + "<br>Score: " + score;
    curr_score.innerHTML = score;
}

function getVertex(vertex, size = 5){
    return (size* vertex["x"]) + vertex["y"];
}

function adjacencyList(color){

    var data = getState();
    var points = data[color];
    var roads = data["lines"];
    var directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]
    const adList = {};
    for(let i = 0; i < points.length; i++) {
        adList[getVertex(points[i], size)] = []
    }
    for (let i = 0; i < points.length; i++) {
        for(let j = 0; j < 4; j++){
            if(checkLimit(points[i], directions[j], size)) {
                var neigh = {}
                neigh["x"] = points[i]["x"] + directions[j][0];
                neigh["y"] = points[i]["y"] + directions[j][1];
                if(getVertex(neigh, size) in adList) {
                    adList[getVertex(points[i], size)].push(getVertex(neigh, size));
                }
            }
        }
    }
    for(let i = 0; i < roads.length; i++){
        var start = roads[i]["data"][0];
        var end = roads[i]["data"][1];
        start = {"x": start[0], "y": start[1]};
        end = {"x": end[0], "y": end[1]};
        if(getVertex(start, size) in adList && getVertex(end, size) in adList) {
            adList[getVertex(start, size)].push(getVertex(end, size));
            adList[getVertex(end, size)].push(getVertex(start, size));
        }
    }
    return adList;
}

function bfs(adList) {

    if(isEmpty(adList)) {
        return  true;
    }
    var start = parseInt(Object.keys(adList)[0]);
    var queue = [start];
    const visited = [start];
    var curr = start;
    while(queue.length > 0){
        curr = queue[0];
        queue.shift();
        let neighbours = adList[curr];
        for(let i = 0; i < neighbours.length; i++){
            if (!visited.includes(neighbours[i])){
                    queue.push(neighbours[i]);
                    visited.push(neighbours[i]);
            }
        }
    }
    //return true only if we have visited all the vertices in the adjacency list
    for(var key in adList){
        if(!visited.includes(parseInt(key))){
            return false;
        }
    }
    return true;

}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}


function getPoint(point) {
    if(point["datasetIndex"] == 0)
        return reds[point["index"]];
    else
        return blues[point["index"]];
}

function addLine(point1, point2) {
    if (line_count >= max_roads)
    {
        console.log("Line: "+line_count);
        console.log("Max: "+ max_roads);

        results.innerHTML = "Max limit reached, cannot build more roads";
        return false;
    }
    var color;
    if(point1["datasetIndex"] == 0 && point2["datasetIndex"] == 0)
        color = 'rgba(255,0,0,0.3)';
    else if(point1["datasetIndex"] == 1 && point2["datasetIndex"] == 1)
        color = 'rgba(0,0,255, 0.3)';
    else
        color = 'rgba(0,255,0, 0.3)';

    var point1 = getPoint(point1);
    var point2 = getPoint(point2);

    var new_data = {
        type: "line",
        data: [[point1["x"], point1["y"]], [point2["x"], point2["y"]]],
        fill: false,
        borderColor: color
    };
    chart.data.datasets.push(new_data);
    chart.update();

    line_count++;

    // Update the Score
    score = score + (getManhattanDist(point1, point2) * addLineScore);

    return true;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomPoints(){

    var point = [];
    let r_size = chart.data.datasets["0"]["data"].length;
    let b_size = chart.data.datasets["1"]["data"].length;
    point.push({"datasetIndex": 0, "index": getRandomInt(r_size)});
    point.push({"datasetIndex": 1, "index": getRandomInt(b_size)});
    console.log(point);
    return point
}

function RandomLayout(){
    var swap_ = getRandomInt(max_roads);
    for(let i = 0; i < swap_; i++)
    {
        var points = getRandomPoints();
        swapPoints(points[0], points[1]);
    }
    score = 0;

}

function swapPoints(point1, point2) {
    var swap1, swap2;
    var swap1_index, swap2_index;
    var point1_swap, point2_swap;

    if (point1["datasetIndex"] === 0)
        swap1 = 0;
    else swap1 = 1;

    if (point2["datasetIndex"] === 0)
        swap2 = 0;
    else swap2 = 1;

    swap1_index = point1["index"];
    swap2_index = point2["index"];


    point1_swap = getPoint(point2);
    point2_swap = getPoint(point1);

    chart.data.datasets[swap1].data[swap1_index] = point1_swap;
    chart.data.datasets[swap2].data[swap2_index] = point2_swap;

    chart.update();

    //Update Score
    score = score + swapScore;

    return true;

}

function getState() {
    return {"reds": chart.data.datasets["0"]["data"], "blues": chart.data.datasets["1"]["data"], "lines": chart.data.datasets.slice(new_lines, )};
}



function create_chart() {
    for (var i = 0; i <= N; i++) {
        for (var j = 0; j <= N; j++) {
        if (i in vlines)
            vlines[i].push([i, j]);
        else
            vlines[i] = [[i,j]];

        if (j in hlines)
            hlines[j].push([i, j]);
        else
            hlines[j] = [[i,j]];
        if((i + j) % 2 == 0)
                reds.push({x: i,y: j});
            else
                blues.push({x: i,y: j});
        }
    }

    const datasets = [{
            type: 'scatter',
            label: "reds",
            data: reds,
            pointRadius: 7,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132)'
        }, {
            type: 'scatter',
            label: "blues",
            data: blues,
            pointRadius: 7,
            fill: false,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgb(54, 162, 235)'

        }
    ];

    for(line in hlines)
        datasets.push({
            type: "line",
            data: hlines[line],
            fill: false,
            borderColor: line_color
        });

    for(line in vlines)
        datasets.push({
            type: "line",
            data: vlines[line],
            fill: false,
            borderColor: line_color
        });

    const data = {
        datasets: datasets
        };

    const config = {
        type: 'scatter',
        data: data,
        options: {
            plugins: {
                tooltip: {
                    filter: function (tooltipItem) {
                        return tooltipItem.datasetIndex in [0, 1];
                    }
                },
                legend: {
                    display: false
                },                
            },
            tooltips: {
                callbacks: {
                   label: function(tooltipItem) {
                          return tooltipItem.yLabel;
                   }
                }
            },
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: N + 1
                    },
                },
                y: {
                    ticks: {
                        maxTicksLimit: N + 1
                    }
                }
            },

            animation: {
                duration: 0
            },
            
            events: ['click'],

            responsive: true,
            maintainAspectRatio: false
        }
    };

    chart = new Chart(ctx, config);
    RandomLayout();
    saveState();
}

create_chart();

canvas.onclick = function (evt) {
    var points = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);

    if (points.length) {
        var point = null;
        for (element in points) {
            if (points[element]["datasetIndex"] in [0, 1])
            {
                point = points[element];
                break;
            }
        }

        if (unique[unique.length - 1] != getPoint(point))
        {
            unique.push(getPoint(point));
            selected.push(point); 
        }
        var str = "";
        const last_two = unique.slice(-2);
        for (ele in last_two)
            str += "(" + last_two[ele]["x"] + ", \t" + last_two[ele]["y"] + ")<br>";
        results.innerHTML = str;

        if (selected.length > 1)
        {
            document.getElementById("swap-btn").innerHTML = "Swap Selected";
            document.getElementById("road-btn").innerHTML = "Build Road";
        }
        return point;
    }

};
