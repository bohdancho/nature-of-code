import { Vector } from 'p5'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
const width = canvas.offsetWidth
const height = canvas.offsetHeight
let walker!: Walker

window.setup = () => {
  createCanvas(width, height, canvas)
  rectMode(CENTER)
  walker = new Walker()
}

window.draw = () => {
  background(0)
  walker.perlinAcceleration()
  walker.update()
  walker.draw('circle')
}

class Walker {
  private startTimestamp = Date.now()
  private position = createVector(width / 2, height / 2)

  private velocity = createVector(0, 0, 0)
  accelerationTowardsMouse() {
    const diff = Vector.sub(createVector(mouseX, mouseY), this.position)
    const distance = diff.mag()
    const acceleration = diff.setMag(1000 / distance ** 2)
    this.velocity.add(acceleration)
    this.velocity.limit(50)
  }

  stepTowardsMouse(stepSize: number) {
    const step = Vector.sub(createVector(mouseX, mouseY), this.position).setMag(stepSize)
    this.position.add(step)
  }

  private topSpeed = 50
  private tx = 0
  private ty = 10000
  perlinAcceleration() {
    const x = map(noise(this.tx), 0, 1, -5, 5)
    const y = map(noise(this.ty), 0, 1, -5, 5)
    const acceleration = createVector(x, y)
    this.position.add(acceleration)
    this.tx += 0.01
    this.ty += 0.01
  }

  randomStep(stepSize: number) {
    const step = Vector.fromAngle(random(0, TWO_PI)).setMag(stepSize)
    this.position.add(step)
  }

  update() {
    this.velocity.limit(this.topSpeed)
    this.position.add(this.velocity)
  }

  draw(style: 'sprinkle' | 'circle') {
    if (style === 'sprinkle') {
      const fillColor = (((Date.now() - this.startTimestamp) * 10000) % 16 ** 6).toString(16).padStart(6, 'f')
      fill('#' + fillColor)
      rect(this.position.x, this.position.y, 2)
      return
    } else if (style === 'circle') {
      fill('white')
      stroke('grey')
      circle(this.position.x, this.position.y, 60)
    }
  }
}
