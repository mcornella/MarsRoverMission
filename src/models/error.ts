import { RoverPosition } from "./rover"

export class ErrorWithPosition extends Error {
  position: RoverPosition

  constructor(message: string, position: RoverPosition) {
    super(message)
    this.name = "ErrorWithPosition"
    this.position = position
  }
}

export class OutOfBoundsError extends ErrorWithPosition {
  constructor(position: RoverPosition) {
    super(`Out of bounds at (${position.x}, ${position.y})`, position)
    this.name = "OutOfBoundsError"
  }
}

export class ObstacleFoundError extends ErrorWithPosition {
  constructor(position: RoverPosition) {
    super(`Obstacle encountered at (${position.x}, ${position.y})!`, position)
    this.name = "ObstacleFoundError"
  }
}

export class EmptyCommandSequenceError extends Error {
  constructor() {
    super("Empty command sequence!")
    this.name = "EmptyCommandSequenceError"
  }
}

export class InvalidCommandSequenceError extends Error {
  constructor(sequence: string) {
    super(`Invalid sequence: ${sequence}`)
    this.name = "InvalidCommandSequenceError"
  }
}
