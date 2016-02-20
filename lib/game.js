(function () {
  if (typeof ChickenRoad === "undefined") {
    this.ChickenRoad = {};
  }

  var Game = ChickenRoad.Game = function (ctx, dim_x, dim_y) {
    this.ctx = ctx;
    this.dim_x = dim_x;
    this.dim_y = dim_y;

    this.level = 1;
    this.eggs = [];
    this.totalEggs = 1;
    this.eggsCollected = 0;
    this.eggsDelivered = 0;
    this.trucks = [];
    this.cars = [];
    this.extraLives = [];
    this.chicken = new ChickenRoad.Chicken(this);

    this.deathLocations = [];
    this.seconds = 30;
    this.numCarsPerLane = 2;

    this.heart = "images/heart.png";
    // this.nest = new ChickenRoad.Nest();

    // var soundEfx; // Sound Efx
    // var soundLoad = "over.wav"; //Game Over sound efx


  };

  Game.MOVES = {
    "w": [ 0, -1],
    "a": [-1,  0],
    "s": [ 0,  1],
    "d": [ 1,  0],
    "up": [ 0, -1],
    "left": [-1,  0],
    "down": [ 0,  1],
    "right": [ 1,  0],
  };

  Game.prototype.randomPosition = function () {
    var x = (Math.random() * 900) + 50;
    var y = (Math.random() * 400) + 50;
    return [x, y];
  };

  Game.prototype.bindKeyHandlers = function () {
    var chicken = this.chicken;
    Object.keys(Game.MOVES).forEach(function(k) {
      var move = Game.MOVES[k];
      key(k, function () { chicken.move(move, k); });
    });
  };

  Game.prototype.addEggs = function (num) {
    for (var i = 0; i < num; i++) {
      this.eggs.push(new ChickenRoad.Egg(this, this.randomPosition()));
    }
  };

  Game.prototype.addCars = function () {
    var direction = "left";
    var x = 0;
    var y = 90;
    var pos = [x, y];

    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < this.numCarsPerLane; j++) {
        this.cars.push(new ChickenRoad.Car(this, direction, pos));
        x += 450;
        pos = [x, y];
      }
      x = 0;
      y += 110;
      pos = [x, y];

      if (direction === "left") {
        direction = "right";
      }
      else {
        direction = "left";
      }
    }

  };

  Game.prototype.setRandom = function (array) {
    return Math.floor(Math.random() * array.length);
  };

  Game.prototype.setChickenImage = function () {
    var chickenIMG = new Image();
    chickenIMG.src = this.chicken.image;

    this.ctx.drawImage(chickenIMG, this.chicken.pos[0] - 18, this.chicken.pos[1] - 25);
  };

  Game.prototype.setCarsImage = function () {
    this.cars.forEach(function (car) {
      if (car.direction === "left") {
        car.image = car.imageLeftArray[car.setRandom(car.imageLeftArray)];
      }
      else {
        car.image = car.imageRightArray[car.setRandom(car.imageRightArray)];
      }
    });
  };

  Game.prototype.setEggsImage = function () {
    var that = this;
    this.eggs.forEach(function (egg) {
      var eggIMG = new Image();
      eggIMG.src = egg.image;

      that.ctx.drawImage(eggIMG, egg.pos[0] - 5, egg.pos[1] - 5);
    });
  };

  Game.prototype.setEggsRemaining = function () {
    var bigEggIMG = new Image();
    bigEggIMG.src = "images/big_egg.png";
    this.ctx.drawImage(bigEggIMG, 860, 15);

    this.ctx.font = "40px georgia";
    this.ctx.fillStyle = "blue";
    this.ctx.fillText(this.eggsCollected + "/" + this.totalEggs, 905, 50);
  };

  Game.prototype.setLivesImage = function () {
    var x = 30;
    for (var i = 0; i < this.chicken.lives; i++) {
      var heartIMG = new Image();
      heartIMG.src = this.heart;
      this.ctx.drawImage(heartIMG, x, 40);
      x += 30;
    }
  };

  Game.prototype.drawLevel = function () {
//     context.fillStyle = 'red';
// context.strokeStyle = 'black';
//
// context.font = '20pt Verdana';
// context.fillText('Some text', 50, 50);
// context.strokeText('Some text', 50, 50);
//
// context.fill();
// context.stroke();

    this.ctx.font = "bold 32px georgia";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Level " + this.level, 30, 30);
  };

  Game.prototype.drawTimer = function () {
    this.ctx.font = "50px georgia";
    this.ctx.fillStyle = "red";

    var minutes = Math.floor(this.seconds/60);
    var that = this;
    if (this.minutes > 0) {
      var remainder = this.seconds % 60;
      if (this.seconds > 9) {
        this.ctx.fillText(minutes + ":" + remainder, that.dim_x/2 - 35, 45);
      }
      else {
        this.ctx.fillText(minutes + ":0" + remainder, that.dim_x/2 - 35, 45);
      }
    }
    else {
      if (this.seconds > 9) {
        this.ctx.fillText(minutes + ":" + this.seconds, that.dim_x/2 - 35, 45);
      }
      else {
        this.ctx.fillText(minutes + ":0" + this.seconds, that.dim_x/2 - 35, 45);
      }
    }
  };

  Game.prototype.setTimer = function () {
    setInterval(function () {
      this.seconds -= 1;
    }.bind(this), 1000);
  };

  Game.prototype.drawObjects = function () {
    var that = this;

    this.setEggsImage();
    this.drawExtraLives();
    // this.eggs.forEach(function (egg) {
    //   egg.draw(that.ctx);
    // });

    // this.chicken.draw(that.ctx);
    this.setChickenImage();

    this.cars.forEach(function (car) {
      // car.draw(that.ctx);
      var carIMG = new Image();
      carIMG.src = car.image;
      if (car.direction === "left") {
        that.ctx.drawImage(carIMG, car.pos[0], car.pos[1]);
      }
      else {
        that.ctx.drawImage(carIMG, car.pos[0], car.pos[1]);
      }

    });

  };

  Game.prototype.drawScreen = function (ctx) {
    ctx.clearRect(0, 0, this.dim_x, this.dim_y);

    this.drawDead();
    this.drawLevel();
    this.setEggsRemaining();
    this.setLivesImage();
    this.drawTimer();
    this.drawObjects();

    // this.nest.draw();
  };

  Game.prototype.start = function() {
    var that = this;
    this.bindKeyHandlers();
    this.addEggs(this.totalEggs);
    this.addCars();
    this.setTimer();
    this.setCarsImage();

    setInterval(function () {
      that.upLevel();
      that.gameOver();

      that.drawScreen(that.ctx);

      that.cars.forEach(function (car) {
        car.move();
      });

      that.cars.forEach(function (car) {
        car.collideWith(that.chicken);
      });

      that.eggs.forEach(function (egg) {
        egg.collideWith(that.chicken);
      });

      that.extraLives.forEach(function (life) {
        life.collideWith(that.chicken);
      });

      // that.moveVehicles();
      // that.checkCollisions();
    }, 30);
  };

  Game.prototype.collectEgg = function (egg) {
    this.eggsCollected += 1;
    this.removeEgg(egg);
  };

  Game.prototype.removeEgg = function (egg) {
    this.eggs.splice(this.eggs.indexOf(egg), 1);
  };

  Game.prototype.upLevel = function () {

    if (this.eggsCollected === this.totalEggs) {
      this.level += 1;
      this.chicken.relocate();
      this.eggsCollected = 0;

      if (this.extraLives.length > 0) {
        this.removeHeart();
      }

      if (this.level === 2) {
        this.totalEggs = 2;
      }
      else {
        this.totalEggs += 2;
      }

      this.seconds = 30 + ((this.level - 1) * 5);
      this.addEggs(this.totalEggs);
      this.placeExtraLife();

      this.cars.forEach(function (car) {
        car.speed[0] += 1;
      });
    }

  };

  Game.prototype.placeExtraLife = function () {
    if (this.level > 1 && this.level % 2 !== 0) {
      var position = this.randomPosition();
      var heart = new ChickenRoad.Heart(this, position);
      this.extraLives.push(heart);
    }
  };

  Game.prototype.drawExtraLives = function () {
    var that = this;
    this.extraLives.forEach(function (heart) {
      // heart.draw(that.ctx);
      var heartIMG = new Image();
      heartIMG.src = heart.image;
      that.ctx.drawImage(heartIMG, heart.pos[0] - 15, heart.pos[1] - 12);
    });
  };

  Game.prototype.collectLife = function (heart) {
    this.chicken.lives += 1;
    this.removeHeart(heart);
  };

  Game.prototype.removeHeart = function (heart) {
    this.extraLives.splice(this.extraLives.indexOf(heart), 1);
  };

  Game.prototype.drawDead = function () {
    if (this.deathLocations.length > 0) {
      this.deathLocations.forEach(function (location) {
        var bloodIMG = new Image();
        bloodIMG.src = "./images/blood_1.png";
        this.ctx.drawImage(bloodIMG, location[0] - 40, location[1] - 30);
      }.bind(this));
    }
  };

  Game.prototype.gameOver = function () {
    if (this.chicken.lives === 0 || this.seconds === 0) {
      alert("You failed the children... Press OK to try again!");
      document.location.reload();
    }
  };

})();
