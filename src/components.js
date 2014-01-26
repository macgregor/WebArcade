// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
    } else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }
  }
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  },
});

Crafty.c('Laser', {
	speed: 10,
	init: function(){
		this.requires('Actor, Color, Collision')
			.color('rgb(100, 0, 0)');
	},
});

Crafty.c('PlayerLaser', {
	init: function(){
		this.requires('Laser')
			.onHit('Enemy', function(){
				this.destroy();
			})
			.bind("EnterFrame", function(){
				this.y = this.y - this.speed;
				
				if(this.y < 0){ 
					this.destroy();
				}
			});
	},
});

Crafty.c('EnemyLaser', {
	init: function(){
		this.requires('Laser')
			.onHit('Player', function(){
				this.destroy();
			})
			.bind("EnterFrame", function(){
				this.y = this.y + this.speed;
				
				if(this.y > Game.height_px()){ 
					this.destroy();
				}
			});
	},
});

Crafty.c('Enemy', {
	shouldDestroy: false,
	score: null,
	init: function() {
		this.requires('Actor, Solid, Collision')
			.attr({w: 24, h: 24})
			.registerCollisions();
	},
  
	registerCollisions: function(){
		this.onHit('PlayerLaser', function(){
			this.shouldDestroy = true;
			this.score = Crafty.e('2D, DOM, Text')
				.text('Lives: ' + this.lives)
				.attr({ x: 10, y: 30, w:50, h: 20})
				.css($score_text_css);
			Crafty.trigger("Score" , this);
		});
	
		return this;
	},
  
	shoot: function(){
		Crafty.e('EnemyLaser').attr({w: 4, h: 8, x: this.x, y: this.y - 10});
	},
});

Crafty.c('Vader', {
	speed: 1,
	init: function() {
		this.requires('Enemy, spr_vader');
	},
});

Crafty.c('Tie', {
	speed: 1,
	init: function(){
		this.requires('Enemy, spr_tie');
	},
});
	
// This is the player-controlled character
Crafty.c('Player', {
	move_distance: 7,
	init: function() {
		this.requires('Actor, Color, Collision, Keyboard, spr_player')
			.attr({w: 24, h: 24})
			.registerInputListener()
			.onHit('EnemyLaser', function(){
				Crafty.trigger('Death', this);
			});
	},
	
	registerInputListener: function(){
		this.bind("EnterFrame", function(){
			if(this.isDown('LEFT_ARROW') || this.isDown('A')){
				if(this.x - this.move_distance > 0){
					this.x = this.x - this.move_distance;
				} else{
					this.x = 0;
				}
			} else if (this.isDown('RIGHT_ARROW') || this.isDown('D')){
				if(this.x + this.move_distance < Game.width_px() - this.w){
					this.x = this.x + this.move_distance;
				} else{
					this.x = Game.width_px() - this.w;
				}
			}
		});
		
		this.bind("KeyDown", function(){
			if(this.isDown('SPACE')){
				this.shoot();
			}
		});
		
		return this;
	},
	
	shoot: function(){
		Crafty.e('PlayerLaser').attr({w: 100, h: 100, x: this.x, y: this.y - 10});
	}
});

$text_css = { 'font-size': '36px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' }
$score_text_css = { 'font-size': '36px', 'font-family': 'Arial', 'color': 'red', 'text-align': 'center' }