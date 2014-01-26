enable_hitbox = false;

//score display
Crafty.c('Lives', {
	init: function() {
		this.requires('2D, DOM, Text')
		.text('Lives: 5')
		.textFont({ size: '10px', weight: 'bold', family: 'Arial'})
		.attr({x: Crafty.viewport.width - (Crafty.viewport.width - 10), 
			   y: Crafty.viewport.height - (Crafty.viewport.height - 10), 
			   w: 75, 
			   h: 10})
		.css({color: '#fff'});
	}
});

//score display
Crafty.c('Score', {
	init: function() {
		this.requires('2D, DOM, Text')
		.text('Score: 0')
		.attr({x: Crafty.viewport.width - 150, 
			   y: Crafty.viewport.height - 50, 
			   w: 30, 
			   h: 10})
		.css({color: '#fff'});
	}
});


//Ship entity
Crafty.c('Ship', {
	init: function() {
		this.requires('2D, DOM, Text, Controls, Collision')
		.text('A')
		.attr({move: {
				left: false, 
				right: false, 
				up: false, 
			down: false}, 
			xspeed: 0, 
			yspeed: 0, 
			decay: 0.9,   
		    x: Crafty.viewport.width / 2, 
		    y: Crafty.viewport.height / 2, 
		    score: 0,
			lives: 5})
		.origin('center')
		.textColor('#FFFFFF')
		.textFont({ size: '15px', weight: 'bold', family: 'Arial'})
		.bind('KeyDown', function(e) {
		    //on keydown, set the move booleans
		    if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
		            this.move.right = true;
		    } else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
		            this.move.left = true;
		    } else if(e.keyCode === Crafty.keys.UP_ARROW) {
		            this.move.up = true;
		    } else if (e.keyCode === Crafty.keys.SPACE) {
		        console.log('Pew');
		        Crafty.audio.play('pew'); //play pew sound

		        //create a bullet entity
		        Crafty.e('2D, DOM, Text, bullet')
		        .attr({
		            x: this._x + (Math.cos((this._rotation /1) * Math.PI / 180)), //piece of shit alignment
		            y: this._y + (Math.sin((this._rotation /1) * Math.PI / 180)), 
		            w: 2, 
		            h: 5, 
		            rotation: this._rotation, 
		            xspeed: 5 * Math.sin(this._rotation * Math.PI / 180), 
		            yspeed: 5 * Math.cos(this._rotation * Math.PI / 180)
		        })
		        .text(Math.floor( (Math.random()*10)) ) //1-9
		        .textColor('#FF9900')
		        .textFont({family: 'Arial'})
		        .bind('EnterFrame', function() {
		            this.x += this.xspeed;
		            this.y -= this.yspeed;
		            
		            //destroy if it goes out of bounds
		            if(this._x > Crafty.viewport.width || 
		            	this._x < 0 || 
		            	this._y > Crafty.viewport.height || 
		            	this._y < 0) {
		                    this.destroy();
		           	}
		        });
			}
		}).bind('KeyUp', function(e) {
		    //on key up, set the move booleans to false
		    if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
		            this.move.right = false;
		    } else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
		            this.move.left = false;
		    } else if(e.keyCode === Crafty.keys.UP_ARROW) {
		            this.move.up = false;
		    }
		}).bind('EnterFrame', function() {
		    if(this.move.right) this.rotation += 5;
		    if(this.move.left) this.rotation -= 5;
		    
		    //acceleration and movement vector
		    var vx = Math.sin(this._rotation * Math.PI / 180) * 0.3,
	            vy = Math.cos(this._rotation * Math.PI / 180) * 0.3;
		    
		    //if the move up is true, increment the y/xspeeds
		    if(this.move.up) {
		            this.yspeed -= vy;
		            this.xspeed += vx;
		    } else {
		            //if released, slow down the ship
		            this.xspeed *= this.decay;
		            this.yspeed *= this.decay;
		    }
		    
		    //move the ship by the x and y speeds or movement vector
		    this.x += this.xspeed;
		    this.y += this.yspeed;
		    
		    //if ship goes out of bounds, put him back
		    if(this._x > Crafty.viewport.width) {
		        this.x = -64;
		    }
		    if(this._x < -64) {
	            this.x =  Crafty.viewport.width;
		    }
		    if(this._y > Crafty.viewport.height) {
	            this.y = -64;
		    }
		    if(this._y < -64) {
	            this.y = Crafty.viewport.height;
		    }
		    
		    //if all asteroids are gone, start again with more
		    if(asteroidCount <= 0) {
	            spawnRocks(lastCount, lastCount * 2);
	            spawnMoney(5);
		    }
		}).collision()
		.onHit('asteroid', function() {
		    //if Ship gets hit, restart the game
		    Crafty('Ship').lives -= 1;
		    Crafty('Ship').origin('center');    	
		    Crafty('Ship').x = Crafty.viewport.width - (Crafty.viewport.width/2);   
		    Crafty('Ship').y = Crafty.viewport.height - (Crafty.viewport.height/2);      
		    Crafty('Lives').text("Lives: " + Crafty('Ship').lives);

		    if (Crafty('Ship').lives <= 0) {
		    	Crafty.scene('GameOver');
				Crafty('Ship').lives = 5;    	
		    	scores = 0;
			}
		}).onHit('PowerUp', function() {
			console.log('GOT POWER!!!');
		    this.addPower();
		});
	},

	addPower: function() {
		Crafty.e("2D, Canvas, Circle")
	    .Circle(40, "#FF0000");
	    //.tween({radius: 5, x: 0}, 500);
	}	

});

