Game = {
  // This defines our grid's size and the size of each of its tiles
  map_grid: {
    width:  32,
    height: 32,
    tile: {
      width:  24,
      height: 24
    }
  },
  
  step: 0,
  wait: 70,

  // The total width of the game screen. Since our grid takes up the entire screen
  //  this is just the width of a tile times the width of the grid
  width_px: function() {
    return this.map_grid.width * this.map_grid.tile.width;
  },

  // The total height of the game screen. Since our grid takes up the entire screen
  //  this is just the height of a tile times the height of the grid
  height_px: function() {
    return this.map_grid.height * this.map_grid.tile.height;
  },
  
	centerTile_width: function(){
		return this.map_grid.width / 2;
	},
	
	centerTile_height: function(){
		return this.map_grid.height / 2;
	},
  
  // Initialize and start our game
  start: function() {
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(Game.width_px(), Game.height_px());
    Crafty.background('rgb(0, 0, 0)');

	 // Simply start the "Loading" scene to get things going
	Crafty.scene('LoadVader');
  }
}