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
    this.chicken = new ChickenRoad.Chicken(this);

    this.seconds = 30;

    this.numCarsPerLane = 2;
    // this.nest = new ChickenRoad.Nest();

  };

  Game.MOVES = {
    "w": [ 0, -1],
    "a": [-1,  0],
    "s": [ 0,  1],
    "d": [ 1,  0],
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
    var y = 98;
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

  Game.prototype.setChickenImage = function () {
    var chickenIMG = new Image();
    chickenIMG.src = this.chicken.image;

    this.ctx.drawImage(chickenIMG, this.chicken.pos[0] - 18, this.chicken.pos[1] - 25);
  };

  Game.prototype.setCarsImage = function () {
    this.cars.forEach(function (car) {
      if (car.direction === "left") {
        car.image = car.image_left_array[car.setRandom(car.image_left_array)];
      }
      else {
        car.image = car.image_right_array[car.setRandom(car.image_right_array)];
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
      heartIMG.src = "images/heart.png";
      this.ctx.drawImage(heartIMG, x, 40);
      x += 30;
    }
  };

  Game.prototype.drawText = function () {
    // Display remaining lives

  };

  Game.prototype.drawLevel = function () {
    this.ctx.font = "32px georgia";
    this.ctx.fillStyle = "blue";
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

    // this.eggs.forEach(function (egg) {
    //   egg.draw(that.ctx);
    // });

    // this.chicken.draw(that.ctx);
    this.setChickenImage();

    this.cars.forEach(function (car) {
      // car.draw(that.ctx);
      var carIMG = new Image();
      carIMG.src = car.image;
      that.ctx.drawImage(carIMG, car.pos[0], car.pos[1] - 10);
    });

  };

  Game.prototype.drawScreen = function (ctx) {
    ctx.clearRect(0, 0, this.dim_x, this.dim_y);

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

      if (this.level === 2) {
        this.totalEggs = 2;
      }
      else {
        this.totalEggs += 2;
      }

      this.seconds = 30 + ((this.level - 1) * 5);
      this.addEggs(this.totalEggs);

      this.cars.forEach(function (car) {
        car.speed[0] += 2;
      });
    }

  };

  Game.prototype.gameOver = function () {
    if (this.chicken.lives === 0 || this.seconds === 0) {
      alert("You failed the children... Press OK to try again!");
      document.location.reload();
    }
  };

})();
