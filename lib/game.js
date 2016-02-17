(function () {
  if (typeof ChickenRoad === "undefined") {
    this.ChickenRoad = {};
  }

  var Game = ChickenRoad.Game = function (ctx, dim_x, dim_y) {
    this.ctx = ctx;
    this.dim_x = dim_x;
    this.dim_y = dim_y;

    this.eggs = [];
    this.eggsCollected = 0;
    this.eggsDelivered = 0;
    this.trucks = [];
    this.cars = [];
    this.chicken = new ChickenRoad.Chicken(this);
    // this.nest = new ChickenRoad.Nest();

    this.car = new ChickenRoad.Car(this, "left");
  };



  Game.MOVES = {
    "w": [ 0, -1],
    "a": [-1,  0],
    "s": [ 0,  1],
    "d": [ 1,  0],
  };

  Game.prototype.randomPosition = function () {
    var x = (Math.random() * 600) + 50;
    var y = (Math.random() * 400) + 50;
    return [x, y];
  };

  Game.prototype.bindKeyHandlers = function () {
    var chicken = this.chicken;
    Object.keys(Game.MOVES).forEach(function(k) {
      var move = Game.MOVES[k];
      key(k, function () { chicken.move(move); });
    });
  };

  Game.prototype.addEggs = function (num) {
    for (var i = 0; i < num; i++) {
      this.eggs.push(new ChickenRoad.Egg(this, this.randomPosition()));
    }
    this.eggsRemaining = this.eggs.length/2;
  };

  Game.prototype.setBackground = function () {
    var background = new Image();
    background.src = 'images/road_background.jpg';

    background.addEventListener("load", function () {
      this.ctx.drawImage(background, 0, 0);
    }.bind(this), false);
  };

  Game.prototype.setChickenImage = function () {
    var chickenIMG = new Image();
    chickenIMG.src = this.chicken.image;
    chickenIMG.addEventListener("load", function () {
      this.ctx.drawImage(chickenIMG, this.chicken.pos[0], this.chicken.pos[1]);
    }.bind(this));
  };

  Game.prototype.drawText = function () {
    // Display remaining lives
    this.ctx.font = "32px serif";
    this.ctx.fillStyle = "orange";
    this.ctx.fillText("Lives: " + this.chicken.lives, 400, 70);
    this.ctx.fillText("Eggs Collected: " + this.eggsCollected, 400, 110);
    this.ctx.fillText("Eggs Needed: " + this.eggsRemaining, 400, 150);
  };

  Game.prototype.drawTimer = function () {

  };

  Game.prototype.drawObjects = function () {
    var that = this;

    this.eggs.forEach(function (egg) {
      egg.draw(that.ctx);
    });
    // this.chicken.draw(that.ctx);
    this.setChickenImage();
    this.car.draw(that.ctx);
  };

  Game.prototype.drawScreen = function (ctx) {
    // this.eggs.forEach(function (egg) {
    //   egg.draw();
    // });
    // this.trucks.forEach(function (truck) {
    //   truck.draw();
    // });
    // this.cars.forEach(function (car) {
    //   car.draw();
    // });
    //
    // this.setBackground();


    ctx.clearRect(0, 0, this.dim_x, this.dim_y);



    this.drawText();
    this.drawObjects();



    // this.nest.draw();
  };

  Game.prototype.start = function() {
    var that = this;
    this.bindKeyHandlers();
    this.addEggs(10);
    setInterval(function () {
      that.drawScreen(that.ctx);
      that.car.move();
      that.car.collideWith(that.chicken);
      that.eggs.forEach(function (egg) {
        egg.collideWith(that.chicken);
      });
      that.gameOver();
      // that.moveVehicles();
      // that.checkCollisions();
    }, 30);
  };

  Game.prototype.collectEgg = function (egg) {
    this.eggsCollected += 1;
    if (this.eggsRemaining > 0) {
      this.eggsRemaining -= 1;
    }
    this.removeEgg(egg);
  };

  Game.prototype.removeEgg = function (egg) {
    this.eggs.splice(this.eggs.indexOf(egg), 1);
  };

  Game.prototype.gameOver = function(){
    if (this.chicken.lives === 0) {
        var r = confirm("You Lose!, Would you like to play again?");
      if (r === true) {
          txt = "Let's play another round!";
          document.location.reload();
      }
    }
};

})();
