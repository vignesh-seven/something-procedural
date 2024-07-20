import "./style.css"

window.addEventListener("mousemove", function (event) {
  let canvasElement = document.querySelector("canvas")
  getMousePosition(event, canvasElement)
})

let currentMousePosition: Point = { x: 0, y: 0 }

class Circle {
  position: Point
  radius: number
  constructor(x: number, y: number, radius: number) {
    this.position = { x, y }
    // this.position.y = y
    this.radius = radius
  }
}
interface Point {
  x: number
  y: number
}
let circles: Circle[] = []

const gapBetweenCircles = 45
const radiusOfCircle = 10
const numberOfCircles = 3

function init() {
  updateCirclePositions(circles)
  window.requestAnimationFrame(draw)
}

function distanceBetweenPoints(pointA: Point, pointB: Point): number {
  const x = pointB.x - pointA.x
  const y = pointB.y - pointA.y
  return Math.sqrt(x * x + y * y)
}

// function findAngle(
//   x1: number,
//   y1: number,
//   x2: number,
//   y2: number,
//   x3: number,
//   y3: number
// ) {
//   let a = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2),
//     b = Math.pow(x2 - x3, 2) + Math.pow(y2 - y3, 2),
//     c = Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2)
//   return Math.acos((a + b - c) / Math.sqrt(4 * a * b))
// }
function calculateAngleFromXAxis(pointA: Point, pointB: Point): number {
  return (Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x) * 180) / Math.PI
}
function calculateAngle(A: Point, B: Point, C: Point) {
  // Vectors AB and BC
  const AB = { x: B.x - A.x, y: B.y - A.y }
  const BC = { x: C.x - B.x, y: C.y - B.y }

  // Dot product of AB and BC
  const dotProduct = AB.x * BC.x + AB.y * BC.y

  // Magnitudes of AB and BC
  const magnitudeAB = Math.sqrt(AB.x ** 2 + AB.y ** 2)
  const magnitudeBC = Math.sqrt(BC.x ** 2 + BC.y ** 2)

  // Cosine of the angle
  const cosTheta = dotProduct / (magnitudeAB * magnitudeBC)

  // Angle in radians
  const angleRadians = Math.acos(cosTheta)

  // Convert angle to degrees
  const angleDegrees = angleRadians * (180 / Math.PI)

  // let angleDegreesDirectional = angleDegrees
  // if (dotProduct < 0) angleDegreesDirectional *= -1

  return angleDegrees
}

// function rotatePoint(point: Point, center: Point, angle: number) {
//   const radians = angle * (Math.PI / 180)
//   const cos = Math.cos(radians)
//   const sin = Math.sin(radians)

//   const translatedX = point.x - center.x
//   const translatedY = point.y - center.y

//   const rotatedX = translatedX * cos - translatedY * sin + center.x
//   const rotatedY = translatedX * sin + translatedY * cos + center.y

