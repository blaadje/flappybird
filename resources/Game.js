import Gravity from './Gravity'
import Pipes from './Pipes'
import Player from './Player'

import scoreImages from '../scoreImagesCollection'
import jumpSoundFile from '../assets/sounds/sfx_wing.mp3'
import pointSoundFile from '../assets/sounds/sfx_point.mp3'
import dieSoundFile from '../assets/sounds/sfx_die.mp3'
import hitSoundFile from '../assets/sounds/sfx_hit.mp3'
import splashScreenImage from '../assets/splash.png'
import restartButtonImage from '../assets/restart.png'
import scoreBackgroundImage from '../assets/scoreBackground.png'

import { setCookie, getCookie } from '../utils'

const jumpSound = new Audio(jumpSoundFile)
const dieSound = new Audio(dieSoundFile)
const pointSound = new Audio(pointSoundFile)
const hitSound = new Audio(hitSoundFile)

export default class Game {
  constructor() {
    this.container = document.getElementById('container')
    this.createGame()

    document.addEventListener('keydown', this.interaction)
    document.addEventListener('touchstart', this.interaction)
  }

  createGame() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild)
    }

    this.lastTick = null
    this.score = 0
    this.isGameStarted = null
    this.rAfAnimation = null
    this.player = new Player(this.container)
    this.scoreElement = document.createElement('div')
    this.gravity = new Gravity(this.container, this.player)
    this.splashScreen = this.generateSplashScreen()

    this.container.appendChild(this.player.get())

    this.pipes = new Pipes(this.player, this.container)

    this.container.append(
      this.scoreElement,
      this.pipes.get(),
      this.splashScreen,
    )

    this.pipes.onPlayerPassedPipe(this.onPlayerPassedPipe)
    this.pipes.onPlayerCollision(this.onPlayerCollision)
    this.gravity.onEntityTouchedGround(this.onEntityTouchedGround)
  }

  generateScoreScreen() {
    const restartButton = new Image(135, 50)
    restartButton.src = restartButtonImage
    restartButton.addEventListener('click', this.restartGame)

    const bestScoreFromCookie = getCookie('bestScore')
    const bestScoreBeatten =
      !bestScoreFromCookie || this.score > bestScoreFromCookie

    const scoreScreen = document.createElement('div')
    const scoreBackground = document.createElement('div')
    const scoreText = document.createElement('span')
    const bestScoreText = document.createElement('span')
    const score = this.getScore(this.score, 28, 20)
    const bestScoreElement = this.getScore(
      bestScoreBeatten ? this.score : bestScoreFromCookie,
      28,
      20,
    )

    scoreScreen.style.position = 'absolute'
    scoreScreen.style.top = '50%'
    scoreScreen.style.left = '50%'
    scoreScreen.style.transform = 'translate(-50%, -50%)'
    scoreScreen.style.display = 'flex'
    scoreScreen.style.flexDirection = 'column'
    scoreScreen.style.alignItems = 'center'
    scoreScreen.style.zIndex = 4

    scoreScreen.animate(
      [
        { transform: 'translateX(-50%) translateY(50px)', opacity: 0 },
        { transform: 'translateX(-50%) translateY(-50%)', opacity: 1 },
      ],
      {
        duration: 500,
        easing: 'ease',
      },
    )
    scoreText.style.marginBottom = '5px'
    scoreText.innerText = 'Score'

    bestScoreText.style.marginBottom = '5px'
    bestScoreText.innerText = 'Best'

    scoreBackground.style.background = `url(${scoreBackgroundImage}) no-repeat`
    scoreBackground.style.backgroundSize = 'contain'
    scoreBackground.style.display = 'flex'
    scoreBackground.style.flexDirection = 'column'
    scoreBackground.style.alignItems = 'center'
    scoreBackground.style.width = '150px'
    scoreBackground.style.height = '200px'
    scoreBackground.style.paddingTop = '20px'

    scoreBackground.style.marginBottom = '10px'

    scoreBackground.append(scoreText, score, bestScoreText, bestScoreElement)
    scoreScreen.append(scoreBackground, restartButton)

    if (bestScoreBeatten) {
      setCookie('bestScore', this.score, Infinity)
    }

    return scoreScreen
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
        duration: 500,
        easing: 'ease',
      },
    )

    return splashScreen
  }

  removeSplashScreen() {
    this.container.removeChild(this.splashScreen)
  }

  onPlayerPassedPipe = () => {
    pointSound.src = pointSoundFile
    pointSound.play()
    this.score = this.score + 1
    this.drawLiveScore(this.score)
  }

  restartGame = () => this.createGame()

  endGame() {
    this.isGameStarted = false
    this.removeLiveScore()
    this.container.appendChild(this.generateScoreScreen())
    window.cancelAnimationFrame(this.rAfAnimation)
  }

  onPlayerCollision = () => {
    this.endGame()
    dieSound.play()
  }

  onEntityTouchedGround = () => {
    this.endGame()
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
      this.render()
      this.drawLiveScore(this.score)
      this.gravity.setGameStarted()
      this.pipes.setGameStarted()
      this.isGameStarted = true
    }
  }

  getScore(score, height = 36, width = 24) {
    const scoreElement = document.createElement('div')
    scoreElement.style.display = 'flex'

    const digits = String(score)

    const _ = [...digits].forEach((digit) => {
      const image = scoreImages[digit].cloneNode(true)
      image.style.height = `${height}px`
      image.style.width = `${width}px`

      scoreElement.appendChild(image)
    })

    return scoreElement
  }

  drawLiveScore(score) {
    while (this.scoreElement.firstChild) {
      this.scoreElement.removeChild(this.scoreElement.firstChild)
    }

    this.scoreElement.style.position = 'absolute'
    this.scoreElement.style.top = '15%'
    this.scoreElement.style.left = '50%'
    this.scoreElement.style.transform = 'translateX(-50%)'
    this.scoreElement.style.zIndex = 2

    this.scoreElement.appendChild(this.getScore(score))
  }

  removeLiveScore() {
    this.container.removeChild(this.scoreElement)
  }

  render = (now) => {
    const FPS = 90
    this.rAfAnimation = window.requestAnimationFrame(this.render)

    if (!this.lastTick) {
      this.lastTick = now
    }
    const delta = now - this.lastTick

    if (delta < 100 / FPS) {
      return
    }

    this.pipes.render(delta)
    this.gravity.render()
    this.lastTick = now
  }
}
