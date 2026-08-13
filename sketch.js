const particles = [];
const particleCount = 650;
let trailAmount = 32;
class Particle {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(random(0.35, 1.25));
    this.size = random(1.5, 3.5);
    this.drag = random(0.995, 0.9995);
    this.maxSpeed = random(1.3, 2.2);
    this.opacity = random(150, 255);
    this.phase = random(TWO_PI);
  }
  update() {
    this.velocity.mult(this.drag);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.phase += 0.025;
  }
  edges() {
    if (this.position.x <= 0 || this.position.x >= width) {
      this.velocity.x *= -1;
      this.position.x = constrain(this.position.x, 1, width - 1);
    }
    if (this.position.y <= 0 || this.position.y >= height) {
      this.velocity.y *= -1;
      this.position.y = constrain(this.position.y, 1, height - 1);
    }
  }
  show() {
    const pulse = map(sin(this.phase), -1, 1, 0.7, 1);
    fill(240, this.opacity * pulse);
    circle(this.position.x, this.position.y, this.size);
  }
  run() {
    this.update();
    this.edges();
    this.show();
  }
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  fill(240);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}
function draw() {
  background(5, trailAmount);
  drawFrame();
  drawParticleTotal();
  for (const particle of particles) {
    particle.run();
  }
}
function drawFrame() {
  push();
  noFill();
  stroke(255, 18);
  strokeWeight(1);
  rect(12, 12, width - 24, height - 24);
  pop();
}
function drawParticleTotal() {
  push();
  fill(255, 45);
  textSize(10);
  text(`${particles.length} particles`, 22, 48);
  pop();
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for (const particle of particles) {
    particle.position.x = constrain(particle.position.x, 0, width);
    particle.position.y = constrain(particle.position.y, 0, height);
  }
}
function spawnBurst(amount = 70) {
  const origin = createVector(width / 2, height / 2);
  for (let i = 0; i < amount; i++) {
    const particle = new Particle();
    particle.position = origin.copy();
    particle.velocity = p5.Vector.random2D().mult(random(1.5, 4));
    particles.push(particle);
  }
}
function keyPressed() {
  if (key === 't' || key === 'T') {
    trailAmount = trailAmount === 255 ? 32 : 255;
  }
  if (key === ' ') {
    spawnBurst();
  }
}
