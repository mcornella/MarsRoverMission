import { RoverPosition } from "./rover"

export type Coordinates = {
  x: number
  y: number
}

export type GridType = boolean[][]

export const isOutOfBounds = (grid: GridType, { x, y }: Coordinates): boolean =>
  x < 0 || x >= grid.length || y < 0 || y >= grid[0].length

export const hasObstacle = (grid: GridType, { x, y }: Coordinates): boolean =>
  grid[x][y]

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
    x !== rover.x && y !== rover.y && Math.random() < obstacleProbability

  return Array(gridSize)
    .fill([])
    .map((_, i) =>
      Array(gridSize)
        .fill(false)
        .map((_, j) => newObstacle(i, j))
    )
}
