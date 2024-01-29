import { Vector } from 'p5'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
const width = canvas.offsetWidth
const height = canvas.offsetHeight
let walker!: Walker

window.setup = () => {
  createCanvas(width, height, WEBGL, canvas)
  rectMode(CENTER)
  walker = new Walker()
}

window.draw = () => {
  walker.perlinStep()
  walker.draw('sprinkle')
}

class Walker {
  private startTimestamp = Date.now()
  private position = createVector(0, 0)

  public stepTowardsMouse(stepSize: number) {
    const step = Vector.sub(createVector(mouseX, mouseY), this.position).setMag(stepSize)
    this.position.add(step)
  }

  private tx = 0
  private ty = 10000
  public perlinStep() {
    const x = map(noise(this.tx), 0, 1, -5, 5)
    const y = map(noise(this.ty), 0, 1, -5, 5)
    this.position.add(x, y)
    this.tx += 0.01
    this.ty += 0.01
  }

  public randomStep(stepSize: number) {
    const step = Vector.fromAngle(random(0, TWO_PI)).setMag(stepSize)
    this.position.add(step)
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
