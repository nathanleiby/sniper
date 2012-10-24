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
// Global Map state
var TILE_SIZE = 50;
var MAP_X = 5;
var MAP_Y = 5;
var g_map = 
[
	['player0', null, null, null, null],
	[null, null, null, null, null],
	[null, null, null, null, null],
	[null, null, null, null, null],
	[null, null, null, null, 'player1']
];

/* Start game */
$(document).ready(function(){

	// Event Listeners
	// Listen for clicks on move, binoc, aim, and shoot buttons
	$("a").click(function(){
		OnButtonClick($(this).attr('id'));
	});

	// Listen for mouse clicks on canvas
	gCanvas = document.getElementById("game_map");
	gCanvas.addEventListener("click", OnCanvasClick, false);

	// Sprites	
	img_player = loadImage("images/player.png");
	
	// Must ensure images are loaded before drawing
	img_player.onload = function() {
	  loop();
	}
});
 
// [imageObject] this is image object which is returned loadImage
// [x] screen x coordinate
// [y] screen y coordinate
// function drawImage(imageObject, x, y)
// {
//     ctx.drawImage(imageObject, x, y);
// }

// Main Game Loop
// Waiting for input should be async. Must allow response to mouse events
function loop() {

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
	$('#game_map').trigger('custom', ['Custom', 'Event']);
	console.log(buttonId);
	
	// Fire appropriate event
	switch (buttonId) {
		case 'btn_move':
			console.log('initiate move');
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

	// CAREFUL! Flipped x's and y's so that arrays [rol][col] is flipped to match coordinate system
	ctx.rect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);

	// choose color based on what's in the square
	if (item == null) {
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

// Takes two points ([x1,y1], [x2,y2])
function isAdjacent(pos1, pos2) {
	// TODO
	return true;
}

function isValidMove(pos1, pos2) {
	var valid = isAdjacent(pos1, pos2);
	// valid && isEmpty(pos2);
	return valid;
}

// Handle mouse events
function OnCanvasClick(e) {
	var cell = getMapCoordsFromMouseClick(e);
	// If validate coordinate
	if (cell) {
		setPlayerLocation(0, cell[0], cell[1]);	
		loop();
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

	// var cell = new Cell(Math.floor(y/kPieceWidth), Math.floor(x/kPieceHeight));
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