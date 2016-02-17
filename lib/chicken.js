(function () {
  if (typeof ChickenRoad === "undefined") {
    this.ChickenRoad = {};
  }

  var Chicken = ChickenRoad.Chicken = function (game, level) {
    this.pos = [game.dim_x/2, game.dim_y-30];
    this.speed = 5;
    this.radius = 6;
    this.lives = 3;
    this.color = "white";
    this.level = level || 1;
    this.game = game;
  };

  Chicken.prototype.move = function (offset) {
    this.pos[0] += 20 * offset[0];
    this.pos[1] += 20 * offset[1];
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
    this.pos = [this.game.dim_x/2, this.game.dim_y-30];
    this.lives -= 1;
    console.log(this.lives);
  };

})();
