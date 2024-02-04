import '~/style.css'
import { Vector } from 'p5'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
const width = canvas.offsetWidth
const height = canvas.offsetHeight
let ground!: Ground
let car!: Car

window.setup = () => {
  createCanvas(width, height, WEBGL, canvas)
  rectMode(CENTER)
  ground = new Ground()
  car = new Car()
}

window.draw = () => {
  ground.draw()
  car.draw()
}

const KEY_W = 87
const KEY_A = 65
const KEY_S = 83
const KEY_D = 68
const BASE_FACING = new Vector(0, 0, 1)
const MAX_WHEELS_ANGLE = Math.PI / 5
const MAX_SPEED = 20
class Car {
  size = createVector(30, 20, 60)
  pos = createVector(500, this.size.y * -0.5, 500)
  vel = 0
  acc = 0
  angle = 0
  wheelsAngle = 0

  draw() {
    if (keyIsDown(KEY_W)) {
      this.acc = 1.5
    } else if (keyIsDown(KEY_S)) {
      this.acc = -1.5
    } else {
      this.acc = 0
      this.vel *= 0.9
    }
    this.vel += this.acc
    this.vel = minmax(this.vel, -MAX_SPEED, MAX_SPEED)

    if (keyIsDown(KEY_A)) {
      this.wheelsAngle += 0.02
    } else if (keyIsDown(KEY_D)) {
      this.wheelsAngle -= 0.02
    }
    this.wheelsAngle = minmax(this.wheelsAngle, -MAX_WHEELS_ANGLE, MAX_WHEELS_ANGLE)

    this.angle += this.vel * sin(this.wheelsAngle) * 0.01
    const wheelsFacing = rotateAroundY(BASE_FACING, this.angle + this.wheelsAngle)
    this.pos.add(wheelsFacing.mult(this.vel))

    push()
    fill('darkmagenta')
    translate(this.pos)

    push()
    rotateY(this.angle)
    box(this.size.x, this.size.y, this.size.z)
    pop()

    pop()

    push()
    translate(this.pos)
    strokeWeight(5)
    stroke('red')
    const wheelsFacingArrow = rotateAroundY(BASE_FACING, this.angle + this.wheelsAngle).mult(100)
    line(0, 0, 0, wheelsFacingArrow.x, wheelsFacingArrow.y, wheelsFacingArrow.z)
    pop()
  }
}

class Ground {
  t = 0
  sizeX = 1000
  sizeZ = 1000
  constructor() {
    camera(this.sizeX * 0.6, -this.sizeZ / 4 / tan(PI / 6), this.sizeZ * -0.6, this.sizeX / 2, 0, this.sizeZ)
  }
  draw() {
    background('LightSteelBlue')

    fill('white')
    beginShape(QUADS)
    vertex(0, 0, 0)
    vertex(0, 0, this.sizeZ)
    vertex(this.sizeX, 0, this.sizeZ)
    vertex(this.sizeX, 0, 0)
    endShape()

    this.t++
  }
  private mapNoiseToY(x: number, y: number): number {
    const seed = map(noise(x / 250, y / 250, this.t / 100), 0, 1, 0, 400)
    const terrain = map(noise(x / 500, y / 500, this.t / 50), 0, 1, 0, 100)
    return seed + terrain
  }
}

const AXIS_Y = new Vector(0, 1, 0)
function rotateAroundY(vect: Vector, angle: number) {
  return rotateAround(vect, AXIS_Y, angle)
}

function minmax(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

// Rotate one vector (vect) around another (axis) by the specified angle.
function rotateAround(vect: Vector, axis: Vector, angle: number) {
  // Make sure our axis is a unit vector
  axis = Vector.normalize(axis)
  // console.log(vect)

  return Vector.add(
    vect.copy().mult(cos(angle)),
    Vector.add(
      Vector.mult(Vector.cross(axis, vect), sin(angle)),
      axis
        .copy()
        .mult(Vector.dot(axis, vect))
        .copy()
        .mult(1 - cos(angle)),
    ),
  )
}
