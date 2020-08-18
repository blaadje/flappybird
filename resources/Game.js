import Gravity from './Gravity'
import Pipes from './Pipes'
import Player from './Player'

import scoreImages from '../scoreImages'
import jumpSoundFile from '../assets/sounds/sfx_wing.mp3'
import pointSoundFile from '../assets/sounds/sfx_point.mp3'
import dieSoundFile from '../assets/sounds/sfx_die.mp3'
import hitSoundFile from '../assets/sounds/sfx_hit.mp3'
import splashScreenImage from '../assets/splash.png'

const container = document.getElementById('container')
const scoreElement = document.getElementById('score')
const jumpSound = new Audio(jumpSoundFile)
const dieSound = new Audio(dieSoundFile)
const pointSound = new Audio(pointSoundFile)
const hitSound = new Audio(hitSoundFile)

export default class Game {
  constructor() {
    this.score = 0
    this.isGameStarted = null
    this.rAfAnimation = null
    this.player = new Player(container)
    this.gravity = new Gravity(container, this.player)
    this.splashScreen = this.generateSplashScreen()

    container.appendChild(this.player.get())

    this.pipes = new Pipes(this.player, container)

    container.appendChild(this.pipes.get())
    container.appendChild(this.splashScreen)

    this.pipes.onPlayerPassedPipe(this.onPlayerPassedPipe)
    this.pipes.onPlayerCollision(this.onPlayerCollision)
    this.gravity.onEntityTouchedGround(this.onEntityTouchedGround)

    document.addEventListener('keydown', this.interaction)
    document.addEventListener('touchstart', this.interaction)
  }

  generateSplashScreen() {
    const splashScreen = new Image(200, 200)
    splashScreen.src = splashScreenImage
    splashScreen.style.position = 'absolute'
    splashScreen.style.top = '10%'
    splashScreen.style.left = '50%'
    splashScreen.style.transform = 'translateX(-50%)'
    splashScreen.animate(
      [
        { transform: 'translateX(-50%) translateY(-100px)', opacity: 0 },
        { transform: 'translateX(-50%) translateY(0)', opacity: 1 },
      ],
      {
        duration: 1000,
        easing: 'ease',
      },
    )

    return splashScreen
  }

  removeSplashScreen() {
    container.removeChild(this.splashScreen)
  }

  onPlayerPassedPipe = () => {
    pointSound.src = pointSoundFile
    pointSound.play()
    this.score = this.score + 1
    this.drawScore()
  }

  onPlayerCollision = () => {
    this.isGameStarted = false
    this.score = 0
    window.cancelAnimationFrame(this.rAfAnimation)
    dieSound.play()
  }

  onEntityTouchedGround = () => {
    this.isGameStarted = false
    this.score = 0
    window.cancelAnimationFrame(this.rAfAnimation)
    hitSound.play()
  }

  interaction = (event) => {
    if (event.keyCode && event.keyCode != 38 && event.keyCode != 32) {
      return
    }

    if (this.isGameStarted !== false) {
      this.gravity.triggerRise()
      jumpSound.src = jumpSoundFile
      jumpSound.play()
    }

    if (this.isGameStarted === null) {
      this.removeSplashScreen()
      this.drawScore()
      this.render()
      this.gravity.setGameStarted()
      this.pipes.setGameStarted()
      this.isGameStarted = true
    }
  }

  drawScore() {
    while (scoreElement.firstChild) {
      scoreElement.removeChild(scoreElement.firstChild)
    }

    const digits = String(this.score)

    const _ = [...digits].forEach((digit) =>
      scoreElement.appendChild(scoreImages[digit]),
    )
  }

  render() {
    const render = this.render.bind(this)
    this.rAfAnimation = window.requestAnimationFrame(render)

    this.pipes.render()
    this.gravity.render()
  }
}
