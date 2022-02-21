import { Command, isValidCommandSequence } from "./command"
import { Coordinates, GridType, hasObstacle, isOutOfBounds } from "./grid"

export enum Direction {
  N = 0,
  E = 90,
  S = 180,
  W = 270,
}

export type RoverPosition = Coordinates & {
  direction: Direction
}

type Result<K extends string, T> = Record<K, T> & {
  error?: Error
}
type RoverResult = Result<"position", RoverPosition>

export const runCommandSequence = (
  grid: GridType,
  rover: RoverPosition,
  sequence: string
): RoverResult => {
  if (sequence.length === 0)
    return {
      position: rover,
      error: new Error(`Empty command sequence!`),
    }

  if (!isValidCommandSequence(sequence)) {
    return {
      position: rover,
      error: new Error(`Invalid sequence: ${sequence}`),
    }
  }

  let position = rover
  const commands = sequence.split("") as Command[]
  for (let i = 0; i < commands.length; i++) {
    const result = move(grid, position, commands[i])

    if (result.error) return result
    else position = result.position
  }

  return { position }
}

const move = (
  grid: GridType,
  rover: RoverPosition,
  cmd: Command
): RoverResult => {
  const { direction } = rotate(rover, cmd)
  const { x, y } = moveForward({ ...rover, direction })

  if (isOutOfBounds(grid, { x, y })) {
    return {
      position: { ...rover, direction },
      error: new Error(`Out of bounds at (${x}, ${y})`),
    }
  }

  if (hasObstacle(grid, { x, y })) {
    return {
      position: { ...rover, direction },
      error: new Error(`Obstacle encountered at (${x}, ${y})!`),
    }
  }

  return {
    position: { x, y, direction },
  }
}

const rotate = (
  { x, y, direction }: RoverPosition,
  cmd: Command
): RoverPosition => {
  switch (cmd) {
    case Command.Forward:
      break
    case Command.Left:
      direction = direction - 90
      if (direction < 0) direction += 360
      break
    case Command.Right:
      direction = (direction + 90) % 360
      if (direction >= 360) direction -= 360
      break
  }

  return {
    x,
    y,
    direction,
  }
}

const moveForward = ({ x, y, direction }: RoverPosition): RoverPosition => {
  switch (direction) {
    case Direction.N:
      x--
      break
    case Direction.S:
      x++
      break
    case Direction.W:
      y--
      break
    case Direction.E:
      y++
      break
  }

  return {
    x,
    y,
    direction,
  }
}
