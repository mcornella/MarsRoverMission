import { RoverPosition } from "./rover"

export type GridType = boolean[][]

export const randomGrid = ({
  gridSize,
  rover,
  obstacleProbability = 0.15,
}: {
  gridSize: number
  rover: RoverPosition
  obstacleProbability?: number
}): GridType => {
  if (gridSize < 1) throw new Error("Grid size must be greater than 0")
  if (obstacleProbability < 0 || obstacleProbability >= 1)
    throw new Error("Obstacle probability must be between 0 and 1")

  const newObstacle = (x: number, y: number) =>
    x != rover.x && y != rover.y && Math.random() < obstacleProbability

  return Array(gridSize)
    .fill([])
    .map((_, i) =>
      Array(gridSize)
        .fill(false)
        .map((_, j) => newObstacle(i, j))
    )
}
