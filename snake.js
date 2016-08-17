//---Snake AI---//

EnemySnake = function (index, game) {

    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.numSnakeSections = 5;
    this.snakePath = new Array();;
    this.OldPath = new Array();;
    this.snakeSpacer = 6;
    this.snakeSection = new Array();;
    


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
        this.snakeSection[i] = game.add.sprite(400, 300, 'ball');
        this.snakeSection[i].anchor.setTo(0.5, 0.5);
    }
    
    //  Init snakePath array
    for (var i = 0; i <= this.numSnakeSections * snakeSpacer; i++)
    {
        this.snakePath[i] = new Phaser.Point(400, 300);
        this.OldPath[i] = new Phaser.Point(400,300);
    }
    this.snakeHead.bringToTop();

};


EnemySnake.prototype.update = function() {

    game.physics.arcade.overlap(this.snakeHead, stars, collectStar, null, this);
    this.snakeHead.body.velocity.setTo(0, 0);
    this.snakeHead.body.angularVelocity = 0;

    if(this.snakeHead.score%10===1)
    {
        this.snakeHead.score++;
        this.snakeSection.push(game.add.sprite(this.OldPath[0].x, this.OldPath[0].y, 'ball'));
        this.numSnakeSections +=1;
        this.snakeSection[this.numSnakeSections-1].anchor.setTo(0.5, 0.5);
        for(i=0;i<this.snakeSpacer;i++){
           this.snakePath.push(this.OldPath[i]);
        }
        this.snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(this.snakeHead.angle, 300));
        

        // Everytime the snake head moves, insert the new location at the start of the array, 
        // and knock the last position off the end

        var part = this.snakePath.pop();

        this.OldPath.unshift(part);

        part.setTo(this.snakeHead.x, this.snakeHead.y);

        this.snakePath.unshift(part);

        for (var i = 1; i <= this.numSnakeSections - 1; i++)
        {
            this.snakeSection[i].x = (this.snakePath[i * this.snakeSpacer]).x;
            this.snakeSection[i].y = (this.snakePath[i * this.snakeSpacer]).y;
        }
    }
    else {
        //How AI do the decision//
        
        var change = Math.random()*10 ;
        if(change < 3){
            this.snakeHead.body.angularVelocity = -300;
        }
        else if(change > 7){
            this.snakeHead.body.angularVelocity = 300;
        }
        else{
            this.snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(this.snakeHead.angle, 300));

            // Everytime the snake head moves, insert the new location at the start of the array, 
            // and knock the last position off the end

            var part = this.snakePath.pop();

            this.OldPath.unshift(part);

            part.setTo(this.snakeHead.x, this.snakeHead.y);

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
var OldPath = new Array(); //array of position from old path
var snakeSection = new Array(); //array of sprites that make the snake body sections
var snakePath = new Array(); //arrary of positions(points) that have to be stored for the path the sections follow
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
        snakeSection[i] = game.add.sprite(400, 300, 'ball');
        snakeSection[i].anchor.setTo(0.5, 0.5);
    }
    
    //  Init snakePath and OldPath array//
    for (var i = 0; i <= numSnakeSections * snakeSpacer; i++)
    {
        snakePath[i] = new Phaser.Point(400, 300);
        OldPath[i] = new Phaser.Point(400,300);
    }
    snakeHead.bringToTop();
    game.camera.follow(snakeHead);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);


}

function update() {
    game.physics.arcade.overlap(snakeHead, stars, collectStar, null, this);
    snakeHead.body.velocity.setTo(0, 0);
    snakeHead.body.angularVelocity = 0;

    //update enemy//
    for (i=0;i<enemiesTotal;i++){
        enemies[i].update();
    }

    //according to the score change the length of snake//
    if(snakeHead.score%10===1)
    {
        snakeHead.score++;
        snakeSection.push(game.add.sprite(OldPath[5].x, OldPath[5].y, 'ball'));
        numSnakeSections +=1;
        snakeSection[numSnakeSections-1].anchor.setTo(0.5, 0.5);
        for(i=0;i<snakeSpacer;i++){
           snakePath.push(OldPath[0]);
           OldPath.splice(0,1);
        }
        head();
    }
    else {
        if (1)
        {
            head();    
        }
    }
    

    if (cursors.left.isDown)
    {
        snakeHead.body.angularVelocity = -300;
    }
    else if (cursors.right.isDown)
    {
        snakeHead.body.angularVelocity = 300;
    }
    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;
};

//news what I want//
function render() {

    game.debug.text('Score: 0'+snakeHead.score ,32 ,16);
    game.debug.spriteInfo(snakeHead, 32, 32);

}

//let snake go ahead//
function head(){
    snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(snakeHead.angle, 300));

    // Everytime the snake head moves, insert the new location at the start of the array, 
    // and knock the last position off the end

    var part = snakePath.pop();

    OldPath.unshift(part);

    part.setTo(snakeHead.x, snakeHead.y);

    snakePath.unshift(part);

    for (var i = 1; i <= numSnakeSections - 1; i++)
    {
        snakeSection[i].x = (snakePath[i * snakeSpacer]).x;
        snakeSection[i].y = (snakePath[i * snakeSpacer]).y;
    }
}

function Enemyhead(){
    this.snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(this.snakeHead.angle, 300));

    // Everytime the snake head moves, insert the new location at the start of the array, 
    // and knock the last position off the end

    var part = this.snakePath.pop();

    this.OldPath.unshift(part);

    part.setTo(this.snakeHead.x, this.snakeHead.y);

    this.snakePath.unshift(part);

    for (var i = 1; i <= this.numSnakeSections - 1; i++)
    {
        this.snakeSection[i].x = (this.snakePath[i * this.snakeSpacer]).x;
        this.snakeSection[i].y = (this.snakePath[i * this.snakeSpacer]).y;
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