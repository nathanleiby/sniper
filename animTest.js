// from: http://blogs.msdn.com/b/davrous/archive/2012/03/16/html5-gaming-animating-sprites-in-canvas-with-easeljs.aspx

var canvas;
var stage;
var screen_width = 500;
var screen_height = 100;
var imgMonsterARun = new Image();
var imgMonsterAIdle = new Image();
var bmpAnimation;
var imagesLoaded = 0;

function init() {
	console.log("init - start");
	canvas = document.getElementById("game_map");
	// grab canvas width and height for later calculations:
	screen_width = canvas.width;
	screen_height = canvas.height;

	imgMonsterARun.onload = HandleImageLoad;
	imgMonsterAIdle.onload = HandleImageLoad;
	// imgMonsterARun.onerror = HandleImageError;
	imgMonsterARun.src = "images/MonsterARun.png";
	imgMonsterAIdle.src = "images/MonsterAIdle.png";

	console.log("init - end");
}


function HandleImageLoad() {
	imagesLoaded++
	console.log("imagesLoaded == " + imagesLoaded);
	if (imagesLoaded == 2){
		imagesLoaded = 0;
		startGame();	
	}
}

function startGame() {
	console.log("start game");
	stage = new createjs.Stage(canvas);
	
	console.log("HandleImageLoad - begin");
	var spriteSheet = new createjs.SpriteSheet({
		images: [imgMonsterARun],
		frames: {width: 64, height:64, regX: 32, regY: 32},
		animations: {
			walk: [0,9, "walk", 4]
		}
	});

	createjs.SpriteSheetUtils.addFlippedFrames(spriteSheet, true, false, false);

	var spriteSheetIdle = new createjs.SpriteSheet({
	    images: [imgMonsterAIdle],
	    frames: { width: 64, height: 64, regX: 32, regY: 32 }, 
	    animations: {
	        idle: [0, 10, "idle", 4]
	    }
	});

	bmpAnimation = new createjs.BitmapAnimation(spriteSheet);
	bmpAnimation.gotoAndPlay("walk_h"); // starting animation
	bmpAnimation.shadow = new createjs.Shadow("#454", 0, 5, 4);
	bmpAnimation.name = "monster1";
	bmpAnimation.direction = 90;
	bmpAnimation.vX = 1;
	bmpAnimation.x = 16;
	bmpAnimation.y = 32;

	bmpAnimationIdle = new createjs.BitmapAnimation(spriteSheetIdle);
	bmpAnimationIdle.name = "monster1";
	bmpAnimationIdle.x = 16;
	bmpAnimationIdle.y = 32;

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
        bmpAnimation.gotoAndPlay("walk");
    }

    if (bmpAnimation.x < 16) {
        // We've reached the left side of our screen
        // We need to walk right now
        // bmpAnimation.direction = 90;
        // bmpAnimation.gotoAndPlay("walk_h");

        // Add idling
        bmpAnimation.direction = 90;
        bmpAnimation.gotoAndStop("walk");
        stage.removeChild(bmpAnimation);
        bmpAnimationIdle.gotoAndPlay("idle");
        stage.addChild(bmpAnimationIdle);
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