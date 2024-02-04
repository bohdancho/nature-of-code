import { Vector } from 'p5'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
const width = canvas.offsetWidth
const height = canvas.offsetHeight
let ball!: Mover
let liquid!: Liquid

window.setup = () => {
  createCanvas(width, height, canvas)
  rectMode(CENTER)
  ball = new Mover(20, createVector(0, 0), createVector(width / 2, height / 3))
  liquid = new Liquid(createVector(width / 2, height - 100), createVector(width, 400), 100)
}

const gravity = new Vector(0, 0.2)
let lastPressedMousePos: Vector | undefined = undefined
window.draw = () => {
  background('#0C0A09')
  const mousePos = createVector(mouseX, mouseY)
  if (mouseIsPressed) {
    ball.pos = mousePos
    lastPressedMousePos = mousePos
  } else {
    if (lastPressedMousePos) {
      ball.vel = mousePos.copy().sub(lastPressedMousePos).mult(0.5)
    }
    lastPressedMousePos = undefined

    const g = gravity.copy().mult(ball.mass)
    ball.applyForce(g)
    ball.updateVel()

    const drag = liquid.calculateDrag(ball)
    ball.applyForce(drag)

    const friction = calculateFriction(ball)
    ball.applyForce(friction)

    ball.handleBounceEdges()
    ball.updateVel()
    ball.updatePos()
  }

  ball.draw()
  liquid.draw()
}

function calculateFriction(body: Body) {
  if (Math.round(body.pos.y + body.size / 2) !== height) {
    return createVector(0, 0, 0)
  }

  const g = gravity.copy().mult(body.mass)
  const normal = g.copy().mult(-1)
  const frictionCoef = 0.1

  return body.vel
    .copy()
    .normalize()
    .mult(-1 * frictionCoef)
    .mult(normal.mag())
}

interface Body {
  pos: Vector
  vel: Vector
  mass: number
  size: number
  applyForce: (force: Vector) => void
}

class Liquid {
  constructor(
    private pos: Vector,
    private size: Vector,
    private coef: number,
  ) {}

  private contains(body: Body): boolean {
    if (
      body.pos.x + body.size / 2 > this.pos.x - this.size.x / 2 &&
      body.pos.x - body.size / 2 < this.pos.x + this.size.x / 2 &&
      body.pos.y + body.size / 2 > this.pos.y - this.size.y / 2 &&
      body.pos.y - body.size / 2 < this.pos.y + this.size.y / 2
    ) {
      return true
    }
    return false
  }

  calculateDrag(mover: Mover): Vector {
    if (!this.contains(mover)) {
      return createVector(0, 0, 0)
    }
    const drag = mover.vel
      .copy()
      .setMag(1)
      .mult(-1 * mover.vel.mag() ** 2 * this.coef)
      .limit(mover.vel.mag() * mover.mass)

    return drag
  }

  draw() {
    push()
    fill(0, 0, 255, 100)
    strokeWeight(0)
    rect(this.pos.x, this.pos.y, this.size.x, this.size.y)
    pop()
  }
}

class Mover {
  acc = createVector(0, 0, 0)
  size: number

  constructor(
    public mass: number,
    public vel = createVector(0, 0, 0),
    public pos = createVector(random(0, width), random(0, height / 2)),
  ) {
    this.size = mass * 5
  }

  applyForce(force: Vector) {
    const f = force.copy().div(this.mass)
    this.acc.add(f)
  }

  handleBounceEdges() {
    const restitution = 0.9

    if (this.pos.y - this.size / 2 <= 0) {
      this.pos.y = this.size / 2
      this.vel.y *= -restitution
    }
    if (this.pos.y + this.size / 2 >= height) {
      this.pos.y = height - this.size / 2
      this.vel.y *= -restitution
    }
    if (this.pos.x - this.size / 2 <= 0) {
      this.pos.x = this.size / 2
      this.vel.x *= -restitution
    }
    if (this.pos.x + this.size / 2 >= width) {
      this.pos.x = width - this.size / 2
      this.vel.x *= -restitution
    }
  }

  updateVel() {
    this.vel.add(this.acc)
    this.acc = createVector(0, 0)
  }

  updatePos() {
    this.pos.add(this.vel)
  }

  draw() {
    push()
    fill('#16A34A')
    stroke('grey')
    strokeWeight(2)
    circle(this.pos.x, this.pos.y, this.size)
    pop()
  }
}
