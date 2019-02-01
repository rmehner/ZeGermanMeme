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
    inputs: [{ placeholder: '¯\\_(ツ)_/¯', position: { x: 75, y: 300 } }],
  },
  david_und_die_gesichtspalme: {
    src: 'images/david_und_die_gesichtspalme.jpg',
    inputs: [
      { placeholder: 'David', position: { x: 75, y: 300 } },
      { placeholder: 'Leo', position: { x: 450, y: 400 } },
    ],
  },
}

const drawStateOnCanvas = state => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.drawImage(state.image, 0, 0)

  state.texts.forEach(text => {
    context.font = text.font || '48px serif'
    context.fillStyle = '#FFFFFF'
    context.fillText(text.value, text.x, text.y)
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
      const tag = document.createElement('input')
      tag.placeholder = input.placeholder
      // TODO: remove event listeners to not leak memory
      tag.addEventListener('input', e => {
        canvasState.texts[index] = {
          value: e.target.value,
          x: input.position.x,
          y: input.position.y,
        }
        drawStateOnCanvas(canvasState)
      })

      inputs.appendChild(tag)
    })
    drawStateOnCanvas(canvasState)
  }
}

select.addEventListener('change', e => {
  inputs.querySelectorAll('input').forEach(input => {
    inputs.removeChild(input)
  })
  loadTemplate(e.target.value)
})

loadTemplate('gesichtspalme')
