const particles = [];
const particleCount = 650;
let trailAmount = 32;
let interactionMode = 'attract';
let interactionRadius = 190;
let interactionStrength = 0.16;
let speedScale = 1;
let sizeScale = 1;
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
    const movement = p5.Vector.mult(this.velocity, speedScale);
    this.position.add(movement);
    this.phase += 0.025;
  }
  interact() {
    if (!mouseIsPressed) return;
    const pointer = createVector(mouseX, mouseY);
    const offset = p5.Vector.sub(pointer, this.position);
    const distance = offset.mag();
    if (distance <= 0 || distance > interactionRadius) return;
    const falloff = map(distance, 0, interactionRadius, 1, 0);
    offset.normalize();
    offset.mult(interactionStrength * falloff);
    if (interactionMode === 'repel') offset.mult(-1);
    this.velocity.add(offset);
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
    circle(this.position.x, this.position.y, this.size * sizeScale);
  }
  run() {
    this.interact();
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
  bindControls();
}
function draw() {
  background(5, trailAmount);
  drawFrame();
  drawParticleTotal();
  for (const particle of particles) {
    particle.run();
  }
  if (mouseIsPressed) drawInteractionRing();
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
function drawInteractionRing() {
  noFill();
  stroke(255, 45);
  circle(mouseX, mouseY, interactionRadius * 2);
  noStroke();
  fill(240);
}
function mouseWheel(event) {
  interactionRadius -= event.delta * 0.12;
  interactionRadius = constrain(interactionRadius, 70, 320);
  const label = document.getElementById('radiusLabel');
  if (label) label.textContent = `RADIUS ${round(interactionRadius)}`;
  return false;
}
function setMode(mode) {
  interactionMode = mode;
  document.getElementById('modeLabel').textContent = mode.toUpperCase();
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
  if (key === 'r' || key === 'R') {
    setMode(interactionMode === 'attract' ? 'repel' : 'attract');
  }
}
function setParticleCount(value) {
  while (particles.length < value) particles.push(new Particle());
  if (particles.length > value) particles.length = value;
}
function bindRange(id, valueId, onInput) {
  const control = document.getElementById(id);
  const value = document.getElementById(valueId);
  control.addEventListener('input', () => {
    value.textContent = control.value;
    onInput(Number(control.value));
  });
}
function bindControls() {
  bindRange('countControl', 'countValue', setParticleCount);
  bindRange('speedControl', 'speedValue', value => {
    speedScale = value;
  });
  bindRange('sizeControl', 'sizeValue', value => {
    sizeScale = value;
  });
}
