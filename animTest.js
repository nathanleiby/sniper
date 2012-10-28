// from: http://blogs.msdn.com/b/davrous/archive/2012/03/16/html5-gaming-animating-sprites-in-canvas-with-easeljs.aspx

var canvas;
var stage;
var screen_width = 500;
var screen_height = 100;
var imgMonsterARun = new Image();
var bmpAnimation;

function init() {
	console.log("init - start");
	canvas = document.getElementById("testCanvas");
	// grab canvas width and height for later calculations:
	screen_width = canvas.width;
	screen_height = canvas.height;

	imgMonsterARun.onload = HandleImageLoad;
	// imgMonsterARun.onerror = HandleImageError;
	imgMonsterARun.src = "images/MonsterARun.png";

	console.log("init - end");
}

function HandleImageLoad() {
	startGame();
}

function startGame() {
	console.log("start game");
	stage = new createjs.Stage(canvas);
	
	
	console.log("HandleImageLoad - begin");
	var spriteSheet = new createjs.SpriteSheet({
		images: [imgMonsterARun],
		frames: {width: 64, height:64, regX: 32, regY: 32},
		animations: {
			walk: [0,9, "walk"]
		}
	});

	bmpAnimation = new createjs.BitmapAnimation(spriteSheet);
	bmpAnimation.gotoAndPlay("walk");
	bmpAnimation.shadow = new createjs.Shadow("#454", 0, 5, 4);
	bmpAnimation.name = "monster1";
	bmpAnimation.direction = 90;
	bmpAnimation.vX = 4;
	bmpAnimation.x = 16;
	bmpAnimation.y = 32;

	bmpAnimation.currentFrame = 0;
	stage.addChild(bmpAnimation);

	var f = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
	createjs.Ticker.addListener(window);
	createjs.Ticker.useRAF = true;
	// Best Framerate targeted (60 FPS)
	createjs.Ticker.setFPS(60);
	console.log("HandleImageLoad - end");
}

function tick() {
    // Hit testing the screen width, otherwise our sprite would disappear
    if (bmpAnimation.x >= screen_width - 16) {
        // We've reached the right side of our screen
        // We need to walk left now to go back to our initial position
        bmpAnimation.direction = -90;
    }

    if (bmpAnimation.x < 16) {
        // We've reached the left side of our screen
        // We need to walk right now
        bmpAnimation.direction = 90;
    }

    // Moving the sprite based on the direction & the speed
    if (bmpAnimation.direction == 90) {
        bmpAnimation.x += bmpAnimation.vX;
    }
    else {
        bmpAnimation.x -= bmpAnimation.vX;
    }

    // update the stage:
    stage.update();
}