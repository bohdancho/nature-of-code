// https://github.com/processing/p5.js/issues/1734
// declare module 'p5' {
//   import * as p5 from 'p5'
//   export default p5
// }

interface Window {
  preload?(): void
  setup?(): void
  draw?(): void
  remove?(): void
  disableFriendlyErrors?: boolean
  noLoop?(): void
  loop?(): void
  isLooping?(): void
  push?(): void
  pop?(): void
  redraw?(): void
}
