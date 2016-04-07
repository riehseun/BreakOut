// Game objects
var world;

// Variables
var score, stage; 

// Handling keyboard input
var keysDown = {} 

// World Object
var World = function(canvas,context) {
  this.status = 'wait'; //wait, game, end
  this.bricks = []; // array whose elements are also arrays (2D array)
  this.bricksByIndex = [];
  this.balls = [];
  this.paddle = null;
  this.x = 25;
  this.y = 70;
  this.width = 480;
  this.height = 350;
  this.lastTick = 0;
  this.canvas = canvas;
  this.context = context;
  
  this.score = 0;
  this.ball_count = 0;
  this.stage = 0;
  this.image = new Image();
  this.image.src = 'heart.png';
}

var GameElement = function() {
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.height = 0;
};

// Brick Object
var Bricks = function(x,y,width,height) {
  GameElement.call(this);
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.broken = false;  
  this.score = 0;
}

// Paddle Object
var Paddle = function(x,y,width,height,speed) {
  GameElement.call(this);
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;
  this.dir = 0;
  
  this.shrinked = false;
  this.shrink = function() {
    if(this.shrinked) {
      return;
    }
    this.shrinked = true;
    this.width *= 0.75;
  }
}

// Ball Object
var Ball = function(x,y,radi) {
  GameElement.call(this);
  this.prevX = 0;
  this.prevY = 0;
  this.x = x;
  this.y = y;
  this.radius = radi;
  // Initial horizontal and vertical velocities of ball
  this.x_velo = 100;
  this.y_velo = 200;
  // Max speed is needed to prevent balls from passing through paddle
  // Ex) It can move larger distance than the height of paddle in one tick
  this.x_maxVel = 200;
  this.y_maxVel = 400;
  // min speed is needed not to drag the game too much
  this.x_minVel = 50;
  this.y_minVel = 100;
  this.same_dir = 0;

  this.minimum_speed = Math.sqrt(5)*100;
}

World.prototype.init = function() {
  this.clear();
  // j = width for each brick
  for(var j = 40; j < 160; j+= 15) {
    var bricks_row = [];
    // i = height for each brick
    for(var i = 0; i < 480; i += 30) {
      var brick = new Bricks(i,j,30,15);
      brick.score = (j-40)/15 + 1;
      this.bricks.push(brick);
      bricks_row.push(brick);
    }
    this.bricksByIndex.push(bricks_row);
  }
  this.paddle = new Paddle(210,340,60,10,500);

  this.bricksByIndex[1][2].broken = true;
  this.bricksByIndex[2][2].broken = true;
  this.bricksByIndex[3][2].broken = true;
  this.bricksByIndex[4][2].broken = true;
  this.bricksByIndex[5][2].broken = true;
  this.bricksByIndex[6][2].broken = true;
  this.bricksByIndex[1][3].broken = true;
  this.bricksByIndex[3][3].broken = true;
  this.bricksByIndex[6][3].broken = true;
  this.bricksByIndex[2][4].broken = true;
  this.bricksByIndex[4][4].broken = true;
  this.bricksByIndex[5][4].broken = true;
  this.bricksByIndex[4][7].broken = true;
  this.bricksByIndex[4][8].broken = true;
  this.bricksByIndex[2][11].broken = true;
  this.bricksByIndex[3][11].broken = true;
  this.bricksByIndex[4][11].broken = true;
  this.bricksByIndex[5][11].broken = true;
  this.bricksByIndex[1][12].broken = true;
  this.bricksByIndex[6][12].broken = true;
  this.bricksByIndex[2][13].broken = true;
  this.bricksByIndex[3][13].broken = true;
  this.bricksByIndex[4][13].broken = true;
  this.bricksByIndex[5][13].broken = true;
  this.draw(this.context);  //draw main scene.

  this.lastTick = new Date();
  this.tick();
}

World.prototype.start = function() {
  this.status = 'game';

  this.balls.push(new Ball(240,170,3));
}

World.prototype.die = function() {
  this.ball_count--;

  this.balls = [];
  if (this.ball_count <= 0)
  {
    this.end();
    return;
  }
  this.start();
}

