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

function distanceBetweenPoints(
  { x1, y1 }: { x1: number; y1: number },
  { x2, y2 }: { x2: number; y2: number }
): number {
  const x = x2 - x1
  const y = y2 - y1
  return Math.sqrt(x * x + y * y)
}

function updateCirclePositions(circles: Circle[]) {
  // initialising circles
  if (circles.length == 0) {
    for (let i = 0; i < 4; i++) {
      const circle = new Circle(
        currentMousePosition.x + gapBetweenCircles * i,
        currentMousePosition.y,
        radiusOfCircle
      )
      circles.push(circle)
    }
    return
  }

  //updating circles
  for (let i = 0; i < 4; i++) {
    if (i == 0) {
      circles[i].x = currentMousePosition.x
      circles[i].y = currentMousePosition.y
      // console.log("updated circle 0")
      continue
    }

    /// need to add stuff here

    // check distance between current circle and the one before
    // positions of both circles
    const x1 = circles[i - 1].x
    const y1 = circles[i - 1].y
    const x2 = circles[i].x
    const y2 = circles[i].y
    const distance = distanceBetweenPoints({ x1, y1 }, { x2, y2 })

    // console.log(distance)
    if (distance > gapBetweenCircles) {
      console.log("out of range")

      const ratioOfDistances = gapBetweenCircles / distance

      // calculating the required point that is in range of the prev circle

      const x3 = (1 - ratioOfDistances) * x1 + ratioOfDistances * x2
      const y3 = (1 - ratioOfDistances) * y1 + ratioOfDistances * y2
      circles[i].x = x3
      circles[i].y = y3
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
