// Create the canvas
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 400;
document.body.appendChild(canvas); //attach canvas to document

// Game objects
var paddle, bricks, ball;

// Variables
var score, stage; 
var gameReady;
var row, col;
var ballLimit;

// Game images
var gameoverImage = new Image();
gameoverImage.src = "bear.jpg";
var newImage = new Image();
newImage.src = "cat.jpg";

var init = function() {
	ballLimit = 5;
	// paddle object
	paddle = {
		speed: 1024, // movement in pixels per second
		x: (canvas.width)/2, 
		y: canvas.height-10, 
		w: 100, 
		h: 10
	};
	
	// bricks object
	bricks = [];
	row = 6;
	col = canvas.width/50;
	var lv = 0;
	for (var i=0; i<row; i++) {
		lv++;
		for (var j=0; j<col; j++) {
			bricks.push({
				x: 0 + j*50,
				y: 50 + i*20,
				w: 50,
				h: 20,
				level: lv 
			});
		}
	}
	
	// ball object
	ball = [];
	for (var i=0; i<1; i++) {
		ball.push({
			x: (canvas.width-5)/2,
			y: canvas.height-20,
			w: 20,
			h: 20,
			xDir: 0,
			yDir: 1
		});
	}

	// Game setting
	score = 0;
	stage = 1;	
	
	// Switches
	gameReady = 0;
};

// Handling keyboard input
var keysDown = {}	
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Handling keyboard input
$(document).keypress(function (e) {
    if (e.which == 13 && gameReady == 1) { // Player holding enter 
		init();
		gameReady = 0;
        main();
    }
	if (e.which == 8) { // Player holding backspace
		addBall();
	}
});	

// Collision detection
var AABB = function(ax,ay,aw,ah,bx,by,bw,bh) {
	return ax < bx+bw && bx < ax+aw && ay < by+bh && by < ay+ah;			
};

// Update position of all objects
var update = function (elapsedTime) {
	// Player pressing left arrow key
	if (37 in keysDown) { 
		paddle.x -= paddle.speed * elapsedTime;
		if (paddle.x <= 0) {
			paddle.x = 0;
		}
	}
	// Player pressing right arrow key
	if (39 in keysDown) { 
		paddle.x += paddle.speed * elapsedTime;
		if (paddle.x+paddle.w >= canvas.width) {
			paddle.x = canvas.width-paddle.w;
		}
	}
	/*
	// Player pressing Up arrow key
	if (38 in keysDown) { 
		addBall();
	}
	// Player pressing Down arrow key
	if (40 in keysDown) { 
		var random = 0;
		if (Math.random() <= 0.5) {
			random = -100*Math.random()
		}
		else {
			random = 100*Math.random()
		}
		paddle.w = paddle.w + random;
	}
	*/
	var a = [];
	for (var i=0; i<ball.length; i++) {
		a.push(ball[i]);
		// If ball reaches top of screen
		if (a[i].y < 0) {
			a[i].yDir = -1;
		}
		// If ball reaches bottom of screen 
		if (a[i].y > paddle.y) {
			ball.splice(i,1);
			ballLimit--;
		}
		// If ball reaches right of screen
		if (a[i].x < 0) {
			a[i].xDir = -1;
		}
		// If ball reaches left of screen
		if (a[i].x > canvas.width-a[i].w) {
			a[i].xDir = 1;
		}
		// If ball hits another ball
		for (var j=i+1; j<ball.length; j++) {
			b[j] = ball[j];
			if (AABB(a[i].x,a[i].y,a[i].w,a[i].h,b[j].x,b[j].y,b[j].w,b[j].h)) {
				a[i].yDir = -a[i].yDir;
				b[j].yDir = -b[j].yDir;
				a[i].xDir = -2*a[i].xDir;
				b[j].xDir = -2*b[j].xDir;
			}
		}
		// If ball hits bricks
		for (var j=0; j<bricks.length; j++) {
			b = bricks[j];
			if (AABB(a[i].x,a[i].y,a[i].w,a[i].h,b.x,b.y,b.w,b.h)) {
				// Upper left side of ball
				if (AABB(a[i].x,a[i].y+0.5*a[i].h,0.5*a[i].w,0.5*a.h,b.x,b.y,b.w,b.h)) {
					a[i].xDir = 0.3*Math.random();
					a[i].yDir = 1;
				}
				// Lower left side of ball
				else if (AABB(a[i].x+0.5*a[i].w,a[i].y,0.5*a[i].w,0.5*a.h,b.x,b.y,b.w,b.h)) {
					a[i].xDir = -0.3*Math.random();
					a[i].yDir = -1;
				}
				// Lower Right side of ball
				else if (AABB(a[i].x,a[i].y,0.5*a[i].w,0.5*a[i].h,b.x,b.y,b.w,b.h)) {
					a[i].xDir = 0.3*Math.random();
					a[i].yDir = -1;
				}
				// Upper right side of ball
				else if (AABB(a.x+0.5*a[i].y,a[i].y+0.5*a[i].h,0.5*a[i].w,0.5*a.h,b.x,b.y,b.w,b.h)) {
					a[i].xDir = -0.3*Math.random();
					a[i].yDir = 1
				}
				else {
					a[i].yDir = -a[i].yDir;
				}
				bricks.splice(j,1);
				score += 100;
			}
		}
		// If ball hits paddle
		if (AABB(a[i].x,a[i].y,a[i].w,a[i].h,paddle.x,paddle.y,paddle.w,paddle.h)) {
			a[i].yDir = 1;
		}
		// Let ball move up or down
		a[i].y -= 3*a[i].yDir;
		// Let ball move right or left
		if (a[i].xDir === 0) {
			a[i].xDir = -0.3*Math.random();
		}
		a[i].x -= 3*a[i].xDir;
	}
	
	// If all bricks are broken
	if (bricks.length === 0) {
		var keepscore = score;
		var keepstage = stage;
		var keepballLimit = ballLimit;
		init(); 
		score = keepscore;
		stage = keepstage + 1;
		ballLimit = keepballLimit + 1;
		if (ballLimit > 5) {
			ballLimit = 5;
		}
	}
};