//keep a count of asteroids
var asteroidCount,lastCount;
var moneyCount = 0;
var alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

Crafty.c('big', {
	init: function() {
		this.requires('2D, DOM, Text, Color')
		.attr({	w: 40, 
			    h: 40})  
		//.color('red')
		.text(alpha[Math.floor(Math.random()*26)].toUpperCase())
		.textColor('#FF00FF')
		.textFont({ size: '40px', weight: 'bold', family: 'Arial'})
	}
});

Crafty.c('medium', {
	init: function() {
		this.requires('2D, DOM, Text, Color')
		.attr({	w: 30, 
			    h: 30})
		//.color('cyan')
		.text(alpha[Math.floor(Math.random()*26)].toUpperCase())
		.textColor('#00FFFF')
		.textFont({ size: '30px', weight: 'bold', family: 'Arial'})
	}
});

Crafty.c('small', {
	init: function() {
		this.requires('2D, DOM, Text, Color')
		.attr({	w: 20, 
			    h: 20})  
		//.color('green')
		.text(alpha[Math.floor(Math.random()*26)])
		.textColor('#00FF00')
		.textFont({ size: '20px', weight: 'bold', family: 'Arial'})
	}
});

//Asteroid component
Crafty.c('asteroid', {   
    init: function() {
    	this.requires('2D, DOM, Text')
        this.origin('center');
        this.attr({
            x: Crafty.math.randomInt(0, Crafty.viewport.width), //give it random positions, rotation and speed
            y: Crafty.math.randomInt(0, Crafty.viewport.height),
            xspeed: Crafty.math.randomInt(1, 2), 
            yspeed: Crafty.math.randomInt(1, 2),
            rspeed: Crafty.math.randomInt(-2, 2)
        }).bind('EnterFrame', function() {
            this.x += this.xspeed;
            this.y += this.yspeed;
            this.rotation += this.rspeed;
            
            if(this._x > Crafty.viewport.width) {
                this.x = -64;
            }
            if(this._x < -64) {
                this.x =  Crafty.viewport.width;
            }
            if(this._y > Crafty.viewport.height) {
                this.y = -64;
            }
            if(this._y < -64) {
                this.y = Crafty.viewport.height;
            }
        }).collision()
        .onHit('bullet', function(e) {
            //if hit by a bullet increment the score
            Crafty('Ship').score += 5;
            Crafty('Score').text('Score: ' + Crafty('Ship').score);

            //score.text('Score: ' + scores);
            e[0].obj.destroy(); //destroy the bullet
            
            var size;
            //decide what size to make the asteroid
            if(this.has('big')) {
                this.removeComponent('big').addComponent('medium');
                size = 'medium';
            } else if(this.has('medium')) {
                this.removeComponent('medium').addComponent('small');
                size = 'small';
            } else if(this.has('small')) { //if the lowest size, delete self
                asteroidCount--;
                this.destroy();
                return;
            }
            
            var oldxspeed = this.xspeed;
            this.xspeed = -this.yspeed;
            this.yspeed = oldxspeed;
            
            asteroidCount++;
            //split into two asteroids by creating another asteroid
            Crafty.e('2D, DOM, '+size+', Collision, asteroid')
            .attr({x: this._x, y: this._y});
        });
    }
});


