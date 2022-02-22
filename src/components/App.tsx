import React, { useEffect, useState } from "react"

import { isValidCommandSequence } from "../models/command"
import { ObstacleEncounteredError } from "../models/error"
import { GridType, hasObstacle, randomGrid } from "../models/grid"
import { Direction, RoverPosition, runCommandSequence } from "../models/rover"

import Controls from "./Controls"
import ErrorPrompt from "./ErrorPrompt"
import Grid from "./Grid"

import "./App.css"

const App: React.FC<{}> = () => {
  const [gridSize, setGridSize] = useState(10)
  const [rover, setRover] = useState<RoverPosition>({
    x: 5,
    y: 5,
    direction: Direction.N,
  })
  const [sequence, setCommandSequence] = useState("")
  const [grid, setGrid] = useState<GridType>(randomGrid({ gridSize, rover }))
  const [futurePath, setFuturePath] = useState<RoverPosition[]>([])
  const [error, setError] = useState<Error | null>(null)

  function simulate() {
    setCommandSequence("")
    setFuturePath([])

    if (sequence.length === 0) return
    if (!isValidCommandSequence(sequence)) return

    // Run command and get position and possible error
    const { position, error } = runCommandSequence(grid, rover, sequence)

    // Update rover position
    setRover(position)

    // If an error was returned, show it after React has finished rendering
    if (error) {
      setError(error)
    }
  }

  useEffect(() => {
    // Check if the computed future path is longer than the command sequence
    if (sequence.length < futurePath.length) {
      setFuturePath(futurePath.slice(0, sequence.length))
      return
    }

    if (sequence.length === 0) return
    if (!isValidCommandSequence(sequence)) return

    // Get previous future rover position or current rover position
    const lastFuturePosition =
      futurePath.length > 0 ? futurePath[futurePath.length - 1] : rover

    // Check if last position is in an obstacle: if it is, stop future path
    if (hasObstacle(grid, lastFuturePosition)) {
      return
    }

    // Run command and get position and possible error
    const { position, error } = runCommandSequence(
      grid,
      lastFuturePosition,
      sequence[sequence.length - 1]
    )

    // If there was an obstacle get the obstacle position
    if (error) {
      if (error instanceof ObstacleEncounteredError) {
        setFuturePath(futurePath.concat([error.position]))
      }
      return
    }

    setFuturePath(futurePath.concat([position]))
  }, [sequence])

  return (
    <div className="App">
      <ErrorPrompt error={error} clear={() => setError(null)} />
      <Controls
        rover={{ position: rover, set: setRover }}
        sequence={{ value: sequence, set: setCommandSequence, run: simulate }}
        grid={{
          size: gridSize,
          set: setGridSize,
          new: () => setGrid(randomGrid({ gridSize, rover })),
        }}
      />
      <Grid grid={grid} rover={rover} futurePath={futurePath} />
    </div>
  )
}

export default App
