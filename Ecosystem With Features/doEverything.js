window.onload = init; // Wait for the page to load before we begin animation
var canvas;
var ctx;// This is a better name for a global variable
var k = 0;
var flock;
var mouseX, mouseY;
var mouseLoc = new JSVector(0, 0);
var countTimes = 0;

function init(){
  //get the canvas
  canvas = document.getElementById('cnv');
  let cnvWidth = window.getComputedStyle(canvas).width;
  canvas.width = cnvWidth.substring(0, cnvWidth.length-2);
  let cnvHeight = window.getComputedStyle(canvas).height;
  canvas.height = cnvHeight.substring(0, cnvHeight.length-2);
  // Set the dimensions of the canvas
  flock = new Flock();
  //var color = Math.floor((Math.random()*2)+1);
  //canvas.style.backgroundColor = '';
  // get the context
  ctx = canvas.getContext('2d'); // This is the context
  for (var i = 0; i < 20; i++){
    flock.addBoid(new Boid(i, new JSVector(Math.random()*canvas.width, Math.random()*canvas.height)));
  }
  canvas.addEventListener('mousemove', function(event){
    mouseX = event.offsetX;     // Get the mouse coordinate
    mouseY = event.offsetY;
    countTimes++;
    if (countTimes >= 5 && event.buttons == 1){
      flock.addBoid(new Boid(i, new JSVector(mouseX, mouseY)));
      countTimes = 0;
    }
  }
  , false);
  mover = new Mover();
  orb = new Orb();
  snake = new Snake();
  animate(); // Call to your animate function
}
// To do::
//  1. Declare and init variables x, y, dx, dy, radius;
function animate(){
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  k++;
  if (k === 50){
    flock.addBoid(new Boid(flock.boids.length, new JSVector(parseInt(canvas.height)/2, parseInt(canvas.width)/2)));
    //flock.addBoid(new Boid(flock.boids.length, new JSVector(snake.segs[snake.segs.length-1].x, snake.segs[snake.segs.length-1].y)));
    // for (var i = 0; i < flock.boids.length; i++){
    //   flock.addBoid(new Boid(flock.boids.length+i, new JSVector(flock.boids[i].loc.x+Math.random()*30-15, flock.boids[i].loc.yMath.random()*30-15)));
    // }
    k = 0;
  }
  // Looping through backwards to delete
  for (var i = flock.boids.length-1; i >= 0; i--) {
    var boid = flock.boids[i];
    boid.update();
    boid.render();
    if (boid.isDead()) {
      //remove the boidicle
      flock.boids.splice(i, 1);
    }
    var distance = mover.loc.distance(boid.loc)
    if (distance <= 250){
      var f = JSVector.subGetNew(boid.loc, mover.loc);
      f.normalize();
      f.mult(.3);
      mover.applyForce(f);
    }
  }
  mover.update();
  mover.render();
  for(var j = 0; j < flock.boids.length; j++){
    var boid= flock.boids[j];
    var distance = boid.loc.distance(mover.loc)
    if (distance <= 100){
      var f = JSVector.subGetNew(boid.loc, JSVector.addGetNew(mover.loc, orb.loc));
      f.normalize();
      f.mult(.3);
      boid.applyForce(f);
    }
  }
  orb.update();
  orb.render();
  snake.update();
  snake.render();
  for(var j = flock.boids.length-1; j >= 0; j--){
    var boid = flock.boids[j];
    var distance = boid.loc.distance(JSVector.addGetNew(mover.loc, orb.loc));
    if (distance <= snake.rad + 2){
      flock.boids.splice(j, 1);
      for (var i = 0; i < 2; i++){
        snake.segs.push(new JSVector(0, 0));
        snake.rad += 0.1;
      }
    }
  }
}

function resetSliderSep(){
  document.getElementById('sliderSep').value = 2;
}

function resetSliderAli(){
  document.getElementById('sliderAli').value = 75;
}

function resetSliderCoh(){
  document.getElementById('sliderCoh').value = 5;
}

function resetSliderSepRad(){
  document.getElementById('sliderSepRad').value = 15;
}

function resetSliderCohRad(){
  document.getElementById('sliderCohRad').value = 75;
}
