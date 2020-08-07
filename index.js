import Gravity from './resources/Gravity'
import Pipes from './resources/Pipes'
import Player from './resources/Player'
import './game.css'
import fontBig0 from './assets/font_big_0.png'
import fontBig1 from './assets/font_big_1.png'
import fontBig2 from './assets/font_big_2.png'
import fontBig3 from './assets/font_big_3.png'
import fontBig4 from './assets/font_big_4.png'
import fontBig5 from './assets/font_big_5.png'
import fontBig6 from './assets/font_big_6.png'
import fontBig7 from './assets/font_big_7.png'
import fontBig8 from './assets/font_big_8.png'
import fontBig9 from './assets/font_big_9.png'
import jumpSoundFile from './assets/sounds/sfx_wing.ogg'
import pointSoundFile from './assets/sounds/sfx_point.ogg'
import dieSoundFile from './assets/sounds/sfx_die.ogg'
import hitSoundFile from './assets/sounds/sfx_hit.ogg'

const fontBig = {
  0: fontBig0,
  1: fontBig1,
  2: fontBig2,
  3: fontBig3,
  4: fontBig4,
  5: fontBig5,
  6: fontBig6,
  7: fontBig7,
  8: fontBig8,
  9: fontBig9,
}

const container = document.getElementById('container')
const scoreElement = document.getElementById('score')

let score = 0
let isGameStarted = false

const jumpSound = new Audio()
const dieSound = new Audio()
const pointSound = new Audio()
const hitSound = new Audio()
pointSound.src = pointSoundFile
jumpSound.src = jumpSoundFile
dieSound.src = dieSoundFile
hitSound.src = hitSoundFile

const player = new Player(container)
const gravity = new Gravity(container, player)

container.appendChild(player.get())

const pipes = new Pipes(player, container)

container.appendChild(pipes.get())

const drawScore = () => {
  while (scoreElement.firstChild) {
    scoreElement.removeChild(scoreElement.firstChild)
  }

  const digits = String(score)

  const _ = [...digits].map((digit) => {
    const image = document.createElement('img')

    image.src = fontBig[digit]

    scoreElement.appendChild(image)
  })
}

drawScore()

pipes.onPlayerPassedPipe(() => {
  pointSound.play()
  score = score + 1
  drawScore()
})
pipes.onPlayerCollision(() => {
  window.cancelAnimationFrame(stop)
  dieSound.play()
  isGameStarted = false
  score = 0
})
gravity.onEntityTouchedGround(() => {
  window.cancelAnimationFrame(stop)
  hitSound.play()
})

let stop = null

const render = () => {
  stop = window.requestAnimationFrame(render)

  pipes.render()
  gravity.render()
}

const interaction = (event) => {
  if (event.keyCode && event.keyCode != 38 && event.keyCode != 32) {
    return
  }
  jumpSound.src = jumpSoundFile
  jumpSound.play()

  gravity.triggerRise()

  if (!isGameStarted) {
    render()
    gravity.setGameStarted()
    pipes.setGameStarted()
    isGameStarted = true
  }
}

document.addEventListener('keydown', interaction)
document.addEventListener('click', interaction)
