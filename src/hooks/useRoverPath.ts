import { useEffect, useState } from "react"

import { isValidCommandSequence } from "../models/command"
import { GridType } from "../models/grid"
import { RoverPosition, RoverResult, runCommandSequence } from "../models/rover"

const useRoverPath = (
  rover: RoverPosition,
  grid: GridType,
  sequence: string
): [RoverResult[], () => void] => {
  const [roverPath, setRoverPath] = useState<RoverResult[]>([])
  const clearRoverPath = () => setRoverPath([])

  useEffect(() => {
    // Check if the computed path is longer than the command sequence
    if (sequence.length < roverPath.length) {
      setRoverPath(roverPath.slice(0, sequence.length))
      return
    }

    // If sequence is empty or invalid do nothing
    if (sequence.length === 0) return
    if (!isValidCommandSequence(sequence)) return

    // Get last path position or start from current rover position
    const lastPathResult =
      roverPath.length > 0
        ? roverPath[roverPath.length - 1]
        : { position: rover }

    // If the last rover path resulted in an error, do not add run any more commands
    if (lastPathResult.error) {
      return
    }

    // Get last position or current rover position
    const lastPathPosition = lastPathResult.position

    // Run command and get position and possible error
    const { position, error } = runCommandSequence(
      grid,
      lastPathPosition,
      sequence[sequence.length - 1]
    )

    // If there was an obstacle get the obstacle position
    if (error) {
      setRoverPath(
        roverPath.concat({
          error,
          position: "position" in error ? error.position : position,
        })
      )
      return
    }

    setRoverPath(roverPath.concat({ position }))
  }, [sequence])

  return [roverPath, clearRoverPath]
}

export default useRoverPath