// Draw all objects on screen	
var render = function () {
	context.clearRect(0,0,canvas.width,canvas.height);
	// Draw paddle
	context.fillStyle = "#FFFFFF";
	context.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
	// Draw bricks
	for (var i=0; i<bricks.length; i++) {
		switch(bricks[i].level) {
    		case 1:
        		context.fillStyle = "#00FFFF";
        		break;
    		case 2:
        		context.fillStyle = "#FFFF00";
        		break;
        	case 3:
        		context.fillStyle = "#FF00FF";
        		break;
        	case 4:
        		context.fillStyle = "#0000FF";
        		break;
    		case 5:
        		context.fillStyle = "#00FF00";
        		break;
        	case 6:
        		context.fillStyle = "#FF0000";
        		break;
		}
		context.fillRect(bricks[i].x, bricks[i].y, 48, 19);
	}
	// Draw ball
	for (var i=0; i<ball.length; i++) {
		context.fillStyle = "#FFFAF0";
		context.fillRect(ball[i].x,ball[i].y,ball[i].w,ball[i].h);
	}
};
	
var gameover = function() {
	gameReady = 1;
	context.clearRect(0,0,canvas.width,canvas.height);
	context.drawImage(gameoverImage,0,0,canvas.width,canvas.height);
};

var newScreen = function() {
	gameReady = 1;
	context.clearRect(0,0,canvas.width,canvas.height);
	context.drawImage(newImage,0,0,canvas.width,canvas.height);
};

var addBall = function () {
	if (ball.length < ballLimit) {
		ball.push({
			x: canvas.width*Math.random(),
			y: 0,
			w: 20,
			h: 20,
			xDir: 0,
			yDir: 1
		});
	} 
}

// Recursive main execution		
var then = Date.now();
var main = function () {
	var now = Date.now();
	var delta = now - then;
	
	update(delta / 1000);
	render();
	then = now;

	document.getElementById("bricks").innerHTML = bricks.length;
	document.getElementById("score").innerHTML = score;
	document.getElementById("stage").innerHTML = stage;
	document.getElementById("ballNum").innerHTML = ball.length;
	document.getElementById("ballLimit").innerHTML = ballLimit;
	
	if (ball.length == 0) {
		gameover();
	}
	requestAnimationFrame(main);
};
				
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

w.onload = function() {
	newScreen();
	gameReady = 1;
}