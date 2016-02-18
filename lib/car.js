(function () {
  if (typeof ChickenRoad === "undefined") {
    this.ChickenRoad = {};
  }

  var Car = ChickenRoad.Car = function (game, direction, pos) {
    this.speed = [1, 0];
    this.direction = direction;
    this.pos = pos;
    this.width = 170;
    this.height = 90;
    this.color = "purple";
    this.image_left_array = ["images/classy_blue_car_left.png", "images/silver_car_left.png", "images/blue_car_left.png", "images/96A_mercedes_left.png", "images/batmanreturnsbatmobile4_left.png", "images/old_car_left.png"];
    this.image_right_array = ["images/silver_car_right.png", "images/blue_car_right.png", "images/96A_mercedes_right.png", "images/batmanreturnsbatmobile4_right.png", "images/old_car_right.png"];
    this.game = game;
  };

  Car.prototype.setRandom = function (array) {
    return Math.floor(Math.random() * array.length);
  };

  Car.prototype.move = function () {
    if (this.direction === "right") {
      this.pos[0] += this.speed[0];
    }
    else {
      this.pos[0] += this.speed[0] * -1;
    }
    this.wrap();
  };

  Car.prototype.wrap = function () {
    if (this.pos[0] + this.width <= 0) {
      this.pos[0] = this.game.dim_x;
    }
    else if (this.pos[0] - this.width >= this.game.dim_x) {
      this.pos[0] = 0 - this.width;
    }
  };

  Car.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.rect(
      this.pos[0], this.pos[1], this.width, this.height
    );
    ctx.fill();
  };

  Car.prototype.collideWith = function (chicken) {
    if ((chicken.pos[0] <= this.pos[0] + this.width && chicken.pos[0] >= this.pos[0]) &&
    (chicken.pos[1] <= this.pos[1] + this.height && chicken.pos[1] >= this.pos[1]))  {
      chicken.killChicken();
    }
  };

})();
