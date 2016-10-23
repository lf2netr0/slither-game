//---Snake AI---//

EnemySnake = function (index, game) {

    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.numSnakeSections = 5;
    this.snakePath = new Array();
    this.OldPath = new Array();
    this.snakeSpacer = 6;
    this.snakeSection = new Array();
    this.alive = true;


    this.snakeHead = game.add.sprite(x, y, 'ball');
    this.snakeHead.anchor.setTo(0.5, 0.5);
    this.snakeHead.score = 0;

    game.physics.enable(this.snakeHead, Phaser.Physics.ARCADE);
    this.snakeHead.body.drag.set(0.2);
    this.snakeHead.body.maxVelocity.setTo(400, 400);
    this.snakeHead.body.collideWorldBounds = true;

        //  Init snakeSection array
    for (var i = 1; i <= this.numSnakeSections-1; i++)
    {
        this.snakeSection[i] = game.add.sprite(x, y, 'ball');
        game.physics.enable(this.snakeSection[i], Phaser.Physics.ARCADE);
        this.snakeSection[i].anchor.setTo(0.5, 0.5);
    }
    
    //  Init snakePath array
    for (var i = 0; i <= this.numSnakeSections * this.snakeSpacer; i++)
    {
        this.snakePath[i] = new Phaser.Point(x,y);
        this.OldPath[i] = new Phaser.Point(x,y);
    }  
    this.snakeHead.bringToTop();

};
EnemySnake.prototype.kill = function () {
    for(var j = 1 ; j < this.numSnakeSections ; j++){
        this.snakeSection[j].kill();
    }
    this.alive = false;
    this.snakeHead.kill();
    this.OldPath = [];
    this.snakePath = [];
    

}


EnemySnake.prototype.update = function() {

    var that = this;

        if(this.alive == true){    
            
            game.physics.arcade.overlap(this.snakeHead, stars, collectStar);
            this.snakeHead.body.velocity.setTo(0, 0);
            this.snakeHead.body.angularVelocity = 0;
        }
        if(this.alive == true){    
            if(this.snakeHead.score%10===1)
            {
                var path = this.snakePath[this.numSnakeSections*this.snakeSpacer];

                this.numSnakeSections +=1;

                this.snakeSection[this.numSnakeSections-1] = game.add.sprite(path.x, path.y, 'ball');
                this.snakeSection[this.numSnakeSections-1].anchor.setTo(0.5, 0.5);

                for(var i=0;i<this.snakeSpacer;i++){

                    this.snakePath.push(this.OldPath[i]);

                }
                this.snakeHead.score+=1;
            }
            
            else {
                //How AI do the decision//
                this.snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(this.snakeHead.angle, 300));

                // Everytime the snake head moves, insert the new location at the start of the array, 
                // and knock the last position off the end

                

                //console.log(snakeHead,snakeSection);
                this.OldPath.unshift(this.snakePath.pop());
                this.OldPath.pop();

                var part = new Phaser.Point(this.snakeHead.x, this.snakeHead.y);

                this.snakePath.unshift(part);

                for (var i = 1; i <= this.numSnakeSections - 1; i++)
                {
                    this.snakeSection[i].x = (this.snakePath[i * this.snakeSpacer]).x;
                    this.snakeSection[i].y = (this.snakePath[i * this.snakeSpacer]).y;
                }

                
        }
    }

};

//--------//


//  game start//
var game = new Phaser.Game(1200, 800, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update,render : render });


//  載入素材//
function preload() {

    game.load.image('ball','assets/sprites/shinyball.png');
    game.load.image('earth', 'assets/games/tanks/scorched_earth.png');
    game.load.image('bullet', 'assets/games/tanks/bullet.png');

}

var snakeHead; //head of snake sprite
var snakesection = new Array(); //array of sprites that make the snake body sections
var snakePath = new Array();
var oldPath = []; //arrary of positions(points) that have to be stored for the path the sections follow
var numSnakeSections = 5; //number of snake body sections
var snakeSpacer = 6; //parameter that sets the spacing between sections


function create() {
    land = game.add.tileSprite(0, 0, 1200, 800, 'earth');//new ground
    land.fixedToCamera = true;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.world.setBounds(0, 0, 1200, 800);

    cursors = game.input.keyboard.createCursorKeys();

    //  create snakeHead//
    snakeHead = game.add.sprite(400, 300, 'ball');
    snakeHead.score = 0;
    snakeHead.anchor.setTo(0.5, 0.5);

    game.physics.enable(snakeHead, Phaser.Physics.ARCADE);
    snakeHead.body.drag.set(0.2);
    snakeHead.body.maxVelocity.setTo(400, 400);
    snakeHead.body.collideWorldBounds = true;

    //--------//

    //  create enemy into list//
    enemies = [];

    enemiesTotal = 5;

    for (var i = 0; i < enemiesTotal; i++)
    {
        enemies.push(new EnemySnake(i, game));
    }
    //--------//

    //  make a group of stars//
    stars = game.add.group(); 
    stars.enableBody = true;
    for (var i = 0; i < 50; i++) {
        generateStar();
    }

    //  Init snakeSection array//
    for (var i = 1; i <= numSnakeSections-1; i++)
    {
        snakesection[i] = game.add.sprite(400, 300, 'ball');
        game.physics.enable(snakesection[i], Phaser.Physics.ARCADE);
        snakesection[i].anchor.setTo(0.5, 0.5);
    }
    
    //  Init snakePath array
    for (var i = 0; i <= numSnakeSections * snakeSpacer; i++)
    {
        snakePath[i] = new Phaser.Point(400, 300);
        oldPath[i] = new Phaser.Point(400,300);
    }
    snakeHead.bringToTop();
    


}

