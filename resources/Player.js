import bird from '../assets/bird.png'

export default class Player {
  constructor(container, image = bird) {
    this.container = container
    this.image = image
    this.player = document.createElement('div')

    this.height = 40
    this.width = 40

    this.player.style.height = `${this.height}px`
    this.player.style.width = `${this.width}px`
    this.player.style.position = 'absolute'
    this.player.style.left = '40%'
    this.player.style.top = '0'
    this.player.style.zIndex = '3'
    this.player.style.willChange = 'transform'
    this.player.setAttribute('id', 'player')

    this.createAppearance()
  }

  get() {
    return this.player
  }

  getCoordonates() {
    return this.player.getBoundingClientRect()
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
}
