import '~/style.css'
import 'p5'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
const width = canvas.offsetWidth
const height = canvas.offsetHeight
let noisyLandscape: NoisyLandscape

window.setup = () => {
  createCanvas(width, height, WEBGL, canvas)
  rectMode(CENTER)
  noisyLandscape = new NoisyLandscape()
}

window.draw = () => {
  noisyLandscape.draw()
}

class NoisyLandscape {
  private t = 0
  draw() {
    const camX = map(width - mouseX, 0, width, -400, 400)
    const camY = map(height - mouseY, 0, height, -400, 400)
    camera(0, -300, height / 2 / tan(PI / 6), -camX, -camY, 0, 0, 1, 0)
    background('LightSteelBlue')

    const mapLength = 30
    const size = 20
    const maxX = mapLength * size
    const maxZ = mapLength * size
    for (let x = 0; x < maxX; x += size) {
      beginShape(QUAD_STRIP)
      for (let z = 0; z < maxZ; z += size) {
        const c = map(this.mapNoiseToY(x, z), 0, 500, 0, 255)
        fill(c, c, c)
        vertex(x, this.mapNoiseToY(x, z), z)
        vertex(x + size, this.mapNoiseToY(x + size, z), z)
      }
      endShape()
    }

    this.t++
  }
  private mapNoiseToY(x: number, y: number): number {
    const seed = map(noise(x / 250, y / 250, this.t / 100), 0, 1, 0, 400)
    const terrain = map(noise(x / 500, y / 500, this.t / 50), 0, 1, 0, 100)
    return seed + terrain
  }
}
