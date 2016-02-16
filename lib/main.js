var Chicken = ChickenRoad.Chicken = function (game, level) {
  this.pos = [game.width/2, game.height-30];
  this.speed = 5;
  this.lives = 3;
  this.level = level || 1;
  this.game = game;
};

var Vehicle = ChickenRoad.Vehicle = function (options) {
  this.speed = options.speed;
  this.game = options.game;
};


this.eggs = [];
this.eggsCollected = [];
this.eggsDelivered = [];
this.trucks = [];
this.cars = [];
this.chicken = new ChickenRoad.Chicken();
