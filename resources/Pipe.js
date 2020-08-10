import pipeImage from '../assets/pipe-green.png'

let generatedPipeNumber = 0

export default class Pipe {
  constructor(pourcentage, playerSize) {
    generatedPipeNumber = generatedPipeNumber + 1
    this.pipe = document.createElement('div')

    const pipeWidth = 70
    const gutterOffset = 40
    const distanceOffest = 140
    const gutterHeight = playerSize + gutterOffset
    const topPipeHeight = `calc(${pourcentage}% - ${gutterHeight}px)`
    const bottomPipeHeight = `calc(${100 - pourcentage}% - ${gutterHeight}px)`

    this.pipe.style.display = 'flex'
    this.pipe.style.flexDirection = 'column'
    this.pipe.style.position = 'absolute'
    this.pipe.style.left = `${
      (pipeWidth + distanceOffest) * generatedPipeNumber
    }px`
    this.pipe.style.top = '0px'

    this.pipe.style.width = `${pipeWidth}px`
    this.pipe.style.height = '100%'

    this.createTopPart(topPipeHeight)
    this.createBottomPart(bottomPipeHeight)
  }

  get() {
    return this.pipe
  }

  getCoordonates() {
    return this.pipe.getBoundingClientRect()
  }

  getTopSection() {
    const [topSectionElement] = this.pipe.childNodes

    return topSectionElement
  }
  getBottomSection() {
    const [_, bottomSectionElement] = this.pipe.childNodes

    return bottomSectionElement
  }

  createTopPart(pipeHeight) {
    const topSection = document.createElement('div')

    topSection.style.height = pipeHeight
    topSection.style.background = `url(${pipeImage}) no-repeat`
    topSection.style.backgroundSize = 'cover'
    topSection.style.transform = 'rotate(180deg)'

    this.pipe.appendChild(topSection)
  }

  createBottomPart(pipeHeight) {
    const bottomSection = document.createElement('div')

    bottomSection.style.marginTop = 'auto'
    bottomSection.style.height = pipeHeight
    bottomSection.style.background = `url(${pipeImage}) no-repeat`
    bottomSection.style.backgroundSize = 'cover'

    this.pipe.appendChild(bottomSection)
  }
}
