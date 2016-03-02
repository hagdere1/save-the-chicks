(function () {
  if (typeof ChickenRoad === "undefined") {
    this.ChickenRoad = {};
  }

  var Chicken = ChickenRoad.Chicken = function (game) {
    this.pos = [game.dim_x/2, game.dim_y-30];
    this.speed = 20;
    this.radius = 20;
    this.lives = 3;
    this.image = "images/chicken_back_center.png";
    this.imagesFront = ["images/chicken_front_center.png", "images/chicken_front_left.png", "images/chicken_front_center.png", "images/chicken_front_right.png"];
    this.lastKey = "w";
    this.lastImageIndex = 0;
    this.color = "white";
    this.game = game;

  };

  Chicken.prototype.move = function (offset, k) {
    this.moveHelper(k);
    // if (this.pos[0] < 0 || this.pos[0] + this.radius > game.dim_x) {
    //  offset = [0, offset[1]];
    // }
    // if (this.pos[1] < 0 || this.pos[1] + this.radius > game.dim_y) {
    //  offset = [offset[0], 0];
    // }

    if ((this.pos[0] - this.radius <= 0 && offset[0] < 0) ||
        (this.pos[0] + this.radius >= this.game.dim_x && offset[0] > 0)) {
      this.pos[0] += 0;
    }
    else {
      this.pos[0] += this.speed * offset[0];
    }

    if ((this.pos[1] - this.radius <= 0 && offset[1] < 0) ||
        (this.pos[1] + this.radius >= this.game.dim_y && offset[1] > 0)) {
      this.pos[1] += 0;
    }
    else {
      this.pos[1] += this.speed * offset[1];
    }

  };

  Chicken.prototype.moveHelper = function (k) {
    if (k === "w" || k === "up") {
      this.image = "images/chicken_back_center.png";
      this.lastKey = k;
    }

    else if (k === "s" || k === "down") {
      this.image = "images/chicken_front_center.png";
      this.lastKey = "s";
    }

    else if (k === "a" || k === "left") {
      this.image = "images/chicken_left_center.png";
      this.lastKey = k;
    }

    else if (k === "d" || k === "right") {
      this.image = "images/chicken_right_center.png";
      this.lastKey = k;
    }

  };

  Chicken.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
  };

  Chicken.prototype.killChicken = function () {
    this.game.deathLocations.push(this.pos);
    this.relocate();
    this.lives -= 1;
  };

  Chicken.prototype.relocate = function () {
    this.pos = [this.game.dim_x/2, this.game.dim_y-30];
  };

})();
