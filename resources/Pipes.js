import Pipe from './Pipe'
import { getRandomIntInclusive } from '../utils'

export default class Pipes {
  constructor(player, container) {
    this.container = container
    this.transform = 0
    this.pipes = document.createElement('div')
    this.player = player
    this.playerCollisionCallback = null
    this.playerPassedPipeCallback = null
    this.stop = null
    this.generatedPipeNumber = 0

    this.pipes.style.display = 'inline-flex'
    this.pipes.style.position = 'absolute'
    this.pipes.style.left = '100%'
    this.pipes.style.top = '0'
    this.pipes.style.bottom = '0'
    this.pipes.style.willChange = 'transform'

    this.displayedPipes = Array.from({ length: 3 }).map(() => {
      const pipe = this.createPipe()

      this.pipes.appendChild(pipe.get())

      return pipe
    })
    this.storedPipes = this.displayedPipes
  }

  createPipe() {
    const pipeWidth = 70
    const gapWidth = 140
    const offset = (pipeWidth + gapWidth) * this.generatedPipeNumber
    const pipe = new Pipe(
      Math.floor(getRandomIntInclusive(30, 70)),
      this.player.get().clientHeight,
      pipeWidth,
      offset,
    )
    this.generatedPipeNumber = this.generatedPipeNumber + 1

    return pipe
  }

  checkPipes() {
    const firstPipe = this.displayedPipes[0].getCoordonates()
    if (firstPipe.right > this.container.getBoundingClientRect().left) {
      return
    }

    const newPipe = this.createPipe()

    const [pipeToDelete, ...rest] = this.displayedPipes
    this.storedPipes = [...this.storedPipes, newPipe]
    this.displayedPipes = [...rest, newPipe]
    this.pipes.appendChild(newPipe.get())
    this.pipes.removeChild(pipeToDelete.get())
  }

  checkScore() {
    const selectedPipe = this.storedPipes[0]
    const playerPosition = this.player.getCoordonates()
    const topSectionPosition = selectedPipe
      .getTopSection()
      .getBoundingClientRect()
    const bottomSectionPosition = selectedPipe
      .getBottomSection()
      .getBoundingClientRect()

    const hasCollision =
      playerPosition.right > selectedPipe.getCoordonates().left &&
      playerPosition.left < selectedPipe.getCoordonates().right &&
      (playerPosition.top < topSectionPosition.bottom ||
        playerPosition.bottom > bottomSectionPosition.top)

    if (hasCollision) {
      this.playerCollisionCallback()
      return
    }

    const hasPassedPipe =
      playerPosition.left > selectedPipe.getCoordonates().right

    if (hasPassedPipe) {
      const [, ...rest] = this.storedPipes
      this.storedPipes = rest
      this.playerPassedPipeCallback()
    }
  }

  get() {
    return this.pipes
  }

  onPlayerCollision(callback) {
    this.playerCollisionCallback = callback
  }

  onPlayerPassedPipe(callback) {
    this.playerPassedPipeCallback = callback
  }

  updatePipesPosition() {
    this.transform = this.transform + 2
    this.pipes.style.transform = `translateX(-${this.transform}px) translateZ(0)`
  }

  setGameStarted() {
    this.render()
  }

  render() {
    this.updatePipesPosition()
    this.checkPipes()
    this.checkScore()
  }
}