Crafty.c('Money', {
    init: function() {
    	this.requires('2D, DOM, Text, Money')
        this.origin('center')
        this.text('$')
        this.textColor('#FFFF00')
        this.textFont({family: 'Tahoma'})
        this.attr({
            x: Crafty.math.randomInt(0, Crafty.viewport.width), 
            y: Crafty.math.randomInt(0, Crafty.viewport.height),
            xspeed: Crafty.math.randomInt(1, 2), 
            yspeed: Crafty.math.randomInt(1, 2),
            rspeed: Crafty.math.randomInt(-2, 2)
        }).bind('EnterFrame', function() {
            this.x += this.xspeed;
            this.y += this.yspeed;
            this.rotation += this.rspeed;
            
            if(this._x > Crafty.viewport.width) {
                this.x = -64;
            }
            if(this._x < -64) {
                this.x =  Crafty.viewport.width;
            }
            if(this._y > Crafty.viewport.height) {
                this.y = -64;
            }
            if(this._y < -64) {
                this.y = Crafty.viewport.height;
            }
        }).collision()
        .onHit('Ship', function(e) {
            //if hit by a bullet increment the score
            Crafty('Ship').score += 100;
            Crafty('Score').text('Score: ' + Crafty('Ship').score);
            //Crafty('Ship').textColor('#FFFF00');
            this.destroy(); //destroy the bullet
        });
    }
});


Crafty.c('PowerUp', {
    init: function() {
    	this.requires('2D, DOM, Color, PowerUp')
    	.color('blue')
        this.origin('center')
        this.text('POWER')
        this.textColor('#FFFF00')
        this.textFont({family: 'Tahoma'})
        this.attr({
            x: Crafty.math.randomInt(0, Crafty.viewport.width), 
            y: Crafty.math.randomInt(0, Crafty.viewport.height),
            xspeed: Crafty.math.randomInt(1, 2), 
            yspeed: Crafty.math.randomInt(1, 2),
            rspeed: Crafty.math.randomInt(-2, 2),
            w: 80, 
            h: 20,
        }).bind('EnterFrame', function() {
            this.x += this.xspeed;
            this.y += this.yspeed;
            this.rotation += this.rspeed;
            
            if(this._x > Crafty.viewport.width) {
                this.x = -64;
            }
            if(this._x < -64) {
                this.x =  Crafty.viewport.width;
            }
            if(this._y > Crafty.viewport.height) {
                this.y = -64;
            }
            if(this._y < -64) {
                this.y = Crafty.viewport.height;
            }
        }).collision()
        .onHit('Ship', function(e) {
            //if hit by a bullet increment the score
            //Crafty('Ship').score += 100;
            //Crafty('Score').text('Score: ' + Crafty('Ship').score);
            //Crafty('Ship').textColor('#FFFF00');
            this.destroy(); //destroy the bullet
        });
    }
});


Crafty.c("Circle", {
    Circle: function(radius, color) {
        this.radius = radius;
        this.w = this.h = radius * 2;
        this.color = color || "#000000";
        this.x = Crafty('Ship').x;
      	this.y = Crafty('Ship').y;

        return this;
    },
    
    draw: function() {
       var ctx = Crafty.canvas.context;
       ctx.save();
       ctx.fillStyle = this.color;
       ctx.beginPath();
       ctx.arc(
           this.x + this.radius,
           this.y + this.radius,
           this.radius,
           0,
           Math.PI * 2
       );
       ctx.closePath();
       ctx.fill();
    },
});

Crafty.scene('GameOver', function() {
     Crafty.e('2D, DOM, Text, Color, Mouse')
    .text('Restart?')
    .attr({ 
    	x: Crafty.viewport.width/2 - 40, 
    	y: Crafty.viewport.height/2,
    	w: 180,
    	h: 40 })
    .textColor('#FFFFFF')
    .textFont({size: '20px', weight: 'bold', family: 'Tahoma'})
    .bind('Click', function() {
     	//console.log("Clicked!!");
     	Crafty.scene('main');
	})

});


//function to fill the screen with asteroids by a random amount
function spawnRocks(lower, upper) {
    var rocks = Crafty.math.randomInt(lower, upper);
    asteroidCount = rocks;
    lastCount = rocks;
    
    for(var i = 0; i < rocks; i++) {
        Crafty.e('2D, DOM, big, Collision, asteroid');
    }
}

function spawnMoney(amount) {
	if ( moneyCount == 0 ) {
	moneyCount = 5;
	} else {
		moneyCount += amount
	}
	
	for(var i = 0; i < amount; i++) {
		Crafty.e('2D, DOM, small, Collision, Money');
	}
}

function spawnPower() {
	Crafty.e('2D, DOM, small, Collision, PowerUp');	
}

