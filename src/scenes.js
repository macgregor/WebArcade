// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('LoadVader', function () {
	// Draw some text for the player to see in case the file
	// takes a noticeable amount of time to load
	Crafty.e('2D, DOM, Text')
	.text('Loading...')
	.attr({
		x : 0,
		y : Game.height_px() / 2 - 24,
		w : Game.width_px()
	})
	.css($text_css);
	
	Crafty.scene('SpaceInvader');
});

Crafty.scene('SpaceInvader', function() {
	this.player = Crafty.e('Player').at(Game.centerTile_width(), Game.map_grid.height - 2);
	this.enemy = Crafty.e('Vader').at(Game.centerTile_width(), 5);
	this.barricade1 = Crafty.e('Barricade').at((Game.map_grid.width / 4 - 3) , Game.map_grid.height - 5);
	this.barricade2 = Crafty.e('Barricade').at((Game.map_grid.width / 2 - 1) , Game.map_grid.height - 5);
	this.barricade3 = Crafty.e('Barricade').at((Game.map_grid.width - 3) , Game.map_grid.height - 5);
  
});

Crafty.scene('Victory', function() {


});