function update() {
    game.physics.arcade.overlap(snakeHead, stars, collectStar, null, this);
    snakeHead.body.velocity.setTo(0, 0);
    snakeHead.body.angularVelocity = 0;
    
    //update enemy//
    for (var i=0;i<enemiesTotal;i++){
        enemies[i].update();
        game.physics.arcade.overlap(enemies[i].snakeHead, snakesection, function(){enemies[i].kill()});
        game.physics.arcade.overlap(enemies[i].snakeSection, snakeHead , kill);
        for(var j = 0;j<enemiesTotal;j++){
            //AI
            if(i != j){
                if (this.game.physics.arcade.distanceBetween(enemies[i].snakeHead, enemies[j].snakeHead) < 200){
                    var change = Math.random()*10 ;
                    if(change >= 5 ){
                        enemies[i].snakeHead.body.angularVelocity = -300*change;
                    }
                    else{
                        enemies[i].snakeHead.body.angularVelocity = 600*change;
                    }
                
                }
                if (this.game.physics.arcade.distanceBetween(enemies[i].snakeHead, snakeHead ) < 200){
                    var change = Math.random()*10 ;
                    if(change >= 5 ){
                        enemies[i].snakeHead.body.angularVelocity = -300*change;
                    }
                    else{
                        enemies[i].snakeHead.body.angularVelocity = 600*change;
                    }
                
                }
                for(var a =1;a<numSnakeSections;a++){
                if (this.game.physics.arcade.distanceBetween(enemies[i].snakeHead, snakesection[a] ) < 200){
                    var change = Math.random()*10 ;
                    if(change >= 5 ){
                        enemies[i].snakeHead.body.angularVelocity = -300*change;
                    }
                    else{
                        enemies[i].snakeHead.body.angularVelocity = 600*change;
                    }
                }
                
                }
                if(enemies[i].snakeHead.x - (game.world.x+game.world.width) >= -100|| enemies[i].snakeHead.y - (game.world.y+game.world.height) >= -100){
                    var change = Math.random()*10 ;
                    if(change >= 5 ){
                        enemies[i].snakeHead.body.angularVelocity = -300*change;
                    }
                    else{
                        enemies[i].snakeHead.body.angularVelocity = 600*change;
                    }
                }
                if(enemies[i].snakeHead.x < 100 || enemies[i].snakeHead.y < 100){
                    var change = Math.random()*10 ;
                    if(change >= 5 ){
                        enemies[i].snakeHead.body.angularVelocity = -300*change;
                    }
                    else{
                        enemies[i].snakeHead.body.angularVelocity = 600*change;
                    }
                }
                game.physics.arcade.overlap(enemies[i].snakeSection, enemies[j].snakeHead , function(){enemies[j].kill()});//AI間頭與身體碰撞死亡
            }       
        }
    }

    //according to the score change the length of snake//
    if(snakeHead.alive == true){
        if(snakeHead.score%10===9)
        {
            grow();
        }
        else {

            if(cursors.up.isDown){
                ahead();
            }
            
        }
        
        if(cursors.left.isDown)
        {
            snakeHead.body.angularVelocity = -300;
        }
        else if (cursors.right.isDown)
        {
            snakeHead.body.angularVelocity = 300;
        }

        land.tilePosition.x = -game.camera.x;
        land.tilePosition.y = -game.camera.y;
    }
};

//news what I want//
function render() {

    game.debug.text('Score: 0'+snakeHead.score ,32 ,16);
    game.debug.spriteInfo(snakeHead, 32, 32);

}

//let snake go ahead//
function ahead(){
    if(snakeHead.alive == true){
    snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(snakeHead.angle, 300));

    // Everytime the snake head moves, insert the new location at the start of the array, 
    // and knock the last position off the end

    

    //console.log(snakeHead,snakeSection);
    oldPath.unshift(snakePath.pop());
    oldPath.pop();

    var part = new Phaser.Point(snakeHead.x, snakeHead.y);

    snakePath.unshift(part);

    for (var i = 1; i <= numSnakeSections - 1; i++)
    {
        snakesection[i].x = (snakePath[i * snakeSpacer]).x;
        snakesection[i].y = (snakePath[i * snakeSpacer]).y;
    }
}

}

function generateStar() {
  var star = stars.create(Math.random() * 1200, Math.random() * 800, 'bullet');
  star.anchor.setTo(Math.random(), Math.random());
  star.body.bounce.y = Math.random() ;
  star.body.bounce.x = Math.random() ;
}

function collectStar(snakeHead, star) {
  star.destroy(); // remove the star that has collided with the player
  generateStar();
  snakeHead.score+=1;


}
function grow(){
    
    var path = snakePath[numSnakeSections*snakeSpacer];
    numSnakeSections +=1;
    snakesection[numSnakeSections-1] = game.add.sprite(path.x, path.y, 'ball');
    snakesection[numSnakeSections-1].anchor.setTo(0.5, 0.5);

    for(var i=0;i<snakeSpacer;i++){

        snakePath.push(oldPath[i]);

    }
    snakeHead.score+=1;
}

var kill = function () {
    for(var j = 1 ; j < numSnakeSections ; j++){
        snakesection[j].kill();
    }
    
    snakeHead.kill();
    oldPath = [];
    snakePath = [];

}