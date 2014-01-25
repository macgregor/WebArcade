Game = {
  	// Initialize and start our game
	start: function() {
   		// Start crafty and set a background color so that we can see it's working
    	Crafty.init(480, 320);
    	Crafty.background('black');

		//Preload assets
        Crafty.load(['assets/sounds/pew.ogg'], function() {
            
            Crafty.audio.add({
				pew: 'assets/sounds/pew.ogg',
				boom: 'assets/sounds/boom.wav',
				ching: 'assets/sounds/ching.wav'
			});    
             
            //start the main scene when loaded
            Crafty.scene("main"); 
        });
        
		
		Crafty.scene("main", function() {
			Crafty.e('Score');
			Crafty.e('Ship');
			spawnRocks(5,15);
		});
	}
}