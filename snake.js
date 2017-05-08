var snakeHead;
var snakesection = []; //array of sprites that make the snake body sections
var snakePath = [];
var oldPath = []; //arrary of positions(points) that have to be stored for the path the sections follow
var numSnakeSections = 5; //number of snake body sections
var snakeSpacer = 6; //parameter that sets the spacing between sections
var foods ;
var enemies = [];
var enemiesTotal = 20;
var speed = 200;
var text;


function create() {
	ground = game.add.tileSprite(0, 0, 4000, 4000, 'ground');

	game.world.setBounds(0, 0, 4000, 4000);

	snakeHead = game.add.sprite(400, 300, 'ball');
	snakeHead.anchor.setTo(0.5, 0.5);
  snakeHead.score = 0;
  snakeHead.enableBody = true;
	game.physics.enable(snakeHead, Phaser.Physics.ARCADE);
	snakeHead.body.collideWorldBounds = true;

	//  Init snakeSection array//
    for (var i = 1; i <= numSnakeSections-1; i++)
    {
        snakesection[i] = game.add.sprite(400, 300, 'ball');
        snakesection[i].enableBody = true;
        game.physics.enable(snakesection[i], Phaser.Physics.ARCADE);
        snakesection[i].anchor.setTo(0.5, 0.5);
    }
    
    //  Init snakePath array
    for (var i = 0; i <= numSnakeSections * snakeSpacer; i++)
    {
        snakePath[i] = new Phaser.Point(400, 300);
        oldPath[i] = new Phaser.Point(400,300);
    }

    //  make a group of stars//
    foods = game.add.group(); 
    game.physics.enable(foods, Phaser.Physics.ARCADE);
    foods.enableBody = true;
    for (var i = 0; i < 500; i++) {
        createfood(i);
    }
  
    for (var i = 0; i < enemiesTotal; i++)
    {
        enemies.push(new EnemySnake());
        enemies[i].EnemyHead.index = i ;
    }
  
    game.camera.follow(snakeHead);
    text = game.add.text(0, 0, 'score: '+snakeHead.score, { font: '32px serif' });

      //  This adds a linear gradient to the Text object, which we can
      //  reflect in our particles using the setColor and setAlpha properties.
    text.fixedToCamera = true;
}

function update() {
  snakeHead.body.angularVelocity = 0;
  text.text = 'score: '+snakeHead.score;
  if(snakeHead.score%10===0 && snakeHead.score !== 0)
  {
    grow();
  }
  else {
	  move();
  }
  if(game.input.activePointer.leftButton.isDown){
    speed = 400;
  }
  else{
    speed =200;
  }
	game.physics.arcade.overlap(snakeHead, foods, eat);
  
  for (var i=0;i<enemiesTotal;i++){
    EnemyUpdate(enemies[i]);
  }
}

function move(){
  
  snakeHead.rotation = game.physics.arcade.angleToPointer(snakeHead)
  
	//ahead
	snakeHead.body.velocity = game.physics.arcade.velocityFromRotation(snakeHead.rotation, speed);
  var part = new Phaser.Point(snakeHead.x, snakeHead.y);

    snakePath.unshift(part);
	  //body copy
	  oldPath.unshift(snakePath.pop());
    oldPath.pop();

    

    for (var i = 1; i <= numSnakeSections - 1; i++)
    {
        snakesection[i].x = (snakePath[i * snakeSpacer]).x;
        snakesection[i].y = (snakePath[i * snakeSpacer]).y;
    }
}

function createfood(i) {
	foods.create(Math.random() * 4000, Math.random() * 4000, 'food', i%7);
}

function eat(snakeHead, food) {
  snakeHead.score += 1;
	food.destroy(); // remove the star that has collided with the player
	createfood();
}

function grow(){
    
    var path = oldPath[0];
    
    snakesection[numSnakeSections] = game.add.sprite(path.x, path.y, 'ball');
    snakesection[numSnakeSections].anchor.setTo(0.5, 0.5);
    snakesection[numSnakeSections].enableBody = true;
    game.physics.enable(snakesection[numSnakeSections], Phaser.Physics.ARCADE);

    for(var i=0;i<snakeSpacer;i++){

        snakePath.push(oldPath[i]);

    }
    numSnakeSections +=1;
    snakeHead.score+=1;
}

