var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("jumping sound.wav")
  collidedSound = loadSound("roar.mp3")
  
  backgroundImg = loadImage("lava.gif")
  
  trex_running = loadImage("Scary trex.png");
  trex_collided = loadImage("Trex collided.png");
  
groundImage = loadImage("Screen Shot 2021-03-12 at 4.29.23 PM.png");
  
  cloudImage = loadImage("Clouding.png");
  
  obstacle1 = loadImage("obstacle number 1.png");
  obstacle2 = loadImage("Obstacle number 2.png");
  obstacle3 = loadImage("Obstacle number 3.png");
  obstacle4 = loadImage("Obstacle number 4.png");
  
  gameOverImg = loadImage("game over.jpeg");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas (displayWidth - 30, displayHeight-130);
  
  trex = createSprite(50,height-60,30,40);
  trex.addAnimation("running",trex_running);
  trex.scale = 0.2;
  trex.addAnimation("collided",trex_collided);

  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.4;
  restart.scale = 0.2;

  gameOver.visible = false;
  restart.visible = false;
  
 


  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {

  camera.x = trex.x;
  camera.y = trex.y;

  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);

  gameOver.position.x = restart.position.x = camera.x
  
  if(keyDown("space") && trex.y >= 160) {
      trex.velocityY = -11;
    }
  trex.velocityY = trex.velocityY + 0.7
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-130) {
      jumpSound.play( )
      trex.velocityY = -20;
       touches = [];
    }
    
    trex.velocityY = trex.velocityY + 0.7
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    

    trex.changeAnimation("collided",trex_collided);
    
   
    obstaclesGroup.setLifetimeEach(-5);
    cloudsGroup.setLifetimeEach(-5);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
    if(mousePressedOver(restart)) {
      reset();
    }
  
  }
  
  
  drawSprites();
}

function spawnClouds() {

  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(50,400));
    cloud.addImage(cloudImage);
    cloud.scale = 0.07;
    cloud.velocityX = -3;
    

    cloud.lifetime = 300;
    

    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
   
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)

  
    obstacle.velocityX = -(6 + 3*score/100);
    

    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
       
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;

    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}
