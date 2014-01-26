Crafty.scene('LoadVader', function(){
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Crafty.e('2D, DOM, Text')
    .text('Loading...')
    .attr({ x: 0, y: Game.height_px()/2 - 24, w: Game.width_px() })
    .css($text_css);
 
	Crafty.load(['assets/sprite_sheet_full.png'], function(){
		Crafty.sprite(32, 'assets/sprite_sheet_full.png', {
		  spr_player:  [0, 0],
		  spr_tie:     [1, 0],
		  spr_boss:    [2, 0],
		  spr_vader:   [3, 0]
		});
		
		// Now that our sprites are ready to draw, start the game
		Crafty.scene('SpaceInvader');
	});
 

});

Crafty.scene('SpaceInvader', function() {
	this.score = 0;
	this.lives = 3;
		
	this.scoreText = Crafty.e('2D, DOM, Text')
		.text('Score: ' + this.score)
		.attr({ x: 10, y: 10, w: 100, h: 20})
		.css($text_css);
		
	this.lifeText = Crafty.e('2D, DOM, Text')
		.text('Lives: ' + this.lives)
		.attr({ x: 10, y: 30, w:50, h: 20})
		.css($text_css);
	
	
	var enemy_row_size = (Game.map_grid.width / 4);
	var num_rows = 4;
	this.player = Crafty.e('Player').at(Game.centerTile_width(), Game.map_grid.height - 2);	
	this.enemies = new Array(enemy_row_size * num_rows);
	for(var i = 0; i < enemy_row_size; i++){
		for(var j = 0; j < num_rows; j++){
			if(j == 0){
				this.enemies[i + (j * enemy_row_size)] = Crafty.e('Vader').at((i+1)*3, (j*2) + 2);
			} else{
				this.enemies[i + (j * enemy_row_size)] = Crafty.e('Tie').at((i+1)*3, (j*2) + 2);
			}
		}
	}
	
	this.moveEnemies = function(data){
		if(!((data.frame - Game.step) % Game.wait)){
			var move_y = false;
			for(var i = 0; i < this.enemies.length; i++){
				var enemy = this.enemies[i];
				var grid_x = enemy.at().x;
				var grid_y = enemy.at().y;
				
				if(grid_x + enemy.speed >= Game.map_grid.width || grid_x + enemy.speed < 0){
					move_y = true;
				}
			}
			
			for(var i = 0; i < this.enemies.length; i++){
				var enemy = this.enemies[i];
				var grid_x = enemy.at().x;
				var grid_y = enemy.at().y;
				
				if(move_y){
					grid_y = enemy.at().y + 1;
					enemy.speed = enemy.speed * -1;
				} else{
					grid_x = grid_x + enemy.speed;
				}
				
				enemy.at(grid_x, grid_y);
			}
		}else{
			for(var i = 0; i < this.enemies.length; i++){
				var enemy = this.enemies[i];
				if(enemy.shouldDestroy){
					enemy.destroy();
					this.enemies.splice(i, 1);
				} else{
					if((Math.floor((Math.random() * 1000) + 1)) == 1000){
						enemy.shoot();
					}
				}
			}
		}
		if(this.enemies.length == 0){
			this.player.destroy();
			this.unbind("EnterFrame", this.moveEnemies);
			Crafty.scene('Victory');
		}
	}
	
	this.bind("EnterFrame", this.moveEnemies);
	
	this.gameOverListener = this.bind("Death", function(data){
		this.lives -= 1;
		if(this.lives == 0){
			this.unbind("EnterFrame", this.moveEnemies);
			this.player.destroy();
			Crafty.scene('GameOver');
		} else{
			this.lifeText.text('Lives: ' + this.lives)
		}
	});
	
	this.scoreListener = this.bind("Score", function(obj){
		if(obj.has('Vader')){
			this.score += 300;
		} else{
			this.score += 100;
		}
		
		this.scoreText.text('Score: ' + this.score)
	});
});

Crafty.scene('Victory', function() {
	  Crafty.e('2D, DOM, Text')
    .text('Winner')
    .attr({ x: 0, y: Game.height_px()/2 - 24, w: Game.width_px() })
    .css($text_css);

});

Crafty.scene('GameOver', function() {
	  Crafty.e('2D, DOM, Text')
    .text('Game Over')
    .attr({ x: 0, y: Game.height_px()/2 - 24, w: Game.width_px() })
    .css($text_css);
});