World.prototype.end = function() {
  this.status = 'end';
  document.getElementById('beepEnd').play();

  this.bricks.forEach(function(brick) {
    brick.broken = false;
  }); 
  this.bricksByIndex[2][2].broken = true;
  this.bricksByIndex[3][2].broken = true;
  this.bricksByIndex[4][2].broken = true;
  this.bricksByIndex[5][2].broken = true;
  this.bricksByIndex[1][3].broken = true;
  this.bricksByIndex[6][3].broken = true;
  this.bricksByIndex[1][4].broken = true;
  this.bricksByIndex[4][4].broken = true;
  this.bricksByIndex[6][4].broken = true;
  this.bricksByIndex[4][5].broken = true;
  this.bricksByIndex[5][5].broken = true;
  this.bricksByIndex[2][10].broken = true;
  this.bricksByIndex[3][10].broken = true;
  this.bricksByIndex[4][10].broken = true;
  this.bricksByIndex[5][10].broken = true;
  this.bricksByIndex[1][11].broken = true;
  this.bricksByIndex[6][11].broken = true;
  this.bricksByIndex[1][12].broken = true;
  this.bricksByIndex[4][12].broken = true;
  this.bricksByIndex[6][12].broken = true;
  this.bricksByIndex[4][13].broken = true;
  this.bricksByIndex[5][13].broken = true;
  this.draw(this.context); //draw end scene.
}

World.prototype.win = function() {
  this.status = 'end';

  this.ball_count = 1;
  this.die();

  this.bricks.forEach(function(brick) {
    brick.broken = false;
  });

  this.bricksByIndex[1][1].broken = true;
  this.bricksByIndex[2][1].broken = true;
  this.bricksByIndex[3][1].broken = true;
  this.bricksByIndex[4][1].broken = true;
  this.bricksByIndex[5][2].broken = true;
  this.bricksByIndex[6][2].broken = true;
  this.bricksByIndex[1][3].broken = true;
  this.bricksByIndex[2][3].broken = true;
  this.bricksByIndex[3][3].broken = true;
  this.bricksByIndex[4][3].broken = true;
  this.bricksByIndex[5][4].broken = true;
  this.bricksByIndex[6][4].broken = true;
  this.bricksByIndex[1][5].broken = true;
  this.bricksByIndex[2][5].broken = true;
  this.bricksByIndex[3][5].broken = true;
  this.bricksByIndex[4][5].broken = true;
  this.bricksByIndex[1][7].broken = true;
  this.bricksByIndex[6][7].broken = true;
  this.bricksByIndex[1][8].broken = true;
  this.bricksByIndex[2][8].broken = true;
  this.bricksByIndex[3][8].broken = true;
  this.bricksByIndex[4][8].broken = true;
  this.bricksByIndex[5][8].broken = true;
  this.bricksByIndex[6][8].broken = true;
  this.bricksByIndex[1][9].broken = true;
  this.bricksByIndex[6][9].broken = true;
  this.bricksByIndex[1][11].broken = true;
  this.bricksByIndex[2][11].broken = true;
  this.bricksByIndex[3][11].broken = true;
  this.bricksByIndex[4][11].broken = true;
  this.bricksByIndex[5][11].broken = true;
  this.bricksByIndex[6][11].broken = true;
  this.bricksByIndex[3][12].broken = true;
  this.bricksByIndex[4][13].broken = true;
  this.bricksByIndex[1][14].broken = true;
  this.bricksByIndex[2][14].broken = true;
  this.bricksByIndex[3][14].broken = true;
  this.bricksByIndex[4][14].broken = true;
  this.bricksByIndex[5][14].broken = true;
  this.bricksByIndex[6][14].broken = true;
  this.draw(this.context); //draw winning scene.
}

World.prototype.clear = function() {
  this.score = 0;
  this.ball_count = 3;
  this.stage = 1;
  this.bricks.forEach(function(brick) {
    brick.broken = false;
  });
  this.paddle = new Paddle(210,340,60,10,500);
}

