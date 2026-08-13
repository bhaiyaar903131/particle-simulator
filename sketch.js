const particles = [];
const particleCount = 450;
class Particle {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(random(0.35, 1.25));
    this.size = random(1.5, 3.5);
  }
  update() {
    this.position.add(this.velocity);
  }
  edges() {
    if (this.position.x < 0) this.position.x = width;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.y > height) this.position.y = 0;
  }
  show() {
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
  background(5);
  for (const particle of particles) {
    particle.run();
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
