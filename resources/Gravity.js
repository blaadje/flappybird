export default class Gravity {
  constructor(container, entity) {
    this.container = container
    this.position = container.clientHeight / 2
    this.gravity = 0.25
    this.jump = -5
    this.acceleration = 0
    this.entity = entity
    this.rotation = '0deg'
    this.angleDownTimeout = 0
    this.updateRotation = false
    this.onEntityTouchedGroundCallback = null

    this.updateEntityPosition()
  }

  setGameStarted() {
    this.render()
  }

  triggerRise() {
    this.rotation = '-20deg'
    this.acceleration = this.jump

    clearTimeout(this.angleDownTimeout)
    this.updateRotation = false

    this.angleDownTimeout = setTimeout(() => {
      this.updateRotation = true
    }, 700)
  }

  updateEntityPosition() {
    this.entity.get().style.transform = `translateY(${this.position}px) translateZ(0) rotate(${this.rotation})`
  }

  checkEntityTouchedGround() {
    if (
      this.entity.getCoordonates().bottom >=
      this.container.getBoundingClientRect().bottom
    ) {
      this.onEntityTouchedGroundCallback()
    }
  }

  onEntityTouchedGround(callback) {
    this.onEntityTouchedGroundCallback = callback
  }

  render() {
    if (this.updateRotation) {
      this.rotation = `${Math.min((this.acceleration / 15) * 90, 90)}deg`
    }

    this.acceleration = this.acceleration + this.gravity
    this.position = this.position + this.acceleration

    this.updateEntityPosition()
    this.checkEntityTouchedGround()
  }
}
