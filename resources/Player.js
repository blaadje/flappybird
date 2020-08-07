import bird from '../assets/bird.png'

export default class Player {
  constructor(container, image = bird) {
    this.container = container
    this.image = image
    this.player = document.createElement('div')

    this.height = 30
    this.width = 30

    this.player.style.height = `${this.height}px`
    this.player.style.width = `${this.width}px`
    this.player.style.position = 'absolute'
    this.player.style.left = '40%'
    this.player.style.top = '0'
    this.player.style.zIndex = '3'
    this.player.style.willChange = 'transform'

    this.createAppearance()
  }

  get() {
    return this.player
  }

  createAppearance() {
    const appearance = document.createElement('div')

    appearance.style.top = '50%'
    appearance.style.left = '50%'
    appearance.style.transform = 'translate(-50%, -50%)'
    appearance.style.height = '40px'
    appearance.style.width = '45px'
    appearance.style.position = 'absolute'
    appearance.style.background = `url(${this.image})`
    appearance.style.backgroundSize = 'cover'
    appearance.style.animation = 'play 0.5s steps(3) infinite'

    this.player.appendChild(appearance)
  }

  getCoordonates() {
    return {
      x: Math.round(this.player.getBoundingClientRect().x),
      y: Math.round(this.player.getBoundingClientRect().y),
      width: Math.round(this.player.getBoundingClientRect().width),
      height: Math.round(this.player.getBoundingClientRect().height),
      top: Math.round(this.player.getBoundingClientRect().top),
      right: Math.round(this.player.getBoundingClientRect().right),
      bottom: Math.round(this.player.getBoundingClientRect().bottom),
      left: Math.round(this.player.getBoundingClientRect().left),
    }
  }
}