World.prototype.tick = function() {

  elapsed = (new Date())-this.lastTick;

  // Update position of balls
  this.balls.forEach(function(ball) {
    ball.tick(elapsed);
  });

  // Update position of paddle
  this.paddle.tick(elapsed);
 
  // Check collision between objects
  this.balls.forEach((function(world){
    var ball_func = function(ball) {
      // If ball reaches top of screen
      if (ball.y < 0) {
        ball.y = Math.abs(ball.y);
        ball.y_velo *= -1;
        world.paddle.shrink();
      }
      // If ball reaches right of screen
      if (ball.x < 0) {
        ball.x = Math.abs(ball.x);
        ball.x_velo *= -1;
      }
      // If ball reaches left of screen
      if (ball.x > world.width) {
        ball.x = world.width - (ball.x - world.width);
        ball.x_velo *= -1;
      }
      // If ball reaches bottom of screen 
      if (ball.y > world.height) {
        world.die();
      }
      // If ball hits bricks
      for (var i=0; i< world.bricks.length; i++) {
        b = world.bricks[i];
        if (b.broken) {
          continue;
        }
        if (AABB(ball.x,ball.y,ball.radius,ball.radius,b.x,b.y,b.width,b.height)) {
          if ((ball.prevX < b.x && b.x < ball.x) || (ball.prevX < b.x+b.width && b.x+b.width < ball.x))
          {
            ball.x_velo *= -1;
          }
          else
          {
            ball.y_velo *= -1;
          }
          world.score += b.score;
          b.broken = true;
        }
      }

      // If ball hits paddle
      var hit_paddle = false;
      if (AABB(ball.x,ball.y,ball.radius,ball.radius,world.paddle.x,world.paddle.y,world.paddle.width,world.paddle.height)) {
        ball.y = Math.min(ball.y, world.height - world.paddle.height - ball.radius);
        // If hit while paddle and ball are in opposite direction, slow ball down a bit and change ball direction
        if (world.paddle.dir*ball.x_velo < 0 && Math.abs(ball.x_velo) >= ball.x_minVel && Math.abs(ball.y_velo) >= ball.y_minVel) {
          ball.same_dir = 0; 
          ball.x_velo *= -(1-Math.random()/5);
          ball.y_velo *= 1-Math.random()/5;
        }
        // If hit while paddle and ball are in same direction, speed up ball a bit
        else if (world.paddle.dir*ball.x_velo > 0 && Math.abs(ball.x_velo) <= ball.x_maxVel) { 
          ball.x_velo *= 1+Math.random()/5;
        }
        // If they paddle and ball go in same direction continuously, speed up until reaches max speed
        else { 
          if (ball.same_dir >= 4 && Math.abs(ball.x_velo) <= ball.x_maxVel && Math.abs(ball.y_velo) <= ball.y_maxVel) {
            ball.x_velo *= 1+Math.random()/5;
            ball.y_velo *= 1+Math.random()/5;
            ball.same_dir = 0;
          }
        }
        ball.same_dir++;
        ball.y_velo *= -1;
        hit_paddle = true;
      }

      // If all bricks are broken
      if (hit_paddle) {
        if (world.stage == 1) {
          remain = false;
          for(var i=0; i<world.bricks.length && !remain; i++) {
            remain = remain || !world.bricks[i].broken;
          }
          if(remain == false)
          {
            world.bricks.forEach(function(brick) {
              brick.broken = false;
            });
            world.stage++;
          }
        }
        if (world.stage > 1) {
          remain = false;
          for(var i=0; i<world.bricks.length && !remain; i++) {
            remain = remain || !world.bricks[i].broken;
          }
          if(remain == false) {
            world.win();
          }
        }
      }
    };
    return ball_func;
  })(this)
  );

  this.draw(this.context);

  this.lastTick = new Date();
  var that = this;
  requestAnimationFrame(function() { that.tick(); });
}

