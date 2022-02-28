import { useEffect, useState } from "react"

import { isValidCommandSequence } from "../models/command"
import { ErrorWithPosition } from "../models/error"
import { GridType } from "../models/grid"
import { RoverPosition, RoverResult, runCommandSequence } from "../models/rover"

const useRoverPath = (
  rover: RoverPosition,
  grid: GridType,
  sequence: string
): [RoverPosition[], VoidFunction] => {
  const [roverPathResult, setRoverPathResult] = useState<RoverResult[]>([])

  const roverPath = roverPathResult.map(({ position }) => position)
  const clearRoverPath = () => setRoverPathResult([])

  // Run this when sequence changes
  useEffect(() => {
    // If the command sequence has been shortened, trim the computed path
    if (sequence.length < roverPathResult.length) {
      setRoverPathResult(roverPathResult.slice(0, sequence.length))
      return
    }

    // If sequence is empty or invalid do nothing
    if (sequence.length === 0) return
    if (!isValidCommandSequence(sequence)) return

    // Get last path result, including error status, or start with current rover position
    const lastResult = roverPathResult.slice(-1)[0] || { position: rover }

    // If the last rover path resulted in an error, do not run any more commands
    if (lastResult.error) return

    // Run command and get position and possible error
    const { position, error } = runCommandSequence(
      grid,
      lastResult.position,
      sequence[sequence.length - 1]
    )

    // If an error was returned with a position (OutOfBounds, ObstacleEncountered),
    // use the position returned in the error.
    const result: RoverResult = {
      position: error instanceof ErrorWithPosition ? error.position : position,
      error,
    }

    setRoverPathResult(roverPathResult.concat(result))
  }, [sequence])

  return [roverPath, clearRoverPath]
}

export default useRoverPath