//   return { x: rotatedX, y: rotatedY }
// }
function rotatePoint(point: Point, center: Point, angle: number) {
  let radians = angle * (Math.PI / 180) // Convert to radians
  let cos = Math.cos(radians)
  let sin = Math.sin(radians)

  let x = cos * (point.x - center.x) - sin * (point.y - center.y) + center.x
  let y = sin * (point.x - center.x) + cos * (point.y - center.y) + center.y

  return { x: x, y: y }
}
function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360
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
      circles[i].position.x = currentMousePosition.x
      circles[i].position.y = currentMousePosition.y
      // console.log("updated circle 0")
      continue
    }

    const x1 = circles[i - 1].position.x
    const y1 = circles[i - 1].position.y
    const previousPoint: Point = {
      x: circles[i - 1].position.x,
      y: circles[i - 1].position.y,
    }
    const x2 = circles[i].position.x
    const y2 = circles[i].position.y
    const currentPoint: Point = {
      x: circles[i].position.x,
      y: circles[i].position.y,
    }
    /* DISTANCE CONSTRAINT */
    // check distance between current circle and the one before
    // positions of both circles
    const distance = distanceBetweenPoints({ x: x1, y: y1 }, { x: x2, y: y2 })

    // console.log(distance)
    // if (distance > gapBetweenCircles) {
    // console.log("out of range")

    const ratioOfDistances = gapBetweenCircles / distance

    // calculating the required point that is in range of the prev circle

    const newPositionX = (1 - ratioOfDistances) * x1 + ratioOfDistances * x2
    const newPositionY = (1 - ratioOfDistances) * y1 + ratioOfDistances * y2
    circles[i].position.x = newPositionX
    circles[i].position.y = newPositionY
    // }
    /* ANGLE CONSTRAINT */
    if (i < circles.length - 1) {
      // co-ords to the next circle
      const x3 = circles[i + 1].position.x
      const y3 = circles[i + 1].position.y
      const nextPoint: Point = {
        x: circles[i + 1].position.x,
        y: circles[i + 1].position.y,
      }

      //////////////////////////////////////////
      // if (i == 1) {
      // the above "if" is here for testing purposes, otherwise the logs will be flooded

      // check for angle
      const angle = calculateAngle(previousPoint, currentPoint, nextPoint)
      // console.log(angle)
      const parentLineAngle = calculateAngleFromXAxis(
        previousPoint,
        currentPoint
      )

      // "Normal" is the angle normalized to 0 to 360 instead of -180 to 180
      const parentLineAngleNormal =
        parentLineAngle < 0
          ? 180 + (180 - parentLineAngle * Math.sign(parentLineAngle))
          : parentLineAngle
      const childLineAngle = calculateAngleFromXAxis(currentPoint, nextPoint)
      const childLineAngleNormal =
        childLineAngle < 0
          ? 180 + (180 - childLineAngle * Math.sign(childLineAngle))
          : childLineAngle
      let parentChildNormalDiff = parentLineAngleNormal - childLineAngleNormal
      let parentChildDiff = parentLineAngle - childLineAngle
      // determines the direction of the rotation
      // if (parentLineAngle > childLineAngle) {
      //   rotationDirection = "clockwise"
      // }
      let rotationDirection = -1
      if (parentLineAngle >= childLineAngle) {
        rotationDirection = 1
      }
      // let rotationAngle =
      //   Math.sign(90 - angle) * (90 - angle) * rotationDirection
      console.log({
        // parentLineAngleNormal,
        // childLineAngleNormal,
        // parentLineAngle,
        // childLineAngle,
        parentChildNormalDiff,
        parentChildDiff,
        // angle,
        // rotationDirection,
        // rotationAngle: -(90 - angle) * rotationDirection,
        // rotationAngle: -(90 - angleDiff) * rotationDirection,
      })
      if (angle > 90) {
        const rotationAngle = (angle - 90) * rotationDirection
        // const rotationAngle = 30 * rotationDirection
        // if (rotationAngle > 45) {
        // console.warn({
        //   parentLineAngleNormal,
        //   childLineAngleNormal,
        //   angle,
        //   rotationAngle,
        //   rotationDirection,
        // })
        // }
        // const rotatedPoint = rotatePoint(
        //   nextPoint,
        //   currentPoint,
        //   rotationAngle
        //   // -(90 - angleDiff) * rotationDirection
        // )
        // circles[i + 1].position.x = rotatedPoint.x
        // circles[i + 1].position.y = rotatedPoint.y
      }
      // }

      /////////////////////////////////////////
      // angle b/w the previous point to the current
      // const angleWithPreviousCircle = Math.atan2(dy, dx)
      // const angleWithNextCircle =
      // (findAngle(x1, y1, x2, y2, x3, y3) * 180) / Math.PI

      ///////////////////////////////
      // if (angleWithNextCircle < 90) {
      //   console.log(angleWithNextCircle)
      //   circles[i + 1].x =
      //     newPositionX +
      //     (radiusOfCircle + gapBetweenCircles) * Math.cos(Math.PI / 2)
      //   circles[i + 1].y =
      //     newPositionY +
      //     (radiusOfCircle + gapBetweenCircles) * Math.sin(Math.PI / 2)
      // }
      // if (i == 1) console.log(angleWithNextCircle)

      // x = cos(a)  ; y = sin(a)
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
    context.arc(
      circle.position.x,
      circle.position.y,
      circle.radius,
      0,
      2 * Math.PI
    )
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