World.prototype.draw = function(context) {
  context.clearRect(0,0,this.canvas.width, this.canvas.height);

  //Gray walls on screen
  context.fillStyle = '#000000';
  context.fillRect(0,0,550,420);
  context.fillStyle = '#BDBDBD';
  context.fillRect(0,40,550,380);
  context.fillStyle = '#000000';
  context.fillRect(25,70,480,350);

  var linearGradient1 = context.createLinearGradient(0, 110, 0, 230);
  linearGradient1.addColorStop(0, '#FA5858');
  linearGradient1.addColorStop(0.2,'#FAAC58');
  linearGradient1.addColorStop(0.4,'#F7D358');
  linearGradient1.addColorStop(0.6, '#F4FA58');
  linearGradient1.addColorStop(0.8, '#82FA58');
  linearGradient1.addColorStop(1, '#81BEF7');
  context.fillStyle = linearGradient1;
  context.fillRect(25,110,480,120);

  context.save();
  context.translate(this.x,this.y);

  this.bricks.forEach(function(brick) {
    brick.draw(context);
  });

  this.paddle.draw(context);

  this.balls.forEach(function(ball) {
    ball.draw(context);
  });
  context.restore();

  for(var i = 0; i < this.ball_count; i++)
  {
    context.drawImage(this.image,10+35*i,10,25,25);
  }

  context.font="25px VCR OSD mono";
  context.fillText(this.stage,this.canvas.width-200,30);
  context.fillText(this.score,this.canvas.width-100,30);

  $('#score').html(parseInt(this.score));
  $('#stage').html(this.stage);
  $('#ballNum').html(this.ball_count);
}

GameElement.prototype.draw = function(context) {
  console.log("EMPTY DRAW");
}

GameElement.prototype.tick = function(elapsed) {
  console.log("EMPTY TICK");
}

// Instantiate Bricks Objects
Bricks.prototype = new GameElement();
Bricks.prototype.constructor = Bricks;
Bricks.prototype.draw = function(context) {
  if (this.broken) {
    context.fillStyle = '#000000';
    context.fillRect(this.x,this.y,this.width,this.height);
  }
}

// Instantiate Ball Object
Ball.prototype = new GameElement();
Ball.prototype.constructor = Ball;
Ball.prototype.draw = function(context) {
  context.fillStyle = '#ffffff';
  context.beginPath();
  context.arc(this.x,this.y,this.radius,0,2*Math.PI);
  context.fill();
};
Ball.prototype.tick = function(elapsed) {
  //update ball location
  this.prevX = this.x;
  this.prevY = this.y;
  var ratio = Math.sqrt(this.x_velo*this.x_velo+this.y_velo*this.y_velo) / this.minimum_speed;
  if (ratio < 1)
  {
    this.x_velo *= 1/ratio;
    this.y_velo *= 1/ratio;
  }
  this.x += this.x_velo * elapsed / 1000;
  this.y += this.y_velo * elapsed / 1000;
}

// Instantiate Paddle Object
Paddle.prototype = new GameElement();
Paddle.prototype.constructor = Paddle;
Paddle.prototype.draw = function(context) {
  context.fillStyle = '#FE2E2E';
	context.fillRect(this.x, this.y, this.width, this.height);
}
Paddle.prototype.tick = function(elapsed) {
	// Player pressing left arrow key
	if (37 in keysDown) { 
		this.x -= this.speed * elapsed / 1000;
    this.dir = -1;
		if (this.x <= 0) {
			this.x = 0;
      this.dir = 0;
		}
	}
	// Player pressing right arrow key
  else if (39 in keysDown) { 
		this.x += this.speed * elapsed / 1000;
    this.dir = +1;
		if (this.x+this.width >= world.width) {
			this.x = world.width-this.width;
      this.dir = 0;
		}
	}
  else
  {
    this.dir = 0;
  }
}

// Collision detection
var AABB = function(ax,ay,aw,ah,bx,by,bw,bh) {
	return ax < bx+bw && bx < ax+aw && ay < by+bh && by < ay+ah;			
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
  
w.onload = function() {
  // Create the canvas
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  canvas.width = 530;
  canvas.height = 420;
  document.body.appendChild(canvas); //attach canvas to document

  addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
  }, false);
  addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
  }, false);

  world = new World(canvas,context);
  world.init();

  // Handling keyboard input
  $(document).keypress(function (e) {
    if (e.which == 13)
    {
      if (world.status != 'game') {
        world.clear();
        world.start();
      }
    }
  });
}
