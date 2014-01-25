//player entity
Crafty.c('Ship', {
	init: function() {
		this.requires("2D, DOM, Text")
		.text("A")
		.attr({move: {left: false, right: false, up: false, down: false}, xspeed: 0, yspeed: 0, decay: 0.9, 
		       x: Crafty.viewport.width / 2, y: Crafty.viewport.height / 2, score: 0})
		.origin("center")
		.textColor('#FFFFFF')
		.textFont({ size: '20px', weight: 'bold', family: 'Arial'})
		.bind("KeyDown", function(e) {
		    //on keydown, set the move booleans
		    if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
		            this.move.right = true;
		    } else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
		            this.move.left = true;
		    } else if(e.keyCode === Crafty.keys.UP_ARROW) {
		            this.move.up = true;
		    } else if (e.keyCode === Crafty.keys.SPACE) {
		        console.log("Pew");
		        //Crafty.audio.play("Pew");
		        //create a bullet entity
		        Crafty.e("2D, DOM, Text, bullet")
		        .attr({
		            x: this._x, //piece of shit alignment
		            y: this._y, 
		            w: 2, 
		            h: 5, 
		            rotation: this._rotation, 
		            xspeed: 5 * Math.sin(this._rotation / 60), 
		            yspeed: 5 * Math.cos(this._rotation / 60)
		        })
		        .text(Math.floor( (Math.random()*10)) ) //1-9
		        .textColor('#FFFFFF')
		        .textFont({family: 'Arial'})
		        .bind("EnterFrame", function() {
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
		}).bind("KeyUp", function(e) {
		    //on key up, set the move booleans to false
		    if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
		            this.move.right = false;
		    } else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
		            this.move.left = false;
		    } else if(e.keyCode === Crafty.keys.UP_ARROW) {
		            this.move.up = false;
		    }
		}).bind("EnterFrame", function() {
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
		    /*if(asteroidCount <= 0) {
		            initRocks(lastCount, lastCount * 2);
		    }*/
		});/*.collision()
		.onHit("asteroid", function() {
		    //if player gets hit, restart the game
		    Crafty.scene("main");
		});*/
	}	
});