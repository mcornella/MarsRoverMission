import { setUncaughtExceptionCaptureCallback } from "process"
import { RoverPosition } from "./rover"

class ErrorWithPosition extends Error {
  private _position: RoverPosition

  constructor(message: string, position: RoverPosition) {
    super(message)
    this.name = "ErrorWithPosition"
    this._position = position
  }

  get position() {
    return this._position
  }
}

export class OutOfBoundsError extends ErrorWithPosition {
  constructor(position: RoverPosition) {
    super(`Out of bounds at (${position.x}, ${position.y})`, position)
    this.name = "OutOfBoundsError"
  }
}

export class ObstacleEncounteredError extends ErrorWithPosition {
  constructor(position: RoverPosition) {
    super(`Obstacle encountered at (${position.x}, ${position.y})!`, position)
    this.name = "ObstacleEncounteredError"
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
