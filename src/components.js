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

Crafty.c('Barricade', {
	init: function(){
		this.requires('Actor, Color, Solid');
		this.w = this.w * 4;
	}
});

Crafty.c('Laser', {
	speed: 10,
	init: function(){
		this.requires('Actor, Color, Solid, Collision')
			.color('rgb(100, 0, 0)')
			.onHit('Vader', function(){
				this.destroy();
			})
			.onHit('Barricade', function(){
				this.y = - 100;
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

// A Tree is just an Actor with a certain color
Crafty.c('Vader', {
  init: function() {
    this.requires('Actor, Color, Solid, Collision')
		.color('rgb(20, 125, 40)')
		.onHit('Laser', function(){
			this.destroy();
		})
		.onHit('Barricade', function(){
			this.destroy();
		});
  },
});

// This is the player-controlled character
Crafty.c('Player', {
	move_distance: 10,
	init: function() {
		this.requires('Actor, Color, Collision, Keyboard')
			.color('rgb(20, 75, 40)')
			.registerInputListener();
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
		Crafty.e('Laser').attr({x: this.x, y: this.y - 10});
	}
});

$text_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' }
