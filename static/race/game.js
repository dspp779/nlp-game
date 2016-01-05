var game;

var questions = [{
    'question': 'However, my class and I have seen an advertisement _ a fashion and leisure show.',
    'options': ['about', 'of', 'on', 'for'],
    'answer': 'for'
}, {'question': 'Nowadays the main attraction in the newspapers and _ television is the private lives of famous people.',
    'options': ['on', 'to', 'of', 'for'],
    'answer': 'on'
}, {'question': 'At the end we could have a comment _ each student in our class.',
    'options': ['in', 'of', 'to', 'from'],
    'answer': 'from'
}];

var user_score;
var user_life;
var current_question_index;

var cars = [];
var carColors = [0xff0000];
var carTurnSpeed = 250;

var carGroup;
var obstacleGroup;
var targetGroup;

var obstacleSpeed = 150;
var obstacleDelay = 1400;

function initRace() {
    user_score = 0;
    user_life = 3;
    current_question_index = -1;
    
    // start game canvas
    game = new Phaser.Game(320, 480, Phaser.AUTO, "");
    game.state.add("PlayGame",playGame);
    game.state.start("PlayGame");
    
    next_question();
    refreshInfo();
}

function refreshInfo() {
    $('.correct').text(user_score.toString());
    $('.life > span:lt('+user_life+')').css('color', 'red');
    $('.life > span:gt('+(user_life-1)+')').css('color', 'grey');
}

function next_question() {
    current_question_index = (current_question_index+1) % questions.length;
    var question = questions[current_question_index];
    $('p.question').html(question.question.replace('_', '<select disabled></select>'));
    var anwser_option = rand(2);
    $('.option:eq('+anwser_option+')').find('span').text(question.answer);
    $('.option:eq('+(1-anwser_option)+')').find('span').text(randOption(question));
    $('.option').find('span').css('color', 'black');
}

function rand(n) {
    return Math.floor(Math.random() * n);
}

function randOption(question) {
    var t = question.options[rand(question.options.length)]
    while (t == question.answer)
        t = question.options[rand(question.options.length)];
    return t;
}

function select(n) {
    var user_answer = $('.option:eq('+n+')').find('span').text();
    var question = questions[current_question_index];
    
    if(user_answer == question.answer) {
        user_score++;
        next_question();
    } else {
        user_life--;
        $('.option:eq('+~n+')').find('span').css('color', 'red');
    }
    refreshInfo();
    // end game
    if(user_life <= 0) {
        game.state.destroy();
        $('.life > span').css('color', 'grey');
        $('#gameover').slideDown(500);
    }
}


window.onload = function() {	
    initRace();
}

var playGame = function(game){};

playGame.prototype = {
	preload: function(){
          game.load.image("road", "road.png");
          game.load.image("target", "target.png");
          game.load.image("car", "car.png");
          game.load.image("obstacle", "obstacle.png");
	},
  	create: function(){
          game.add.image(0, 0, "road");
          game.physics.startSystem(Phaser.Physics.ARCADE);
          carGroup = game.add.group();
          obstacleGroup = game.add.group();
          targetGroup = game.add.group();
          for(var i = 0; i < 1; i++){
               cars[i] = game.add.sprite(0, game.height - 80, "car");
               cars[i].positions = [game.width/8, game.width*3/8, game.width*5/8, game.width*7/8];
               cars[i].anchor.set(0.5);
               cars[i].tint = carColors[i];  
               cars[i].canMove = true;
               cars[i].side = i;
               cars[i].x = cars[i].positions[cars[i].side];
               game.physics.enable(cars[i], Phaser.Physics.ARCADE); 
               cars[i].body.allowRotation = false;
               cars[i].body.moves = false;  
               carGroup.add(cars[i]);
          }
          game.input.onDown.add(onMouseDownHandle);
          game.input.keyboard.onDownCallback = keyHandle;
          game.time.events.loop(obstacleDelay, function(){
               for(var i = 0; i < 2; i++){
                    if(game.rnd.between(0, 1) == 1){
                         var obstacle = new Obstacle(game, i);
                         game.add.existing(obstacle);
                         obstacleGroup.add(obstacle);  
                    }
                    else{
                         var target = new Target(game, i);
                         game.add.existing(target);
                         targetGroup.add(target);        
                    }
               }
          });          
	},
     update: function(){
          game.physics.arcade.collide(carGroup, obstacleGroup, function(c, o){
              //game.state.start("PlayGame");
              select(1);
              o.destroy()
          });
          game.physics.arcade.collide(carGroup, targetGroup, function(c, o){
              select(0);
              o.destroy()
          });
     }
}

function keyHandle(e) {
    switch(e.keyCode) {
        case 37:
            moveCar(-1);
            break;
        case 39:
            moveCar(1);
            break;
        case 38:
        case 40:
        default: break;
    }
}

function onMouseDownHandle(e) {
    var carToMove = 0;
    var sideClicked = Math.floor(e.position.x / (game.width / 4));
    moveCar(sideClicked - cars[carToMove].side)
}

function moveCar(move) {
     var carToMove = 0;
     if(cars[carToMove].canMove){
          var steerTween = game.add.tween(cars[carToMove]).to({
               angle: 20 - 40 * cars[carToMove].side
          }, carTurnSpeed / 2, Phaser.Easing.Linear.None, true);
          steerTween.onComplete.add(function(){
               var steerTween = game.add.tween(cars[carToMove]).to({
                    angle: 0
               }, carTurnSpeed / 2, Phaser.Easing.Linear.None, true);
          })
          new_position = cars[carToMove].side + move
          if(new_position < 0 || new_position > 3) return;
          cars[carToMove].side = cars[carToMove].side + move;
          cars[carToMove].canMove = false;
          var moveTween = game.add.tween(cars[carToMove]).to({ 
               x: cars[carToMove].positions[cars[carToMove].side],
          }, carTurnSpeed, Phaser.Easing.Linear.None, true);
          moveTween.onComplete.add(function(){
               cars[carToMove].canMove = true;
          })
     }
}

Obstacle = function (game, lane) {
    var position = game.rnd.between(0, 1) + 2 * lane;
    Phaser.Sprite.call(this, game, game.width * (position * 2 + 1) / 8, -20, "obstacle");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.set(0.5);
    this.tint = 0x00ff00;
};

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function() {
	this.body.velocity.y = obstacleSpeed;
	if(this.y > game.height + this.height){
		this.destroy();
	}
};

Target = function (game, lane) {
    var position = game.rnd.between(0, 1) + 2 * lane;
    Phaser.Sprite.call(this, game, game.width * (position * 2 + 1) / 8, -20, "target");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.set(0.5);
    this.tint = 0xffff00;
};

Target.prototype = Object.create(Phaser.Sprite.prototype);
Target.prototype.constructor = Target;

Target.prototype.update = function() {
	this.body.velocity.y = obstacleSpeed;
	if(this.y > game.height + this.height){
        this.destroy();
	}
};