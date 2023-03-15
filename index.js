// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;

document.body.appendChild(canvas);

const deathAudio = new Audio('./audio/mixkit-monster-dying-in-pain-1960.wav');
const startAudio = new Audio('./audio/mixkit-drums-of-war-call-2780.wav');
const hitAudio   = new Audio('./audio/mixkit-falling-on-undergrowth-390.wav');

class Zombie {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

let zombiePoints = 0;

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
let zombiesReady = false;
let zombieImage = new Image();
zombieImage.src = "images/zombie.png";

let zombieImageSecondary = new Image();
zombieImageSecondary.src = "images/zombie-secondary.png";
zombieImageSecondary.onload = function () {
	zombiesReady = true;
};

// Game objects
let hero = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0
};

let zombie 	  = new Zombie(0, 0);
let zombie2   = new Zombie(0, 0);
let zombieSec = new Zombie(0, 0);

// Handle keyboard controls
var keysDown = {}; // object were we add up to 4 properties when keys go down
                // and then delete them when the key goes up

addEventListener("keydown", function (e) {
	console.log(e.keyCode + " down")
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	console.log(e.keyCode + " up")
	delete keysDown[e.keyCode];
}, false);

function zombieRandomDestination(zombie) {
	zombie.x = 32 + (Math.random() * (canvas.width - 96));
	zombie.y = 32 + (Math.random() * (canvas.height - 96));
}


// Reset the game when the player catches a monster
let reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	zombieRandomDestination(zombie);
	zombieRandomDestination(zombie2);
	zombieRandomDestination(zombieSec);
};


function isZombieKilled(zombie) {
	return (
		hero.x <= (zombie.x + 32)
		&& zombie.x <= (hero.x + 32)
		&& hero.y <= (zombie.y + 32)
		&& zombie.y <= (hero.y + 32)
	);
}

// Update game objects
var update = function (modifier) {
	if (38 in keysDown && hero.y > 32+4) { //  holding up key
    	hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown && hero.y < canvas.height - (64 + 6)) { //  holding down key
	    hero.y += hero.speed * modifier;
	}
	if (37 in keysDown && hero.x > (32+4)) { // holding left key
	    hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown && hero.x < canvas.width - (64 + 6)) { // holding right key
	    hero.x += hero.speed * modifier;
	}


	// Are they touching?
	if (isZombieKilled(zombie) || isZombieKilled(zombie2)) {
		++zombiePoints;
		hitAudio.play();
		reset();
	}
	else if (isZombieKilled(zombieSec)) {
		let gotLucky = Math.random() >= .5;
		if (gotLucky) {
			zombiePoints += 5;
			hitAudio.play();
			reset();
		}
		else {
			deathAudio.play();
			alert('The Zombie was too strong and ate you!');
			location.reload();
		}
	}
   };

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (zombiesReady) {
		ctx.drawImage(zombieImage, zombie2.x, zombie2.y);
		ctx.drawImage(zombieImageSecondary, zombieSec.x, zombieSec.y);
		ctx.drawImage(zombieImage, zombie.x, zombie.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Zombie Points: " + zombiePoints, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	render();
	then = now;
	//  Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
//var w = window;
//requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
startAudio.play();