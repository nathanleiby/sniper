$(document).ready(function(){
	$("a").click(function(){
		pressButton($(this).attr('id'));
	});
	drawMap();
});

// Global Map state
var TILE_SIZE = 50;
var MAP_X = 5;
var MAP_Y = 5;
var g_map = 
[
	['player1', null, null, null, null],
	[null, null, null, null, null],
	[null, null, null, null, null],
	[null, null, null, null, null],
	[null, null, null, null, 'player2']
];

// Main Game Loop
// Waiting for input should be async. Must allow response to mouse events
function loop() {
	// check whose turn it is
	// draw canvas and game state (depends on current player)
	// wait for action...
		// (if 0 actions remainig, only choice is to "end turn")
		// execute action
		// wait for responses to sub actions (e.g. shoot... where? legal move?)
	// update and save game state (whose turn, actions remaining, etc)
}

function pressButton(buttonId) {
	console.log(buttonId);
	
	// Fire appropriate event
	switch (buttonId) {
		case 'btn_move':
			console.log('initiate move');
			break;
		case 'btn_binoc':
			console.log('initiate binoc');
			break;
		case 'btn_aim':
			console.log('initiate aim');
			break;
		case 'btn_shoot':
			console.log('initiate shoot');
			break;
		default:
			console.log('no event');
			break;
	}
}

function drawMap() {
	// for now, assume NxN grid
	var c=document.getElementById("game_map");
	var ctx=c.getContext("2d");
	for (var x = 0; x < MAP_X; x++) {
		for (var y = 0; y < MAP_X; y++) {
			_drawMapTile(ctx, x, y);
		}
	}
}

function _drawMapTile(ctx, x,y) {
	

	ctx.beginPath();
	ctx.rect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
	var item = g_map[x][y];
	console.log("(" + x + "," + y + "): " + item);
	
	// choose color based on what's in the square
	if (item == null) {
		ctx.fillStyle="white";
	} else if (item == "player1") {
		ctx.fillStyle="yellow";
	} else if (item == "player2") {
		ctx.fillStyle="red";
	} else if (item == "fog") {
		ctx.fillStyle="gray";
	}

	ctx.fill();
	ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}