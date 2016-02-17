(function () {
  if (typeof ChickenRoad === "undefined") {
    this.ChickenRoad = {};
  }

  var Egg = ChickenRoad.Egg = function (game, pos) {
    this.pos = pos;
    this.radius = 5;
    this.color = "white";
    this.game = game;
  };

  Egg.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
  };

  Egg.prototype.collideWith = function (chicken) {
    centerDist = Math.sqrt(
      Math.pow(this.pos[0] - chicken.pos[0], 2) + Math.pow(this.pos[1] - chicken.pos[1], 2)
    );
    if (centerDist < (this.radius + chicken.radius)) {
      this.game.collectEgg(this);
    }
  };

})();
