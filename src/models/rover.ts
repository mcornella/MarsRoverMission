import { Command, isValidCommandSequence } from "./command"
import {
  EmptyCommandSequenceError,
  ErrorWithPosition,
  InvalidCommandSequenceError,
  ObstacleEncounteredError,
  OutOfBoundsError,
} from "./error"
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
  error?: Error | ErrorWithPosition
}
export type RoverResult = Result<"position", RoverPosition>

export const runCommandSequence = (
  grid: GridType,
  rover: RoverPosition,
  sequence: string
): RoverResult => {
  // Check command sequence is not empty
  if (sequence.length === 0)
    return {
      position: rover,
      error: new EmptyCommandSequenceError(),
    }

  // Check command sequence only contains valid commands
  if (!isValidCommandSequence(sequence)) {
    return {
      position: rover,
      error: new InvalidCommandSequenceError(sequence),
    }
  }

  // Check rover is in a valid grid cell
  let position = rover

  if (isOutOfBounds(grid, position)) {
    return {
      position,
      error: new OutOfBoundsError(position),
    }
  }

  if (hasObstacle(grid, position)) {
    return {
      position,
      error: new ObstacleEncounteredError(position),
    }
  }

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
      error: new OutOfBoundsError({ x, y, direction }),
    }
  }

  if (hasObstacle(grid, { x, y })) {
    return {
      position: { ...rover, direction },
      error: new ObstacleEncounteredError({ x, y, direction }),
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
    case Command.Left:
      direction = direction - 90
      if (direction < 0) direction += 360
      break
    case Command.Right:
      direction = direction + 90
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
