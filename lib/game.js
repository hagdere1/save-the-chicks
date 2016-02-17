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


    ctx.clearRect(0, 0, this.dim_x, this.dim_y);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.dim_x, this.dim_y);

    // Display remaining lives
    ctx.font = "32px serif";
    ctx.fillStyle = "green";
    ctx.fillText("Lives: " + this.chicken.lives, 400, 70);
    ctx.fillText("Eggs Collected: " + this.eggsCollected, 400, 110);

    this.eggs.forEach(function (egg) {
      egg.draw(ctx);
    });
    this.car.draw(ctx);
    this.chicken.draw(ctx);
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
    }, 50);
  };

  Game.prototype.collectEgg = function (egg) {
    this.eggsCollected += 1;
    this.removeEgg(egg);
  };

  Game.prototype.removeEgg = function (egg) {
    this.eggs.splice(this.eggs.indexOf(egg), 1);
  };

  Game.prototype.gameOver = function () {
    if (this.chicken.lives === 0) {
      alert("GAME OVER. Click OK to start a new game.");
      this.newGame();
      return true;
    }
    else {
      return false;
    }
  };

  Game.prototype.newGame = function () {
    document.location.reload(true);
  };

})();
