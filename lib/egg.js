(function () {
  if (typeof ChickenRoad === "undefined") {
    this.ChickenRoad = {};
  }

  var Egg = ChickenRoad.Egg = function (pos) {
    this.pos = pos;
    this.radius = 3;
    this.color = "white";
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
    
  };

})();
