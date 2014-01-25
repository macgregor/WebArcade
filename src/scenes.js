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
	var svg_data = '<svg width="100" height="100">' +
						'<circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />' +
					'</svg>';
	
	canvg('svg_convert', svg_data);
	var canvas = document.getElementById("svg_convert");
	var img = new Image();
	img.onload = function(){   // put this above img.src = …
		Crafty.sprite(1, img, {
			spr_player : [0, 0]
		});
		Crafty.scene('Game');
	};
	img.src = canvas.toDataURL("image/png");
});