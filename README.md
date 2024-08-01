# slither-game
Game Engine Library:[Phaser](https://phaser.io/)<br>


## Code Pen <br>
[Snake](http://codepen.io/znepop/pen/jVqbbo?editors=1010)<br><br>




## Asset<br>
You can change source to your own path.(http or localfolder)<br>

    function preload() {
    
      game.load.crossOrigin = "anonymous";
      game.load.spritesheet('food','http://s.ntustcoding.club/snake/foods.png', 36, 36);
      game.load.image('ball','http://s.ntustcoding.club/snake/body.png');
      game.load.image('eball','http://s.ntustcoding.club/snake/ebody.png');
      game.load.image('ground', 'http://s.ntustcoding.club/snake/ground.png');

    }

