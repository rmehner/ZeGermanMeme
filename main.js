const canvas = document.getElementById('myLittleCanvas')
const context = canvas.getContext('2d')
const select = document.getElementById('template')
const inputs = document.getElementById('inputs')

const canvasState = {
  image: null,
  texts: [],
}

const templates = {
  gesichtspalme: {
    src: 'images/gesichtspalme.jpg',
    inputs: [
      {
        placeholder: '¯\\_(ツ)_/¯',
        position: { x: 150, y: 250 },
        maxWidth: 200,
      },
    ],
  },
  david_und_die_gesichtspalme: {
    src: 'images/david_und_die_gesichtspalme.jpg',
    inputs: [
      { placeholder: 'David', position: { x: 150, y: 350 }, maxWidth: 200 },
      { placeholder: 'Leo', position: { x: 500, y: 400 }, maxWidth: 150 },
    ],
  },
}

const defaultFontSize = 48
const defaultLineWidth = 3

const resetFontSize = () => {
  context.font = `bold ${defaultFontSize}px sans-serif`
}

const resetLineWidth = () => {
  context.lineWidth = defaultLineWidth
}

const setIdealFontSizeForText = (text, maxWidth) => {
  let idealFontSize = defaultFontSize
  let idealLineWidth = defaultLineWidth

  while (context.measureText(text).width > maxWidth) {
    if (idealFontSize <= 0) {
      resetFontSize()
      resetLineWidth()
      return
    }
    idealFontSize--
    idealLineWidth = idealLineWidth - 0.05
    context.font = `bold ${idealFontSize}px sans-serif`
    context.lineWidth = idealLineWidth
  }
}

const drawStateOnCanvas = state => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.drawImage(state.image, 0, 0)

  state.texts.forEach(text => {
    context.font = 'bold 48px sans-serif'
    context.fillStyle = '#FFFFFF'
    context.strokeStyle = '#000000'
    context.lineWidth = 3
    context.textBaseline = 'middle'
    context.textAlign = 'center'

    text.value
      .split('\n')
      .reverse()
      .forEach((line, i) => {
        resetLineWidth()
        resetFontSize()
        setIdealFontSizeForText(line, text.maxWidth)
        context.fillText(line, text.x, text.y - i * 48)
        context.strokeText(line, text.x, text.y - i * 48)
      })
  })
}

const loadTemplate = templateName => {
  const template = templates[templateName]
  const image = new Image()
  image.src = template.src
  image.onload = () => {
    canvas.setAttribute('width', image.width)
    canvas.setAttribute('height', image.height)
    canvasState.image = image
    canvasState.texts = []

    template.inputs.forEach((input, index) => {
      const tag = document.createElement('textarea')
      tag.placeholder = input.placeholder
      // TODO: remove event listeners to not leak memory
      tag.addEventListener('input', e => {
        canvasState.texts[index] = {
          value: e.target.value,
          x: input.position.x,
          y: input.position.y,
          maxWidth: input.maxWidth,
        }
        drawStateOnCanvas(canvasState)
      })

      inputs.appendChild(tag)
    })
    drawStateOnCanvas(canvasState)
  }
}

select.addEventListener('change', e => {
  inputs.querySelectorAll('textarea').forEach(input => {
    inputs.removeChild(input)
  })
  loadTemplate(e.target.value)
})

loadTemplate('gesichtspalme')
