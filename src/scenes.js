HTMLCanvasElement.prototype.toBlob = function(type) {
    var dataURL = this.toDataURL(type),
        binary = atob( dataURL.substr( dataURL.indexOf(',') + 1 ) ),
        i = binary.length,
        view = new Uint8Array(i);

    while (i--) {
        view[i] = binary.charCodeAt(i);
    }
    
    return new Blob([view]);
};

Crafty.scene('Game', function() {

  // A 2D array to keep track of all occupied tiles
  this.occupied = new Array(Game.map_grid.width);
  for (var i = 0; i < Game.map_grid.width; i++) {
    this.occupied[i] = new Array(Game.map_grid.height);
    for (var y = 0; y < Game.map_grid.height; y++) {
      this.occupied[i][y] = false;
    }
  }

  // Player character, placed at 5, 5 on our grid
  this.player = Crafty.e('PlayerCharacter').at(5, 5);
  this.occupied[this.player.at().x][this.player.at().y] = true;

  // Place a tree at every edge square on our grid of 16x16 tiles
  for (var x = 0; x < Game.map_grid.width; x++) {
    for (var y = 0; y < Game.map_grid.height; y++) {
      var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;

      if (at_edge) {
        // Place a tree entity at the current tile
        Crafty.e('Tree').at(x, y);
        this.occupied[x][y] = true;
      } else if (Math.random() < 0.06 && !this.occupied[x][y]) {
        // Place a bush entity at the current tile
        Crafty.e('Bush').at(x, y);
        this.occupied[x][y] = true;
      }
    }
  }

  // Generate up to five villages on the map in random locations
  var max_villages = 5;
  for (var x = 0; x < Game.map_grid.width; x++) {
    for (var y = 0; y < Game.map_grid.height; y++) {
      if (Math.random() < 0.02) {
        if (Crafty('Village').length < max_villages && !this.occupied[x][y]) {
          Crafty.e('Village').at(x, y);
        }
      }
    }
  }

  this.show_victory = function() {
    if (!Crafty('Village').length) {
      Crafty.scene('Victory');
    }
  };
  this.bind('VillageVisited', this.show_victory);
  
}, function() {
  this.unbind('VillageVisited', this.show_victory);
});

Crafty.scene('Victory', function() {
  Crafty.e('2D, DOM, Text')
    .attr({ x: 0, y: 0 })
    .text('Victory!');

  this.restart_game = function() {
    Crafty.scene('Game');
  };
  this.bind('KeyDown', this.restart_game);
}, function() {
  this.unbind('KeyDown', this.restart_game);
});

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function () {
	// Draw some text for the player to see in case the file
	// takes a noticeable amount of time to load
	Crafty.e('2D, DOM, Text')
	.text('Loading...')
	.attr({
		x : 0,
		y : Game.height() / 2 - 24,
		w : Game.width()
	})
	.css($text_css);
	
	//load and convert svg with canvg
	var canvas = document.getElementById("svg_convert");
	var ctx = canvas.getContext("2d");
	var data = "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
				 "<foreignObject width='100%' height='100%'>" +
				   "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:40px'>" +
					 "<em>I</em> like <span style='color:white; text-shadow:0 0 2px blue;'>cheese</span>" +
				   "</div>" +
				 "</foreignObject>" +
			   "</svg>";
	var DOMURL = self.URL || self.webkitURL || self;
	var img = new Image();
	var svg = new Blob([data], {type: "image/svg+xml;charset=utf-8"});
	var url = DOMURL.createObjectURL(svg);
	img.onload = function() {
		ctx.drawImage(img, 0, 0);
		DOMURL.revokeObjectURL(url);
	};
	img.src = url;
});