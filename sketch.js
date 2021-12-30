let simulation;
let minimumTime = 0;
let maximumTime = 400;
// min dan max time untuk durasi partikel nya muncul
let bolas = [];
// array
let totalbola;
// untuk total bola nya
let x = 500;
let y = 350;


class bola {
//   class ball untuk menambah object bola
 constructor(xx, yy, xxdir, yydir, rr) {
//    constructor dengan berbagai parameter
   this.x = xx;
//    lebar bola
   this.y = yy;
//    tinggi bola
   this.xdir = xxdir;
//    pertambahan sumbu x
   this.ydir = yydir;
//    pertambahan sumbu y
   this.r = rr;
//    diameter bola
   
   this.stopped = false;
//    kondisi untuk kalo bolanya bertabrakan akan berhenti
   this.color = color(random(0,255), random(0, 255), random(0, 255));
//    mewarnai bola
 }
  
  move() {
    // mengatur fungsi perpindahan bola
    if (!this.stopped) {
//       kalo bola ga berhenti akan bertambah sumbu x dan y nya
      this.x = this.x + this.xdir;
      this.y = this.y + this.ydir;
    }
    
    
    if (this.x <= 0 || this.x >= width) {
//       untuk kondisi kalo nabrak width
   		this.bounceX();
    }
    
    if (this.y <=0 || this.y >= height) {
      this.bounceY();
      // untuk kondisi kalo nabrak height
    }
    
  }
  
  bounceX() {
//     pantulan dari X
    this.xdir = this.xdir * -1;   
  }
  
  bounceY() {
    //     pantulan dari Y
	  this.ydir = this.ydir * -1;  
  }
  
  display() {
    fill(this.color);
   ellipse(this.x, this.y, this.r, this.r); 
  }
  
  stop() {
//     kondisi stop
    this.stopped = true;    
  }
  
  start() {
//     kondisi gerak
    this.stopped = false;
  }
  
  hover() { 
   	if (dist(mouseX, mouseY, this.x, this.y) < this.r) {
     	return true;
    } else {
      return false;
    }
  }
}

function keyPressed() {
  totalbola = key;
//   total bola sesuai dengan angka yang ditekan
  setup();
}

function setup() {
  createCanvas(x, y);

  for (let i = 0; i < totalbola; i++) {
  	let b = new bola(random(0,width), random(0,height), random(-5,5), random(-5,5), random(10,50)); 
    bolas.push(b);
  }
}

function draw() {
  background(1500);

  for (let i = 0; i < bolas.length; i++) {
    
    for (let j = i; j < bolas.length; j++) {
    
      if (bolas[i] != bolas[j] && dist(bolas[i].x, bolas[i].y, bolas[j].x, bolas[j].y) < (bolas[i].r + bolas[j].r)/2) {
        bolas[i].bounceX(); 
        bolas[i].bounceY();
        bolas[j].bounceX();
        bolas[j].bounceY();
        bolas[j].color = color(random(255), random(255), random(255));
        minimumTime = 1;
        simulation = new BuildParticle(createVector(bolas[j].x, bolas[j].y));
      }
      
      if (bolas[j].x > x || bolas[j].y > y || bolas[j].x < 0 || bolas[j].y < 0) {
        bolas[j].color = color(random(255), random(255), random(255));
      }
      
    }

    if (minimumTime > 0) {
      minimumTime++;

      if (minimumTime < maximumTime)
      {
        simulation.addbolaKecil();
        simulation.run();
      }
    }
    
  	if (mouseIsPressed && bolas[i].hover()) 
    {
      bolas[i].stop(); 
//       kalo bola ditekan, bola akan bergerak
    } 
    else 
    {
       bolas[i].start(); 
//       kondisi normal nya bola akan jalan
    }
    
    bolas[i].move();
    bolas[i].display();
  } 
}

let bolaKecil = function(posisi) {
//   untuk menggambar bola
  this.acceleration = createVector(0, 0.05);
//   akselerasi
  this.velocity = createVector(random(-1, 1), random(-1, 0));
//   velocitynya 
  this.posisi = posisi.copy();
//   untuk memperbanyak bolanya
  this.timeLife = 150;
//   waktu nya
};

bolaKecil.prototype.run = function() {
  this.update();
//   untuk update 
  this.display();
//   
};

bolaKecil.prototype.update = function(){
  this.velocity.add(this.acceleration);
  
  this.posisi.add(this.velocity);
//   posisi nya
  this.timeLife -= 1;
//   waktu berkurang
};

bolaKecil.prototype.display = function() {
  stroke(200, this.timeLife);
//   bolakecil tabrakan akan dibentuk dari stroke 200 nya dan memiliki timeLife 
  strokeWeight(2);
//   ketebalannya
  let a = color(random(255),random(255),random(255));
  let b = color(random(255),random(255),random(255));
  var t = map(mouseX, 0, width, 0, 1.0);
//   posisi dari mouse
  var c = lerpColor(a, b, t);
  fill(c, this.timeLife);
  ellipse(this.posisi.x, this.posisi.y, 12, 12);
//   membuat posisi partikel di posisi bola yg bertabrakan
};

bolaKecil.prototype.isDead = function(){
  return this.timeLife < 0;
//   kalo udah kurang dari 0, partikel hilang
};

let BuildParticle = function(posisi) {
  this.origin = posisi.copy();
//   membuat particle dengan posisi di tabrakannya
  this.particles = [];
//   array untuk nampung
};

BuildParticle.prototype.addbolaKecil = function() {
  this.particles.push(new bolaKecil(this.origin));
//   untuk ngepush sehingga bola nya nambah
};

BuildParticle.prototype.run = function() {
//   untuk menjalankan partikel nya
  for (let i = this.particles.length-1; i >= 0; i--) {
    let p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
//       kalau udah nyentuh bawah, partikelnya mati
    }
    
  }
};