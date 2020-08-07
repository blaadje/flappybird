import Pipe from './Pipe'
import { getRandomIntInclusive, inRange } from '../utils'

export default class Pipes {
  constructor(player, container) {
    this.container = container
    this.transform = 0
    this.pipes = document.createElement('div')
    this.player = player
    this.playerCollisionCallback = null
    this.playerPassedPipeCallback = null
    this.stop = null

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
  }

  createPipe() {
    return new Pipe(
      Math.floor(getRandomIntInclusive(30, 70)),
      this.player.get().clientHeight,
    )
  }

  checkPipes() {
    const firstPipe = this.displayedPipes[0].getCoordonates()
    if (firstPipe.right > this.container.getBoundingClientRect().left) {
      return
    }

    const newPipe = this.createPipe()

    const [pipeToDelete, ...rest] = this.displayedPipes
    this.displayedPipes = [...rest, newPipe]
    this.pipes.appendChild(newPipe.get())
    this.pipes.removeChild(pipeToDelete.get())
  }

  checkScore() {
    const playerPosition = this.player.getCoordonates()
    const hasCollision = this.displayedPipes.some((pipe) => {
      const topSectionPosition = pipe.getTopSection().getBoundingClientRect()
      const bottomSectionPosition = pipe
        .getBottomSection()
        .getBoundingClientRect()

      return (
        playerPosition.right > pipe.getCoordonates().left &&
        playerPosition.left < pipe.getCoordonates().right &&
        (playerPosition.top < topSectionPosition.bottom ||
          playerPosition.bottom > bottomSectionPosition.top)
      )
    })

    const hasPassedPipe = this.displayedPipes.some((pipe) => {
      return inRange(1, playerPosition.left, pipe.getCoordonates().right)
    })

    if (hasCollision) {
      this.playerCollisionCallback()
      return
    }

    if (hasPassedPipe) {
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
    this.transform = this.transform + 3
    this.pipes.style.transform = `translateX(-${this.transform}px) translateZ(0) `
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