EnemySnake = function () {
    var x = game.world.randomX;
    var y = game.world.randomY;
    this.StepCount = 0;
    this.numEnemySections = 5;
    this.EnemyPath = [];
    this.EnemyOldPath = [];
    this.EnemySpacer = 6;
    this.EnemySection = [];
    this.alive = true;
  
    this.EnemyHead = game.add.sprite(x, y, 'eball');
    this.EnemyHead.anchor.setTo(0.5, 0.5);
    this.EnemyHead.enableBody = true;
    this.EnemyHead.score = 0;
    game.physics.enable(this.EnemyHead, Phaser.Physics.ARCADE);
  
    this.EnemyHead.body.collideWorldBounds = true;

        //  Init snakeSection array
    for (var i = 1; i <= this.numEnemySections-1; i++)
    {
        this.EnemySection[i] = game.add.sprite(x, y, 'eball');
        this.EnemySection[i].enableBody = true;
        game.physics.enable(this.EnemySection[i], Phaser.Physics.ARCADE);
        this.EnemySection[i].anchor.setTo(0.5, 0.5);
    }
    
    //  Init snakePath array
    for (var i = 0; i <= this.numEnemySections * this.EnemySpacer; i++)
    {
        this.EnemyPath[i] = new Phaser.Point(x,y);
        this.EnemyOldPath[i] = new Phaser.Point(x,y);
    }  
}

function EnemyUpdate(snake){  

  if(snake.alive == true){

      game.physics.arcade.overlap(snake.EnemyHead, foods, eat);
      game.physics.arcade.overlap(snakeHead, snake.EnemySection, kill) ;//
      
      //AI變長
      if(snake.EnemyHead.score%10===0 &&snake.EnemyHead.score !==0 )
      {
        EnemyGrow(snake);
        
      }else {
        //AI移動
        EnemyMove(snake);
        if(snake.StepCount >20+300*Math.random()){
          snake.EnemyHead.rotation = -3.14 + 6.28*Math.random();
          snake.StepCount = 0;
        }
        
        for(var i=0;i<enemies.length;i++){
          
          if(snake.EnemyHead !== enemies[i].EnemyHead){
            game.physics.arcade.overlap(enemies[i].EnemyHead , snake.EnemySection, Enemykill);
          }
          for(var t = 0;t < numSnakeSections ; t++){
            game.physics.arcade.overlap(enemies[i].EnemyHead, snakesection, Enemykill);
          }
        }     
      }
   }
}
function EnemyMove(enemy){
  
      enemy.EnemyHead.body.velocity = game.physics.arcade.velocityFromRotation(enemy.EnemyHead.rotation, 200);      
      enemy.EnemyOldPath.unshift(enemy.EnemyPath.pop());
      enemy.EnemyOldPath.pop();

      var part = new Phaser.Point(enemy.EnemyHead.x, enemy.EnemyHead.y);

      enemy.EnemyPath.unshift(part);

      for (var i = 1; i <= enemy.numEnemySections - 1; i++)
      {
        enemy.EnemySection[i].x = (enemy.EnemyPath[i * enemy.EnemySpacer]).x;
        enemy.EnemySection[i].y = (enemy.EnemyPath[i * enemy.EnemySpacer]).y;
      }
      enemy.StepCount +=1;
}

function EnemyGrow(enemy){
  
        var path = enemy.EnemyPath[enemy.numEnemySections*enemy.EnemySpacer];

        enemy.numEnemySections +=1;

        enemy.EnemySection[enemy.numEnemySections-1] = game.add.sprite(path.x, path.y, 'eball');
        enemy.EnemySection[enemy.numEnemySections-1].anchor.setTo(0.5, 0.5);
        enemy.EnemySection[enemy.numEnemySections-1].enableBody = true;
        game.physics.enable(enemy.EnemySection[enemy.numEnemySections-1], Phaser.Physics.ARCADE);
        
        for(var i=0;i<enemy.EnemySpacer;i++){

          enemy.EnemyPath.push(enemy.EnemyOldPath[i]);

        }
        enemy.EnemyHead.score+=1;
}
function kill(){
  for(var j = 1 ; j < numSnakeSections ; j++){
        snakesection[j].kill();
    }
  snakeHead.kill();
}

function Enemykill(Head){
  for(var j = 1 ; j < enemies[Head.index].numEnemySections ; j++){
    enemies[Head.index].EnemySection[j].kill();
  }
  Head.kill();
}
