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
const numberOfCircles = 5

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

function findAngle(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
) {
  let a = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2),
    b = Math.pow(x2 - x3, 2) + Math.pow(y2 - y3, 2),
    c = Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2)
  return Math.acos((a + b - c) / Math.sqrt(4 * a * b))
}

function updateCirclePositions(circles: Circle[]) {
  // initialising circles
  if (circles.length == 0) {
    for (let i = 0; i < numberOfCircles; i++) {
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
  for (let i = 0; i < numberOfCircles; i++) {
    if (i == 0) {
      circles[i].x = currentMousePosition.x
      circles[i].y = currentMousePosition.y
      // console.log("updated circle 0")
      continue
    }

    const x1 = circles[i - 1].x
    const y1 = circles[i - 1].y
    const x2 = circles[i].x
    const y2 = circles[i].y

    /* DISTANCE CONSTRAINT */
    // check distance between current circle and the one before
    // positions of both circles
    const distance = distanceBetweenPoints({ x1, y1 }, { x2, y2 })

    // console.log(distance)
    // if (distance > gapBetweenCircles) {
    // console.log("out of range")

    const ratioOfDistances = gapBetweenCircles / distance

    // calculating the required point that is in range of the prev circle

    const newPositionX = (1 - ratioOfDistances) * x1 + ratioOfDistances * x2
    const newPositionY = (1 - ratioOfDistances) * y1 + ratioOfDistances * y2
    circles[i].x = newPositionX
    circles[i].y = newPositionY
    // }
    /* ANGLE CONSTRAINT */
    if (i < circles.length - 1) {
      // co-ords to the next circle
      const x3 = circles[i + 1].x
      const y3 = circles[i + 1].y

      // angle b/w the previous point to the current
      // const angleWithPreviousCircle = Math.atan2(dy, dx)
      const angleWithNextCircle =
        (findAngle(x1, y1, x2, y2, x3, y3) * 180) / Math.PI
      if (i == 1) console.log(angleWithNextCircle)
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
  context.fillStyle = "#222222"
  context.fillRect(0, 0, 1280, 720)
  // console.log(currentMousePosition)

  updateCirclePositions(circles)
  // drawing the circle
  drawCircles(context, circles)

  window.requestAnimationFrame(draw)
}

init()
