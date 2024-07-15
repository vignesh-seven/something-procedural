import "./style.css"

window.addEventListener("mousemove", function (event) {
  let canvasElement = document.querySelector("canvas")
  getMousePosition(event, canvasElement)
})

let currentMousePosition = { x: 0, y: 0 }

class Circle {
  x: number
  y: number
  radius: number
  constructor(x: number, y: number, radius: number) {
    this.x = x
    this.y = y
    this.radius = radius
  }
}

let circles: Circle[] = []

const gapBetweenCircles = 45
const radiusOfCircle = 10

function init() {
  updateCirclePositions(circles)
  window.requestAnimationFrame(draw)
}

function updateCirclePositions(circles: Circle[]) {
  // initialising circles
  if (circles.length == 0) {
    for (let i = 0; i < 2; i++) {
      const circle = new Circle(
        currentMousePosition.x + gapBetweenCircles * i,
        currentMousePosition.y,
        radiusOfCircle
      )
      circles.push(circle)
    }
  } else {
    for (let i = 0; i < 2; i++) {
      circles[i].x = currentMousePosition.x + gapBetweenCircles * i
      circles[i].y = currentMousePosition.y
    }
  }
}

function getMousePosition(
  event: MouseEvent | null,
  canvasElement: HTMLCanvasElement | null
) {
  // if (!event) return
  // else {
  if (!canvasElement || !event) return
  let rect = canvasElement.getBoundingClientRect()
  let x = event.clientX - rect.left
  let y = event.clientY - rect.top
  const position = { x, y }
  currentMousePosition = position
  // }
}
updateCirclePositions(circles)
function drawCircles(context: CanvasRenderingContext2D, circles: Circle[]) {
  circles.forEach((circle) => {
    context.beginPath()
    context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI)
    context.fillStyle = "red"
    context.fill()
  })
}

function draw() {
  const canvas = document.querySelector("canvas")

  if (!canvas) return
  const context = canvas.getContext("2d")
  if (!context) return

  // filling the background
  context.fillStyle = "brown"
  context.fillRect(0, 0, 1280, 720)
  // console.log(currentMousePosition)

  updateCirclePositions(circles)
  // drawing the circle
  drawCircles(context, circles)

  window.requestAnimationFrame(draw)
}

init()
