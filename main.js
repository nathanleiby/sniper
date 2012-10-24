// from: http://www.ccbrothers.com/gamecorner/tutorial.php?tutorial=10
// [name] image file name
function loadImage(name)
{
    // create new image object
    var image = new Image();
    // load image
    image.src = name;
    // return image object
    return image;
}

/* Setup */
// Global Setup vars
var TILE_SIZE = 50;
var DIM = 4;
var MAP_X = DIM;	// TODO: Right now, requires that MAP_X == MAP_Y
var MAP_Y = DIM;
var NUMBER_OF_PLAYERS = 2;

// Global state
var g_map = []	// Game Map
var g_player_turn = -1;	// this will cause it to start with player 0 
var g_click_mode = null;
var g_is_alive = [];

// Player-specific state
var g_players = {
	'player0': {
		has_seen: {},
		last_saw: {'player1': [3,3]}
	}
}

// Initalize Map and player locations
function initMap() {
	var row = [];
	for (var i = 0; i < MAP_X; i++) {
		row.push(null);
	}
	for (var j = 0; j < MAP_Y; j++) {
		// slice to prevent pointing to same obj
		g_map.push(row.slice());
	}

	g_map[0][0] = 'player0';
	g_map[MAP_X - 1][MAP_Y - 1] = 'player1';
}

/* Start game */
$(document).ready(function(){
	initMap();

	// Event Listeners
	// Listen for clicks on move, binoc, aim, and shoot buttons
	$("a").click(function(){
		OnButtonClick($(this).attr('id'));
	});

	// Listen for mouse clicks on canvas
	gCanvas = document.getElementById("game_map");
	gCanvas.width = MAP_X * TILE_SIZE;
	gCanvas.height = MAP_Y * TILE_SIZE;
	gCanvas.addEventListener("click", OnCanvasClick, false);

	// Sprites	
	img_player = loadImage("images/player.png");
	
	// Must ensure images are loaded before drawing
	img_player.onload = function() {
	  loop();
	}
});

// Main Game Loop
// Waiting for input should be async. Must allow response to mouse events
function loop() {
	g_player_turn = (g_player_turn+1) % NUMBER_OF_PLAYERS;

	// execute action
	// wait for responses to sub actions (e.g. shoot... where? legal move?)
	// update and save game state (whose turn, actions remaining, etc)

	// check whose turn it is

	// draw canvas and game state (depends on current player)
	drawMap();
	// wait for action...

	// $('#game_map').wait(endTurn).then(function () {
	// 	console.log('ended turn');
	// 	loop();
	// });

	// (if 0 actions remainig, only choice is to "end turn")	
}

function OnButtonClick(buttonId) {
	// $('#game_map').trigger('custom', ['Custom', 'Event']);
	console.log(buttonId);
	
	// Fire appropriate event
	switch (buttonId) {
		case 'btn_move':
			console.log('initiate move');
			g_click_mode = 'move';
			// TODO: Add an animation during move() ... sweetsauce
			break;
		case 'btn_binoc':
			console.log('initiate binoc');
			break;
		case 'btn_aim':
			console.log('initiate aim');
			break;
		case 'btn_shoot':
			console.log('initiate shoot');
			g_click_mode = 'shoot';
			break;
		default:
			console.log('no event');
			break;
	}
}

function drawMap() {
	// for now, assume NxN grid
	var ctx = gCanvas.getContext("2d");
	
	for (var x = 0; x < MAP_X; x++) {
		for (var y = 0; y < MAP_X; y++) {			
			_drawMapTile(ctx, x, y);
		}
	}
}

function _drawMapTile(ctx, x,y) {
	
	var item = g_map[x][y];
	//console.log("(" + x + "," + y + "): " + item);
	ctx.beginPath();
	ctx.rect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);

	// choose color based on what's in the square
	// if (item == null) {
	
	var currentPlayerPosition = getPlayerLocation(g_player_turn);

	if (item == null && isAdjacent([x,y], currentPlayerPosition)) {	// Fog of war
		ctx.fillStyle="#E0E0E0";	// Light Gray
		ctx.fill();
	} else if (item == "player0") {
		ctx.fillStyle="yellow";
		ctx.fill();
		ctx.drawImage(img_player, x*TILE_SIZE, y*TILE_SIZE);
	} else if (item == "player1") {
		ctx.fillStyle="red";
		ctx.fill();
		// ctx.drawImage(img_player, x*TILE_SIZE, y*TILE_SIZE);
		ctx.drawImage(img_player, x*TILE_SIZE, y*TILE_SIZE);
	} else if (item == "fog") {
		ctx.fillStyle="gray";
		ctx.fill();
	} else {	// Fog of war
		ctx.fillStyle="191919";	// Almost black
		ctx.fill();
	}
	
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'black';
	ctx.stroke();	
}

