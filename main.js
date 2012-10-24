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
	['player1', null, null, null, null],
	[null, null, null, null, null],
	[null, null, null, null, null],
	[null, null, null, null, null],
	[null, null, null, null, 'player2']
];




/* Start game */
$(document).ready(function(){
	$("a").click(function(){
		pressButton($(this).attr('id'));
	});

	// Sprites	
	img_player = loadImage("images/player.png");
	
	// Must ensure images are loaded before drawing
	img_player.onload = function() {
	  drawMap();
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
	
	var item = g_map[x][y];
	//console.log("(" + x + "," + y + "): " + item);
	ctx.beginPath();
	ctx.rect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);

	// choose color based on what's in the square
	if (item == null) {
		ctx.fillStyle="#E0E0E0";	// Light Gray
		ctx.fill();
	} else if (item == "player1") {
		ctx.fillStyle="yellow";
		ctx.fill();
		ctx.drawImage(img_player, x*TILE_SIZE, y*TILE_SIZE);
	} else if (item == "player2") {
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