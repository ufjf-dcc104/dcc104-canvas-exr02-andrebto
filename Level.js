function Level (){
  this.sprites = [];
  this.shots = [];
  this.inimigos = 6;
  this.dificulty = 0;
  this.score = 0;
}

Level.prototype.init = function () {
  for (var i = 0; i < this.inimigos; i++) {
    var inimigo = new Sprite();
    inimigo.x = 140 + 20*i + 50*i;
    inimigo.y = 10;
    inimigo.width = 32;
    inimigo.height = 32;
    this.dificulty = 30 + (this.score) * 5;
    inimigo.vy = Math.floor((Math.random() * this.dificulty) + 20);
    inimigo.angle = 90;
    inimigo.imgkey = "enemy";
    this.sprites.push(inimigo);
  }
};

Level.prototype.mover = function (dt) {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].mover(dt);
	  if(this.sprites[i].y > 400) {
			
			this.sprites[i].x = Math.floor((Math.random() * 480) + 100)
			this.sprites[i].y = -Math.floor((Math.random() * 100) + 0);
			this.sprites[i].vy = Math.floor((Math.random() * this.dificulty) + 20);
	}
    }
    for (var i = this.shots.length-1;i>=0; i--) {
      this.shots[i].mover(dt);
      if(
        this.shots[i].x >  3000 ||
        this.shots[i].x < -3000 ||
        this.shots[i].y >  3000 ||
        this.shots[i].y < -3000
      ){
        this.shots.splice(i, 1);
      }
    }
};

Level.prototype.moverAng = function (dt) {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].moverAng(dt);
    }
    for (var i = this.shots.length-1; i >= 0; i--) {
      this.shots[i].moverAng(dt);
      if(
        this.shots[i].x >  3000 ||
        this.shots[i].x < -3000 ||
        this.shots[i].y >  3000 ||
        this.shots[i].y < -3000
      ){
        this.shots.splice(i, 1);
      }
    }
};

Level.prototype.desenhar = function (ctx) {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].desenhar(ctx);
    }
    for (var i = 0; i < this.shots.length; i++) {
      this.shots[i].desenhar(ctx);
    }
};
Level.prototype.desenharImg = function (ctx) {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].desenharImg(ctx, this.imageLib.images[this.sprites[i].imgkey]);
    }
    for (var i = 0; i < this.shots.length; i++) {
      this.shots[i].desenharImg(ctx, this.imageLib.images[this.shots[i].imgkey]);
    }
};

Level.prototype.colidiuCom = function (alvo, resolveColisao) {
    for (var i = 0; i < this.sprites.length; i++) {
      if(this.sprites[i].colidiuCom(alvo)){
        resolveColisao(this.sprites[i], alvo);
      }
    }
};

Level.prototype.perseguir = function (alvo, dt) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].perseguir(alvo,dt);
  }
};
Level.prototype.perseguirAng = function (alvo, dt) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].perseguirAng(alvo,dt);
  }
};

Level.prototype.fire = function (alvo, audiolib, key, vol){
  if(alvo.cooldown>0) return;
  var tiro = new Sprite();
  tiro.x = alvo.x;
  tiro.y = alvo.y;
  tiro.angle = alvo.angle;
  tiro.vy = -100;
  tiro.width = 8;
  tiro.height = 16;
  tiro.imgkey = "shot";
  this.shots.push(tiro);
  alvo.cooldown = 1;
  if(audiolib && key) audiolib.play(key,vol);
}

Level.prototype.colidiuComTiros = function(al, key){
  
  for(var i = this.shots.length-1; i>=0; i--){

    this.colidiuCom(this.shots[i],
      (
        function(that)
        {
          return function(alvo){
            alvo.color = "green";
            that.shots.splice(i,1);
            x = that.sprites.indexOf(alvo);
            that.sprites[x].x = Math.floor((Math.random() * 480) + 100);
			that.sprites[x].y = -Math.floor((Math.random() * 100) + 0);
            that.dificulty = 30 + (that.score) * 5;
			that.sprites[x].vy = Math.floor((Math.random() * that.dificulty) + 20);
            that.score++;
            if(al&&key) al.play(key);
          }
        }
      )(this));
  }
}


//