// Returns player location as [x,y]
function getPlayerLocation(playerId) {
	for (var x = 0; x < MAP_X; x++) {
		for (var y = 0; y < MAP_X; y++) {
			if (g_map[x][y] === 'player' + playerId) {
				return [x,y];
			}
		}
	}
	throw("cannot find player location!");
	// return [0,0];
}

// Tries to set player location
// If valid location, returns true
// If invalid location, returns false
function setPlayerLocation(playerId, x, y) {
	// Check if move is valid
	var oldPlayerLocation = getPlayerLocation(playerId);
	console.log("oldPlayerLocation" + oldPlayerLocation);

	var newPlayerLocation = [x,y];
	console.log("newPlayerLocation" + newPlayerLocation);

	var valid = isValidMove(oldPlayerLocation, newPlayerLocation);
	
	// If so, update player Location
	if (valid) {
		// Be careful! (x,y) inversion in arrays vs coords
		g_map[oldPlayerLocation[0]][oldPlayerLocation[1]] = null;
		g_map[newPlayerLocation[0]][newPlayerLocation[1]] = 'player' + playerId;
		return true;
	}
	return false;
}

// Player 1 shoots gun at targetted square. if occupied, might hit em
function shoot(playerId, x, y) {
	if (! isEmpty ([x,y])) {
		console.log("Hit!");
	} else {
		console.log("Missed...");
	}
	return true;
}

// Takes two points ([x1,y1], [x2,y2])
function isAdjacent(pos1, pos2) {
	var x1 = pos1[0];
	var y1 = pos1[1];
	var x2 = pos2[0];
	var y2 = pos2[1];
	
	// if same location, return false
	if (x1 == x2 && y1 == y2) {
		return false;
	} else if (Math.abs(x1-x2) <= 1 && Math.abs(y1-y2) <= 1) {
		return true;
	} else {
		return false;
	}
}

function isEmpty(pos) {
	var x = pos[0];
	var y = pos[1];
	if (g_map[x][y] === null) {
		return true;
	} else {
		return false;
	}
}

function isValidMove(pos1, pos2) {
	var adj = isAdjacent(pos1, pos2);
	var empty = isEmpty(pos2);
	var v = adj && empty;
	console.log("valid?" + v);
	return v;
}

// Handle mouse events
function OnCanvasClick(e) {
	var cell = getMapCoordsFromMouseClick(e);
	// If validate coordinate
	if (cell) {
		var didAction = false;

		// Respond to various click possibilities: move, binoc, aim, shoot
		if (g_click_mode == 'move') {
			console.log('trying to move');
			didAction = setPlayerLocation(g_player_turn, cell[0], cell[1]);
		} else if (g_click_mode == 'shoot') {
			console.log('trying to shoot');
			didAction = shoot(g_player_turn, cell[0], cell[1]);
		} else {
			console.log('no click mode selected');
		}

		if (didAction)
		{
			// Next action / turn
			g_click_mode = null;
			loop();
		} else {
			console.log('failed to do action');
		}
	}
}

// from: http://answers.oreilly.com/topic/1929-how-to-use-the-canvas-and-draw-elements-in-html5/
// return [x,y]
function getMapCoordsFromMouseClick(e) {
    // Get coordinates relative to top-left of page
    var x;
    var y;
    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    }
    else {
      x = e.clientX + document.body.scrollLeft +
           document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop +
           document.documentElement.scrollTop;
    }

    // Once you have coordinates relative to top-left of page, then offset to recenter on top-left on canvas
    x -= gCanvas.offsetLeft;
	y -= gCanvas.offsetTop;

	var cell = [Math.floor(x/TILE_SIZE), Math.floor(y/TILE_SIZE)]
	console.log(cell);
	
    return cell;
}

// End turn, retrigger game loop
function endTurn() {
	console.log('endTurn()');
}

// TODO: Create a class to Handle all of the UI (canvas, drawing, responding to User Input)

// TODO: Create a class for position coordinates (.x, .y, .coord [x,y])
//	also handle calculations like distance, adjacency, etc

// TODO: Create a class for interacting with the map
//	movePlayer (Point)
//	isOccupied (Point)