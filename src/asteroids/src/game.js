Game = {
  	// Initialize and start our game
	start: function() {
   		// Start crafty and set a background color so that we can see it's working
    	Crafty.init(480, 320);
    	Crafty.background('black');

		//Load assets
		//Crafty.load(["assets"]), 
		
		//score display
		Crafty.e("2D, DOM, Text")
			.text("Score")
			.attr({x: Crafty.viewport.width - 150, 
				   y: Crafty.viewport.height - 50, 
				   w: 30, 
				   h: 10})
			.css({color: "#fff"});

		Crafty.e('Ship');
	}
}

