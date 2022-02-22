import React, { useEffect, useState } from "react"

import { isValidCommandSequence } from "../models/command"
import { GridType, randomGrid } from "../models/grid"
import { Direction, RoverPosition, runCommandSequence } from "../models/rover"

import Controls from "./Controls"
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

  function simulate() {
    if (sequence.length === 0) return
    if (!isValidCommandSequence(sequence)) return

    // Run command and get position and possible error
    const { position, error } = runCommandSequence(grid, rover, sequence)

    // Update rover position
    setRover(position)

    // If an error was returned, show it after React has finished rendering
    if (error) {
      setTimeout(() => alert(error.message), 0)
    }

    setCommandSequence("")
    setFuturePath([])
  }

  useEffect(() => {
    if (sequence.length === 0) return
    if (!isValidCommandSequence(sequence)) return

    // Get previous future rover position or current rover position
    const lastFuturePosition =
      futurePath.length > 0 ? futurePath[futurePath.length - 1] : rover

    // Check if the computed future path is longer than the command sequence
    if (sequence.length < futurePath.length) {
      setFuturePath(futurePath.slice(0, sequence.length))
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
      if (error.message.startsWith("Obstacle encountered")) {
        const [x, y] = error.message
          .match(/\((\d+), (\d+)\)/)!
          .slice(1)
          .map((s) => parseInt(s, 10))
        setFuturePath(
          futurePath.concat([{ x, y, direction: lastFuturePosition.direction }])
        )
      }
      return
    }

    setFuturePath(futurePath.concat([position]))
  }, [sequence])

  return (
    <div className="App">
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
